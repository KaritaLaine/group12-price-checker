import type { NextFunction, Request, Response } from "express"
import type { UserRole } from "../types/user"
import { handleResponse } from "../utils/response"

// Check if user has the required role to access the route
const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // If user is not authenticated throw an error
    if (!req.user) {
      handleResponse(res, 401, "Please log in to access this route!")
      return
    }

    // If user has no permission, throw an error
    if (!allowedRoles.includes(req.user.role)) {
      handleResponse(
        res,
        403,
        "You don't have the necessary permissions for this route!"
      )
      return
    }

    next()
  }
}

// For admin only routes
const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  authorize("admin")(req, res, next)
}

// For store user only routes
const storeUserOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  authorize("storeUser")(req, res, next)
}

// For both admin and store user routes
const adminAndStoreUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  authorize("admin", "storeUser")(req, res, next)
}

export const AuthorizationMiddleware = {
  authorize,
  adminOnly,
  storeUserOnly,
  adminAndStoreUser,
}
