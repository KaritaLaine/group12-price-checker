import { Document } from "mongoose"

type BarcodeType = "UPC" | "EAN"

export interface Product extends Document {
  name: string
  barcode: {
    type: BarcodeType
    gtin: string
  }
  createdAt: Date
  updatedAt: Date
}
