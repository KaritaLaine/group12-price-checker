import mongoose, { Document, Schema } from "mongoose";

interface IStore extends Document {
    name: string
    location: {
        type: string
        coordinates: number[]
    }
    createdAt: Date
    updatedAt: Date
}

const storeSchema = new Schema<IStore>({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
},
    { timestamps: true }
) 

export default mongoose.model<IStore>("Store", storeSchema)