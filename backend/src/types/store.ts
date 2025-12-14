import mongoose, { Document, Schema } from "mongoose"

interface Store extends Document {
  name: string
  location: {
    type: "Point"
    coordinates: [number, number]
  }
  createdAt: Date
  updatedAt: Date
  owner: mongoose.Types.ObjectId
}

export { Store }
