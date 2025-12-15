import { Response } from "express"

export const handleResponse = (
  res: Response,
  status: number,
  message: string,
  data?: object
) => {
  res.status(status).json({ message, data })
}
