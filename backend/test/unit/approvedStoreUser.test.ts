import { describe, it, expect, vi } from "vitest"
import type { NextFunction, Request, Response } from "express"
import { requireApprovedStoreUser } from "../../src/middleware/approvedStoreUser"

const buildContext = (status?: string) => {
  const req = {
    user: status ? { status } : undefined,
  } as Partial<Request>

  const body: any = {}
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockImplementation((data) => Object.assign(body, data)),
  } as unknown as Response

  const next = vi.fn() as NextFunction
  return { req, res, next, body }
}

describe("requireApprovedStoreUser middleware", () => {
  it("blocks pending store users", () => {
    const { req, res, next, body } = buildContext("pending")

    requireApprovedStoreUser(req as any, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(body.message).toMatch(/waiting for admin approval/i)
    expect(next).not.toHaveBeenCalled()
  })

  it("blocks locked store users", () => {
    const { req, res, next, body } = buildContext("locked")

    requireApprovedStoreUser(req as any, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(body.message).toMatch(/waiting for admin approval/i)
    expect(next).not.toHaveBeenCalled()
  })

  it("allows unlocked store users", () => {
    const { req, res, next } = buildContext("unlocked")

    requireApprovedStoreUser(req as any, res, next)

    expect(next).toHaveBeenCalled()
  })
})
