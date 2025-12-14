import type { Request, Response } from "express"
import mongoose from "mongoose"
import { handleResponse } from "../utils/response"
import {
  findNearbyStores,
  findPricesForStores,
  findProductByBarcode,
  findReferenceStore,
} from "../services/productPricingService"
import { buildPriceView } from "../utils/productPricingFormatter"

const validateBarcodeRequest = (req: Request) => {
  const { barcode } = req.params
  const { storeId, maxDistance } = req.query

  if (!barcode) {
    return { error: { status: 400, message: "Barcode required" } }
  }

  if (!storeId || !mongoose.Types.ObjectId.isValid(storeId as string)) {
    return { error: { status: 400, message: "Valid storeId required" } }
  }

  const distance = maxDistance ? parseInt(maxDistance as string, 10) : 5000
  return { barcode, storeId: storeId as string, distance }
}

const getProductPriceByBarcode = async (req: Request, res: Response) => {
  try {
    const validation = validateBarcodeRequest(req)
    if (validation.error) {
      return handleResponse(res, validation.error.status, validation.error.message)
    }

    const { barcode, storeId, distance } = validation

    const product = await findProductByBarcode(barcode)
    if (!product) {
      return handleResponse(res, 404, "Product not found")
    }

    const referenceStore = await findReferenceStore(storeId)
    if (!referenceStore) {
      return handleResponse(res, 404, "Reference store not found")
    }

    const storeLocation = referenceStore.location.coordinates
    const nearbyStores = await findNearbyStores(storeLocation, distance)

    if (!nearbyStores.length) {
      return handleResponse(res, 200, "Product not found in nearby stores", {
        product,
        prices: [],
        manualPriceEntryRequired: true,
      })
    }

    const storeIds = nearbyStores.map((store) => store._id)
    const prices = await findPricesForStores(
      product._id,
      storeIds as mongoose.Types.ObjectId[]
    )

    if (!prices || prices.length === 0) {
      return handleResponse(res, 200, "No prices found. Enter price manually.", {
        product,
        prices: [],
        manualPriceEntryRequired: true,
      })
    }

    const responsePayload = buildPriceView(product, prices, storeId)
    return handleResponse(res, 200, "Product fetched successfully", responsePayload)
  } catch (error) {
    console.error(error)
    return handleResponse(res, 500, "Server error")
  }
}

export const productController = {
  getProductPriceByBarcode
}
