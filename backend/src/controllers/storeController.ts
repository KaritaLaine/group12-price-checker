import { Request, Response } from "express"
import mongoose from "mongoose"
import Store from "../models/store"
import { handleResponse } from "../utils/response"

const updateStoreInfo = async (req: Request, res: Response) => {
  const { storeName, latitude, longitude } = req.body
  const userId = req.user!.userId
  const objectId = new mongoose.Types.ObjectId(userId)

  const store = await Store.findOne({ owner: objectId })
  if (!store) return handleResponse(res, 404, "Store was not found")

  if (storeName) store.name = storeName

  if (latitude !== undefined && longitude !== undefined) {
    store.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    }
  }

  await store.save()

  return handleResponse(res, 200, "Store has been updated", store)
}

export const storeController = {
  updateStoreInfo,
}
