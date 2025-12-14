import Store from "../models/store"
import { Request, Response } from "express"
import { handleResponse } from "../utils/response"

const updateStoreInfo = async (req: Request, res: Response) => {
  const { name, location } = req.body

  const store = await Store.findOne({ owner: req.user!.userId })
  if (!store) return handleResponse(res, 404, "Store was not found")

  if (name) store.name = name
  if (location) store.location = location

  await store.save()

  return handleResponse(res, 200, "Store has been updated", store)
}

export const storeController = {
  updateStoreInfo,
}
