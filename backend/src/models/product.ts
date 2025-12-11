import mongoose , { Document, Schema } from "mongoose";

interface IProduct extends Document {
    name: String
    price: mongoose.Types.Decimal128
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
    }
},
    { timestamps: true }
) 

export default mongoose.model<IProduct>("Product", productSchema)