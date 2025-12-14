import Product from "../models/product"
import Store from "../models/store"
import StoreProduct from "../models/storeProduct"
import { Request, Response } from "express"
import type { StoreProduct as StoreProductType } from "../types/storeProduct"

// Add products to specific stores
const addStoreProducts = async (req: Request, res: Response) => {
  const store = await Store.findOne({ owner: req.user!.userId })
  if (!store) return res.status(404).json({ message: "Store was not found" })

  const items = Array.isArray(req.body) ? req.body : [req.body]
  const created: StoreProductType[] = []

  for (const item of items) {
    const { name, barcodeType, gtin, price, location } = item

    let product = await Product.findOne({ "barcode.gtin": gtin })
    if (!product) {
      product = await Product.create({
        name,
        barcode: { type: barcodeType, gtin },
      })
    }

    const storeProduct = await StoreProduct.create({
      store: store._id,
      product: product._id,
      price,
      location,
    })

    created.push(storeProduct)
  }

  res.status(201).json(created)
}

// Add discounts on specific product
const addDiscount = async (req: Request, res: Response) => {
  const { storeProductId } = req.params
  const { discountedPrice } = req.body

  const storeProduct = await StoreProduct.findById(storeProductId)
  if (!storeProduct)
    return res.status(404).json({ message: "Product not found" })

  storeProduct.discountedPrice = discountedPrice
  await storeProduct.save()

  res.json({ message: "Discount applied", storeProduct })
}

export const storeProductController = {
  addStoreProducts,
  addDiscount,
}
