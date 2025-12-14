import Product from "../models/product"
import type { Request, Response } from "express"
import StoreProduct from "../models/storeProduct"

const getProductPriceByBarcode = async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params
    if (!barcode) {
      return res.status(400).json({ message: "Barcode required" })
    }

    const product = await Product.findOne({ "barcode.gtin": barcode })
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const prices = await StoreProduct.find({ product: product._id })

    return res.status(200).json({ product, prices })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

const getProductPriceByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    if (!name) {
      return res.status(400).json({ message: "Name required" })
    }

    const product = await Product.findOne({ name })
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const prices = await StoreProduct.find({ product: product._id })
    return res.status(200).json({ product, prices })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const productController = {
  getProductPriceByBarcode,
  getProductPriceByName,
}
