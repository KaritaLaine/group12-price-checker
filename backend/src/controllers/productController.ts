import type { Request, Response } from "express"
import Product from "../models/product"
import StoreProduct from "../models/storeProduct"
import Store from "../models/store"
import { handleResponse } from "../utils/response"
import mongoose from "mongoose"

const getProductPriceByBarcode = async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params
    const { storeId, maxDistance } = req.query

    if (!barcode) {
      return handleResponse(res, 400, "Barcode required")
    }

    if (!storeId || !mongoose.Types.ObjectId.isValid(storeId as string)) {
      return handleResponse(res, 400, "Valid storeId required");
    }

    const distance = maxDistance ? parseInt(maxDistance as string, 10) : 5000;

    const product = await Product.findOne({ "barcode.gtin": barcode })
    if (!product) {
      return handleResponse(res, 404, "Product not found")
    }

    const referenceStore = await Store.findById(storeId).select("location name");
    if (!referenceStore) {
      return handleResponse(res, 404, "Reference store not found");
    }

    const storeLocation = referenceStore.location.coordinates;

    const nearbyStores = await Store.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: storeLocation },
          $maxDistance: distance,
        },
      },
    }).select("_id name location");

    if (!nearbyStores.length) {
      return handleResponse(res, 200, "Product not found in nearby stores", {
        product,
        prices: [],
        manualPriceEntryRequired: true,
      });
    }

    const storeIds = nearbyStores.map(store => store._id);


    const prices = await StoreProduct.find({
      product: product._id,
      store: { $in: storeIds },
    })
      .populate("store", "name location")
      .lean();

    if (!prices || prices.length === 0) {
      return handleResponse(res, 200, "No prices found. Enter price manually.", {
        product,
        prices: [],
        manualPriceEntryRequired: true
      });
    }

    return handleResponse(res, 200, "Product fetched successfully", {product, prices, manualPriceEntryRequired: false})
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
    return handleResponse(res, 200, "Product fetched successfully", {product, prices})
  } catch (error) {
    console.error(error)
    return handleResponse(res, 500, "Server error")
  }
}

export const productController = {
  getProductPriceByBarcode,
  getProductPriceByName,
}
