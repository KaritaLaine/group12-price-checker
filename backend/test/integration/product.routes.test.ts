import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "../../src/index"
import User from "../../src/models/user"
import Store from "../../src/models/store"
import Product from "../../src/models/product"
import StoreProduct from "../../src/models/storeProduct"

const buildStore = async (name: string, coords: [number, number]) => {
  const user = await User.create({
    username: `${name}-user-${Date.now()}`,
    email: `${name}-${Date.now()}@example.com`,
    password: "Password123!",
    role: "storeUser",
    status: "unlocked",
  })

  const store = await Store.create({
    name,
    location: { type: "Point", coordinates: coords },
    owner: user._id,
  })

  return store
}

describe("GET /v1/products/compare/:barcode", () => {
  it("validates storeId query param", async () => {
    const res = await request(app).get("/v1/products/compare/12345678")

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/storeid required/i)
  })

  it("returns 404 when product is missing", async () => {
    const store = await buildStore("reference", [24.94, 60.17])
    const res = await request(app)
      .get(`/v1/products/compare/99999999`)
      .query({ storeId: store._id.toString() })

    expect(res.status).toBe(404)
    expect(res.body.message).toMatch(/product not found/i)
  })

  it("returns 404 when reference store does not exist", async () => {
    await Product.create({
      name: "Milk",
      barcode: { type: "EAN", gtin: "11111111" },
    })

    const res = await request(app)
      .get(`/v1/products/compare/11111111`)
      .query({ storeId: "507f1f77bcf86cd799439011" })

    expect(res.status).toBe(404)
    expect(res.body.message).toMatch(/reference store not found/i)
  })

  it("returns formatted prices for nearby stores", async () => {
    const product = await Product.create({
      name: "Juice",
      barcode: { type: "EAN", gtin: "22222222" },
    })
    const referenceStore = await buildStore("reference", [24.94, 60.17])
    const nearbyStore = await buildStore("nearby", [24.941, 60.171])

    await StoreProduct.create({
      product: product._id,
      store: referenceStore._id,
      price: 5.5,
    })
    await StoreProduct.create({
      product: product._id,
      store: nearbyStore._id,
      price: 4.0,
      discountedPrice: 3.5,
    })

    const res = await request(app)
      .get(`/v1/products/compare/${product.barcode.gtin}`)
      .query({ storeId: referenceStore._id.toString() })

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/product fetched successfully/i)
    expect(res.body.data.manualPriceEntryRequired).toBe(false)
    expect(res.body.data.currentStore?.store.name).toBe(referenceStore.name)
    expect(res.body.data.nearbyStores).toHaveLength(1)
    expect(res.body.data.nearbyStores[0].store.name).toBe(nearbyStore.name)
  })
})
