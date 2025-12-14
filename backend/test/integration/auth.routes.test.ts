import { describe, it, expect, vi } from "vitest"
import type { NextFunction, Request, Response } from "express"
import { AuthorizationMiddleware } from "../../src/middleware/authorize"

const buildReqRes = (user?: any) => {
  const req = { user } as Partial<Request>
  const resBody: any = {}
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockImplementation((body) => Object.assign(resBody, body)),
  } as unknown as Response
  const next = vi.fn() as NextFunction
  return { req, res, next, resBody }
}

describe("AuthorizationMiddleware.authorize", () => {
  it("returns 401 when no user", () => {
    const { req, res, next, resBody } = buildReqRes()
    AuthorizationMiddleware.authorize("admin")(req as any, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
    expect(resBody.message).toMatch(/log in/i)
  })

  it("returns 403 when role not allowed", () => {
    const { req, res, next, resBody } = buildReqRes({ role: "storeUser" })
    AuthorizationMiddleware.authorize("admin")(req as any, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
    expect(resBody.message).toMatch(/permissions/i)
  })

  it("passes through when role allowed", () => {
    const { req, res, next } = buildReqRes({ role: "admin" })
    AuthorizationMiddleware.authorize("admin")(req as any, res, next)
    expect(next).toHaveBeenCalled()
  })
})
