import mongoose, { Document, Schema } from "mongoose"

type BarcodeType = "GTIN-8" | "GTIN-12" | "GTIN-13" | "GTIN-14";

interface IProduct extends Document {
    name: string
    barcodeType: BarcodeType
    barcode: string
    createdAt: Date
    updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    barcodeType: {
        type: String,
        enum: ["GTIN-8", "GTIN-12", "GTIN-13", "GTIN-14"],
        required: true },
    // GTIN number
    barcode: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{8,14}$/,
    },
  },
  { timestamps: true }
)

export default mongoose.model<IProduct>("Product", productSchema)
