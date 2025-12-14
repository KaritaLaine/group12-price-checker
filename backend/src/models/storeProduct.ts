import mongoose, { Schema } from "mongoose"
import { StoreProduct } from "../types/storeProduct"

const storeProductSchema = new Schema<StoreProduct>(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    store: {
      type: mongoose.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "EUR",
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    isCurrent: {
      type: Boolean,
      default: true,
    },
    discountedPrice: {
      type: Number,
    },
    source: {
      type: String,
      enum: ["store_batch", "shopper"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
)

// Prevent multiple current prices for the same product/store
storeProductSchema.index(
  { store: 1, product: 1, isCurrent: 1 },
  { unique: true, partialFilterExpression: { isCurrent: true } }
)

export default mongoose.model<StoreProduct>("StoreProduct", storeProductSchema)
