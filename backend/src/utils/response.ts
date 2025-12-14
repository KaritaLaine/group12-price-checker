import { Response } from "express"

export const handleResponse = (
  res: Response,
  status: number,
  message: string,
  data?: object,
  accessToken?: string,
  refreshToken?: string
) => {
  res.status(status).json({ message, data, accessToken, refreshToken })
}
