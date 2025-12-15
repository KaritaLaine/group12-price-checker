import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "../../src/index"
import User from "../../src/models/user"
import Store from "../../src/models/store"
import { authUtils } from "../../src/utils/auth"

const buildRegisterPayload = (suffix: string) => ({
  username: `storeuser-${suffix}`,
  email: `store-${suffix}@example.com`,
  password: "Password123!",
  storeName: `Test Store ${suffix}`,
  latitude: 60.17,
  longitude: 24.94,
})

const createUser = async (overrides: Partial<User> = {}) => {
  return await User.create({
    username: `login-${Date.now()}-${Math.random()}`,
    email: `login-${Date.now()}-${Math.random()}@example.com`,
    password: "Password123!",
    role: "storeUser",
    status: "unlocked",
    ...overrides,
  } as any)
}

const buildRefreshTokenFor = (user: any) =>
  authUtils.generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    status: user.status,
  })

describe("Auth routes", () => {
  it("registers a store user and creates a store", async () => {
    const payload = buildRegisterPayload("success")

    const res = await request(app).post("/v1/auth/register").send(payload)

    expect(res.status).toBe(201)
    expect(res.body.message).toMatch(/registered/i)

    const user = await User.findOne({ email: payload.email })
    const store = await Store.findOne({ owner: user?._id })
    expect(user).toBeTruthy()
    expect(store?.name).toBe(payload.storeName)
  })

  it("rejects duplicate username or email during registration", async () => {
    const payload = buildRegisterPayload("duplicate")
    await User.create({
      username: payload.username,
      email: payload.email,
      password: payload.password,
    })

    const res = await request(app).post("/v1/auth/register").send(payload)

    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/already in use/i)
  })

  it("logs in an unlocked user and returns tokens", async () => {
    const user = await createUser({ username: "login-success" } as any)

    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "login-success", password: "Password123!" })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeTruthy()
    expect(res.body.refreshToken).toBeTruthy()
    expect(res.body.message).toMatch(/logged in successfully/i)
  })

  it("rejects locked users from logging in", async () => {
    await createUser({ username: "locked-user", status: "locked" } as any)

    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "locked-user", password: "Password123!" })

    expect(res.status).toBe(403)
    expect(res.body.message).toMatch(/locked/i)
  })

  it("rejects pending store users until approved", async () => {
    await createUser({ username: "pending-user", status: "pending" } as any)

    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "pending-user", password: "Password123!" })

    expect(res.status).toBe(403)
    expect(res.body.message).toMatch(/waiting for admin approval/i)
  })

  it("refreshes token for unlocked users", async () => {
    const user = await createUser()
    const refreshToken = buildRefreshTokenFor(user)

    const res = await request(app)
      .post("/v1/auth/refresh")
      .send({ refreshToken })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeTruthy()
    expect(res.body.message).toMatch(/refreshed/i)
  })

  it("rejects refresh without a token", async () => {
    const res = await request(app).post("/v1/auth/refresh").send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/refresh token/i)
  })

  it("rejects refresh when the user is locked", async () => {
    const user = await createUser({ status: "locked" } as any)
    const refreshToken = buildRefreshTokenFor(user)

    const res = await request(app)
      .post("/v1/auth/refresh")
      .send({ refreshToken })

    expect(res.status).toBe(403)
    expect(res.body.message).toMatch(/locked/i)
  })
})
