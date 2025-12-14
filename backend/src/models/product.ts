import mongoose, { Schema } from "mongoose"
import { Product } from "../types/product"

const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
    },
    barcode: {
      type: {
        type: String,
        enum: ["UPC", "EAN"],
        required: true,
      },
      gtin: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{8,14}$/,
      },
    },
  },
  { timestamps: true }
)

export default mongoose.model<Product>("Product", productSchema)
