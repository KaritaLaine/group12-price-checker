import type { NextFunction, Request, Response } from "express"
import { authUtils } from "../utils/auth.js"

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization

    // Check if header exists and is in the correct format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Invalid token. Please try again." })
      return
    }

    // Extract the token and verify it
    const token = authHeader.substring(7)
    const payload = authUtils.verifyToken(token)

    // Attach it to the request object so it can be used in other routes and middleware
    req.user = payload

    next()
  } catch (error) {
    res.status(401).json({ error: "Invalid token. Please try again." })
  }
}
