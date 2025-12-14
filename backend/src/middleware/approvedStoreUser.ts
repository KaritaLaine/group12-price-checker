import { Request, Response, NextFunction } from "express"
import { handleResponse } from "../utils/response"

export const requireApprovedStoreUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.status !== "unlocked") {
    return handleResponse(
      res,
      401,
      "Your account is waiting for admin approval, please try again later!"
    )
  }

  next()
}
