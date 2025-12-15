import { describe, it, expect, vi, beforeEach } from "vitest"
import type { NextFunction, Request, Response } from "express"
import { requireUnlockedStoreUser } from "../../src/middleware/unlockedStoreUser"
import User from "../../src/models/user"

const buildContext = () => {
  const req = {
    user: { userId: "user-id" },
  } as Partial<Request>

  const body: any = {}
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockImplementation((data) => Object.assign(body, data)),
  } as unknown as Response

  const next = vi.fn() as NextFunction
  return { req, res, next, body }
}

describe("requireUnlockedStoreUser middleware", () => {
  const findByIdSpy = vi.spyOn(User, "findById")

  beforeEach(() => {
    findByIdSpy.mockReset()
  })

  // Fails with 404 when the user document is missing
  it("returns 404 when user is not found", async () => {
    const { req, res, next, body } = buildContext()
    findByIdSpy.mockResolvedValue(null as any)

    await requireUnlockedStoreUser(req as any, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(body.message).toMatch(/was not found/i)
    expect(next).not.toHaveBeenCalled()
  })

  // Rejects requests when user status is not unlocked
  it("blocks store users that are not unlocked", async () => {
    const { req, res, next, body } = buildContext()
    findByIdSpy.mockResolvedValue({ status: "pending" } as any)

    await requireUnlockedStoreUser(req as any, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(body.message).toMatch(/account is locked/i)
    expect(next).not.toHaveBeenCalled()
  })

  // Passes through when user status is unlocked
  it("allows unlocked store users", async () => {
    const { req, res, next } = buildContext()
    findByIdSpy.mockResolvedValue({ status: "unlocked" } as any)

    await requireUnlockedStoreUser(req as any, res, next)

    expect(next).toHaveBeenCalled()
  })
})
