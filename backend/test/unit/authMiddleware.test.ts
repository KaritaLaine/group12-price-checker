import { describe, it, expect, vi, afterEach } from "vitest"
import type { NextFunction, Request, Response } from "express"
import { authenticate } from "../../src/middleware/auth"
import { authUtils } from "../../src/utils/auth"

const buildContext = (authHeader?: string) => {
  const req = {
    headers: authHeader ? { authorization: authHeader } : {},
  } as Partial<Request>

  const body: any = {}
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockImplementation((data) => Object.assign(body, data)),
  } as unknown as Response

  const next = vi.fn() as NextFunction
  return { req, res, next, body }
}

describe("authenticate middleware", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns 401 when authorization header is missing", () => {
    const { req, res, next, body } = buildContext()

    authenticate(req as any, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(body.message).toMatch(/invalid token/i)
    expect(next).not.toHaveBeenCalled()
  })

  it("returns 401 when authorization header is not Bearer", () => {
    const { req, res, next, body } = buildContext("Token abc.def.ghi")

    authenticate(req as any, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(body.message).toMatch(/invalid token/i)
    expect(next).not.toHaveBeenCalled()
  })

  it("returns 401 when token verification fails", () => {
    vi.spyOn(authUtils, "verifyToken").mockImplementation(() => {
      throw new Error("boom")
    })
    const { req, res, next, body } = buildContext("Bearer invalid.token")

    authenticate(req as any, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(body.message).toMatch(/invalid token/i)
    expect(next).not.toHaveBeenCalled()
  })

  it("attaches the payload and calls next when token is valid", () => {
    const payload = {
      userId: "user-123",
      role: "admin",
      email: "admin@example.com",
      status: "unlocked",
    }
    vi.spyOn(authUtils, "verifyToken").mockReturnValue(payload as any)
    const { req, res, next } = buildContext("Bearer valid.token")

    authenticate(req as any, res, next)

    expect(next).toHaveBeenCalled()
    expect((req as Request).user).toEqual(payload)
  })
})
