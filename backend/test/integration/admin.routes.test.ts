import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "../../src/index"
import User from "../../src/models/user"
import { authUtils } from "../../src/utils/auth"

const createAccessTokenFor = (user: any) =>
  authUtils.generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    status: user.status,
  })

describe("Admin routes", () => {
  // Rejects missing auth header on admin route
  it("returns 401 when no auth header is provided", async () => {
    const res = await request(app).get("/v1/admin/users")

    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/invalid token/i)
  })

  // Rejects non-admin user hitting admin route
  it("returns 403 when a non-admin tries to access admin routes", async () => {
    const storeUser = await User.create({
      username: "store-user",
      email: "store@example.com",
      password: "password123",
      role: "storeUser",
      status: "unlocked",
    })

    const res = await request(app)
      .get("/v1/admin/users")
      .set("Authorization", `Bearer ${createAccessTokenFor(storeUser)}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toMatch(/permissions/i)
  })

  // Admin can list users successfully
  it("allows an admin to list users", async () => {
    const admin = await User.create({
      username: "admin-user",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
      status: "unlocked",
    })
    await User.create({
      username: "store-list",
      email: "store-list@example.com",
      password: "password123",
      role: "storeUser",
      status: "unlocked",
    })

    const res = await request(app)
      .get("/v1/admin/users")
      .set("Authorization", `Bearer ${createAccessTokenFor(admin)}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/users fetched successfully/i)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data).toHaveLength(2)
  })

  // Admin can approve pending store user
  it("allows an admin to approve a pending store user", async () => {
    const admin = await User.create({
      username: "approver",
      email: "approver@example.com",
      password: "password123",
      role: "admin",
      status: "unlocked",
    })
    const pendingUser = await User.create({
      username: "pending-store",
      email: "pending@example.com",
      password: "password123",
      role: "storeUser",
      status: "pending",
    })

    const res = await request(app)
      .patch(`/v1/admin/approve/${pendingUser._id.toString()}`)
      .set("Authorization", `Bearer ${createAccessTokenFor(admin)}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/approved/i)

    const updatedUser = await User.findById(pendingUser._id)
    expect(updatedUser?.status).toBe("unlocked")
  })

  // Admin can lock a store user account
  it("allows an admin to lock a store user", async () => {
    const admin = await User.create({
      username: "locker",
      email: "locker@example.com",
      password: "password123",
      role: "admin",
      status: "unlocked",
    })
    const storeUser = await User.create({
      username: "lock-me",
      email: "lockme@example.com",
      password: "password123",
      role: "storeUser",
      status: "unlocked",
    })

    const res = await request(app)
      .patch(`/v1/admin/user-status/${storeUser._id.toString()}`)
      .set("Authorization", `Bearer ${createAccessTokenFor(admin)}`)
      .send({ status: "locked" })

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/status has been updated/i)

    const updatedUser = await User.findById(storeUser._id)
    expect(updatedUser?.status).toBe("locked")
  })
})
