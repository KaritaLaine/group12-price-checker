import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "../../src/index"
import User from "../../src/models/user"
import Store from "../../src/models/store"
import Product from "../../src/models/product"
import StoreProduct from "../../src/models/storeProduct"

const createStoreWithOwner = async (
  name: string,
  coordinates: [number, number]
) => {
  const user = await User.create({
    username: `owner-${name}-${Date.now()}-${Math.random()}`,
    email: `${name}-${Date.now()}@example.com`,
    password: "Password123!",
    role: "storeUser",
    status: "unlocked",
  })

  const store = await Store.create({
    name,
    location: { type: "Point", coordinates },
    owner: user._id,
  })

  return store
}

describe("Product routes", () => {
  it("returns price comparison data for a product barcode", async () => {
    const product = await Product.create({
      name: "Coffee Beans",
      barcode: { type: "EAN", gtin: "1111111111111" },
    })
    const referenceStore = await createStoreWithOwner("Ref Store", [
      24.94,
      60.17,
    ])
    const nearbyStore = await createStoreWithOwner("Nearby Store", [
      24.941,
      60.171,
    ])

    await StoreProduct.create({
      product: product._id,
      store: referenceStore._id,
      price: 5.1,
    })
    await StoreProduct.create({
      product: product._id,
      store: nearbyStore._id,
      price: 4.85,
      discountedPrice: 4.5,
    })

    const res = await request(app)
      .get(`/v1/products/barcode/${product.barcode.gtin}/compare`)
      .query({ storeId: referenceStore._id.toString(), maxDistance: 5000 })

    expect(res.status).toBe(200)
    expect(res.body.data.product.name).toBe("Coffee Beans")
    expect(res.body.data.currentStore.store.name).toBe("Ref Store")
    expect(res.body.data.nearbyStores.length).toBeGreaterThan(0)
    expect(res.body.data.manualPriceEntryRequired).toBe(false)
  })

  it("returns manual price entry when no store prices exist", async () => {
    const product = await Product.create({
      name: "Green Tea",
      barcode: { type: "EAN", gtin: "2222222222222" },
    })
    const referenceStore = await createStoreWithOwner("Lonely Store", [
      24.96,
      60.18,
    ])

    const res = await request(app)
      .get(`/v1/products/barcode/${product.barcode.gtin}/compare`)
      .query({ storeId: referenceStore._id.toString(), maxDistance: 10000 })

    expect(res.status).toBe(200)
    expect(res.body.data.manualPriceEntryRequired).toBe(true)
    expect(res.body.data.prices).toEqual([])
  })

  it("validates storeId input", async () => {
    const res = await request(app)
      .get("/v1/products/barcode/3333333333333/compare")
      .query({ storeId: "invalid-store-id" })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/valid storeid required/i)
  })

  it("returns 404 when the product is not found by barcode", async () => {
    const store = await createStoreWithOwner("Store Missing Product", [
      24.95,
      60.19,
    ])

    const res = await request(app)
      .get("/v1/products/barcode/9999999999999/compare")
      .query({ storeId: store._id.toString(), maxDistance: 10000 })

    expect(res.status).toBe(404)
    expect(res.body.message).toMatch(/product not found/i)
  })

  it("returns product pricing by name", async () => {
    const product = await Product.create({
      name: "Granola Bar",
      barcode: { type: "EAN", gtin: "4444444444444" },
    })
    const store = await createStoreWithOwner("Granola Store", [25.0, 60.2])
    await StoreProduct.create({
      product: product._id,
      store: store._id,
      price: 1.99,
    })

    const res = await request(app).get(
      `/v1/products/name/${encodeURIComponent(product.name)}/compare`
    )

    expect(res.status).toBe(200)
    expect(res.body.data.product.name).toBe("Granola Bar")
    expect(Array.isArray(res.body.data.prices)).toBe(true)
    expect(res.body.data.prices[0].price).toBe(1.99)
  })
})
