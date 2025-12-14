import mongoose, { Schema } from "mongoose"
import type { Store } from "../types/store"

const storeSchema = new Schema<Store>(
  {
    name: {
      type: String,
      required: true,
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
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

storeSchema.index({ location: "2dsphere" })

export default mongoose.model<Store>("Store", storeSchema)
