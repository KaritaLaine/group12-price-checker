import mongoose, { Document, Schema } from "mongoose";

interface IStore extends Document {
    name: string
    location: {
        type: string
        coordinates: [number, number] // [longitude, latitude]
    }
    createdAt: Date
    updatedAt: Date
}

const storeSchema = new Schema<IStore>({
    name: {
        type: String,
        required: true,
    },
    // Location is stored in GeoJSON format
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
},
    { timestamps: true }
) 

storeSchema.index({ location: "2dsphere" });

export default mongoose.model<IStore>("Store", storeSchema)