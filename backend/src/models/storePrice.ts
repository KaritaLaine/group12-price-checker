import mongoose, { Document, Schema } from "mongoose";

type PriceSource = "store_batch" | "shopper";

interface IStorePrice extends Document {
    productId: mongoose.Types.ObjectId;
    storeId: mongoose.Types.ObjectId;
    price: number;
    currency: string;
    isCurrent: boolean;
    discount?: number;
    source?: PriceSource;
    createdAt: Date;
    updatedAt: Date;
}

const storePriceSchema = new Schema<IStorePrice>(
    {
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
        discount: {
            type: Number,
            min: 1,
            max: 100,
            default: 0
        },
        source: {
            type: String,
            enum: ["store_batch", "shopper"],
            default: "shopper"
        },
    },
    { timestamps: true }
);

// Prevent multiple current prices for the same product/store
storePriceSchema.index(
    { storeId: 1, productId: 1, isCurrent: 1 },
    { unique: true, partialFilterExpression: { isCurrent: true } }
);

export default mongoose.model<IStorePrice>("StorePrice", storePriceSchema);
