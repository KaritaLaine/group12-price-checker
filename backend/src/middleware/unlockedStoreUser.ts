import { NextFunction, Request, Response } from "express"
import User from "../models/user"
import { handleResponse } from "../utils/response"

// Only allow unlocked store users to access store routes
export const requireUnlockedStoreUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.user!.userId)
  if (!user) {
    return handleResponse(res, 404, "User was not found")
  }

  if (user.status !== "unlocked") {
    return handleResponse(
      res,
      403,
      "Your account is locked. Please try again later or contact admin"
    )
  }

  next()
}
