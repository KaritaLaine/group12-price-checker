import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "../../src/index"
import User from "../../src/models/user"
import Store from "../../src/models/store"
import Product from "../../src/models/product"
import StoreProduct from "../../src/models/storeProduct"
import { authUtils } from "../../src/utils/auth"

const createStoreUserWithStore = async () => {
  const user = await User.create({
    username: `store-user-${Date.now()}-${Math.random()}`,
    email: `store-${Date.now()}-${Math.random()}@example.com`,
    password: "Password123!",
    role: "storeUser",
    status: "unlocked",
  })

  const store = await Store.create({
    name: `Store ${Date.now()}`,
    location: {
      type: "Point",
      coordinates: [24.94, 60.17],
    },
    owner: user._id,
  })

  const token = authUtils.generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    status: user.status,
  })

  return { user, store, token }
}

const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
})

describe("Store routes", () => {
  // Store user can update their store details
  it("updates store information for the logged in user", async () => {
    const { store, token } = await createStoreUserWithStore()

    const res = await request(app)
      .put("/v1/store")
      .set(authHeader(token))
      .send({
        storeName: "Updated Store Name",
        latitude: 61.0,
        longitude: 25.0,
      })

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/updated/i)

    const updated = await Store.findById(store._id)
    expect(updated?.name).toBe("Updated Store Name")
    expect(updated?.location.coordinates).toEqual([25.0, 61.0])
  })

  // Store user can add a product to inventory
  it("adds a new product to the store inventory", async () => {
    const { store, token } = await createStoreUserWithStore()
    const payload = {
      name: "Whole Milk",
      barcodeType: "EAN",
      gtin: "1234567890128",
      price: 3.99,
      location: "Aisle 1",
    }

    const res = await request(app)
      .post("/v1/store/products")
      .set(authHeader(token))
      .send(payload)

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/products added/i)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data).toHaveLength(1)

    const product = await Product.findOne({ "barcode.gtin": payload.gtin })
    const storeProduct = await StoreProduct.findOne({
      product: product?._id,
      store: store._id,
      isCurrent: true,
    })
    expect(product?.name).toBe(payload.name)
    expect(storeProduct?.price).toBe(payload.price)
  })

  // Prevents adding duplicate products to the same store
  it("prevents adding duplicate products to the same store", async () => {
    const { token } = await createStoreUserWithStore()
    const payload = {
      name: "Cheese",
      barcodeType: "EAN",
      gtin: "9876543210987",
      price: 6.5,
      location: "Dairy",
    }

    await request(app)
      .post("/v1/store/products")
      .set(authHeader(token))
      .send(payload)

    const res = await request(app)
      .post("/v1/store/products")
      .set(authHeader(token))
      .send(payload)

    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/already exists/i)
  })

  // Allows adding a discount to an existing store product
  it("applies a discount to an existing store product", async () => {
    const { store, token } = await createStoreUserWithStore()
    const product = await Product.create({
      name: "Orange Juice",
      barcode: { type: "EAN", gtin: "5555555555555" },
    })
    const storeProduct = await StoreProduct.create({
      product: product._id,
      store: store._id,
      price: 4.5,
    })

    const res = await request(app)
      .put(`/v1/store/products/${storeProduct._id.toString()}/discount`)
      .set(authHeader(token))
      .send({ discountedPrice: 3.75 })

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/discount has been added/i)

    const updated = await StoreProduct.findById(storeProduct._id)
    expect(updated?.discountedPrice).toBe(3.75)
  })
})
