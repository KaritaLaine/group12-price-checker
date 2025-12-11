import mongoose , { Document, Schema } from "mongoose";

interface IProduct extends Document {
    name: string
    price: mongoose.Types.Decimal128
    barcode: string
    createdAt: Date
    updatedAt: Date
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    price: {
        // Could just be type: Number
        type: Schema.Types.Decimal128
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