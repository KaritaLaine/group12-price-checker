import { Request, Response } from "express"
import Product from "../models/product"
import Store from "../models/store"
import StoreProduct from "../models/storeProduct"
import type { StoreProduct as StoreProductType } from "../types/storeProduct"
import { handleResponse } from "../utils/response"

// Add one or multiple products to the logged in store user's store
const addStoreProducts = async (req: Request, res: Response) => {
  const store = await Store.findOne({ owner: req.user!.userId })
  if (!store) return handleResponse(res, 404, "Store was not found")

  const items = Array.isArray(req.body) ? req.body : [req.body]
  const created: StoreProductType[] = []

  for (const item of items) {
    const { name, barcodeType, gtin, price, location } = item

    // Check if the product already exists in the database by GTIN and if not, create it
    let product = await Product.findOne({ "barcode.gtin": gtin })
    if (!product) {
      product = await Product.create({
        name,
        barcode: { type: barcodeType, gtin },
      })
    }

    const existingStoreProduct = await StoreProduct.findOne({
      store: store._id,
      product: product._id,
      isCurrent: true,
    })

    if (existingStoreProduct) {
      return handleResponse(
        res,
        409,
        `This product already exists in your store`
      )
    }

    // Add the product to the logged in store user's store
    const storeProduct = await StoreProduct.create({
      store: store._id,
      product: product._id,
      price,
      location,
    })

    created.push(storeProduct)
  }

  handleResponse(res, 200, "Products added to the store", created)
}

// Apply discount to product by product id
const addDiscount = async (req: Request, res: Response) => {
  const { storeProductId } = req.params
  const { discountedPrice } = req.body

  const storeProduct = await StoreProduct.findById(storeProductId)
  if (!storeProduct) return handleResponse(res, 404, "Product was not found")

  storeProduct.discountedPrice = discountedPrice
  await storeProduct.save()

  handleResponse(res, 200, "Discount has been added to product", storeProduct)
}

export const storeProductController = {
  addStoreProducts,
  addDiscount,
}
