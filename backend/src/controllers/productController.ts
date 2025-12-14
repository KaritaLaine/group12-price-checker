import type { Request, Response } from "express"
import mongoose from "mongoose"
import Product from "../models/product"
import Store from "../models/store"
import StoreProduct from "../models/storeProduct"
import { handleResponse } from "../utils/response"

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

const findProductByBarcode = (barcode: string) => {
  return Product.findOne({ "barcode.gtin": barcode })
}

const findReferenceStore = (storeId: string) => {
  return Store.findById(storeId).select("location name")
}

const findNearbyStores = (storeLocation: number[], distance: number) => {
  return Store.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: storeLocation },
        $maxDistance: distance,
      },
    },
  }).select("_id name location")
}

const findPricesForStores = (
  productId: mongoose.Types.ObjectId,
  storeIds: mongoose.Types.ObjectId[]
) => {
  return StoreProduct.find({
    product: productId,
    store: { $in: storeIds },
  })
    .sort({ price: 1 })
    .populate("store", "name location")
    .lean()
}

const buildPriceView = (product: any, prices: any[], currentStoreId: string) => {
  const priceEntries = prices.map((priceDoc) => {
    const effectivePrice = priceDoc.discountedPrice ?? priceDoc.price
    return {
      id: priceDoc._id?.toString(),
      price: priceDoc.price,
      discountedPrice: priceDoc.discountedPrice,
      effectivePrice,
      store: priceDoc.store,
    }
  })

  const effectivePrices = priceEntries.map((entry) => entry.effectivePrice)
  const averagePrice =
    effectivePrices.reduce((sum, val) => sum + val, 0) /
    (effectivePrices.length || 1)

  const getPriceLabel = (value: number) => {
    if (value <= averagePrice * 0.8) {
      return { label: "cheap", indicator: "🟢", color: "green" }
    }
    if (value >= averagePrice * 1.2) {
      return { label: "expensive", indicator: "🔴", color: "red" }
    }
    return { label: "moderate", indicator: "🟡", color: "yellow" }
  }

  const formatEntry = (entry: any) => {
    const label = getPriceLabel(entry.effectivePrice)
    return {
      price: entry.price,
      discountedPrice: entry.discountedPrice,
      label: label.label,
      indicator: label.indicator,
      color: label.color,
      store: {
        name: (entry.store as any)?.name,
        location: (entry.store as any)?.location,
      },
    }
  }

  const currentStoreEntry = priceEntries.find(
    (entry) => entry.store?._id?.toString() === currentStoreId
  )

  const nearbyStores = priceEntries
    .filter((entry) => entry.store?._id?.toString() !== currentStoreId)
    .map(formatEntry)

  const currentStore = currentStoreEntry ? formatEntry(currentStoreEntry) : null

  return {
    product: {
      name: product.name,
      barcode: product.barcode,
    },
    currentStore,
    nearbyStores,
    manualPriceEntryRequired: false,
  }
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

const getProductPriceByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    if (!name) {
      return handleResponse(res, 400, "Name required")
    }

    const product = await Product.findOne({ name })
    if (!product) {
      return handleResponse(res, 404, "Product not found")
    }

    const prices = await StoreProduct.find({ product: product._id })
    return handleResponse(res, 200, "Product fetched successfully", { product, prices })
  } catch (error) {
    console.error(error)
    return handleResponse(res, 500, "Server error")
  }
}

export const productController = {
  getProductPriceByBarcode,
  getProductPriceByName,
}
