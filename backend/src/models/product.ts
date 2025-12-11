import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
    name: string
    barcode: string
    createdAt: Date
    updatedAt: Date
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    // GTIN number stored as a string
    barcode: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{8,14}$/
    }
},
    { timestamps: true }
) 

export default mongoose.model<IProduct>("Product", productSchema)