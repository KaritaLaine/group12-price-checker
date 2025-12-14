import mongoose from "mongoose"
import Product from "../models/product"
import Store from "../models/store"
import StoreProduct from "../models/storeProduct"

export const findProductByBarcode = (barcode: string) => {
  return Product.findOne({ "barcode.gtin": barcode })
}

export const findReferenceStore = (storeId: string) => {
  return Store.findById(storeId).select("location name")
}

export const findNearbyStores = (storeLocation: number[], distance: number) => {
  return Store.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: storeLocation },
        $maxDistance: distance,
      },
    },
  }).select("_id name location")
}

export const findPricesForStores = (
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
