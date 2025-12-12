import type { TokenPayload } from "./auth"

// Add user to Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export type { Express } from "express"
