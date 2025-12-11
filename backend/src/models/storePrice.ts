import mongoose, { Document, ObjectId, Schema } from "mongoose";

interface IStorePrice extends Document {
    productId: mongoose.Types.ObjectId
    storeId: mongoose.Types.ObjectId
    price: number
    discount?: number
    createdAt: Date
    updatedAt: Date
}

const storePriceSchema = new Schema<IStorePrice>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    }
},
    { timestamps: true }
) 

export default mongoose.model<IStorePrice>("StorePrice", storePriceSchema)
