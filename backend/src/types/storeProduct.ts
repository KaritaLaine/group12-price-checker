import mongoose, { Document } from "mongoose"

type PriceSource = "store_batch" | "shopper"

export interface StoreProduct extends Document {
  product: mongoose.Types.ObjectId
  store: mongoose.Types.ObjectId
  price: number
  currency: string
  isCurrent: boolean
  discountedPrice?: number
  source?: PriceSource
  createdAt: Date
  updatedAt: Date
}
