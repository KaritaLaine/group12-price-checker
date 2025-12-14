import type { Request, Response } from "express"
import Product from "../models/product"
import StoreProduct from "../models/storeProduct"
import { handleResponse } from "../utils/response"

const getProductPriceByBarcode = async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params
    if (!barcode) {
      return handleResponse(res, 400, "Barcode required")
    }

    const product = await Product.findOne({ "barcode.gtin": barcode })
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
