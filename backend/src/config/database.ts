import mongoose from "mongoose"

// Connect to MongoDB
export const connectToDatabase = async (uri: string) => {
  try {
    await mongoose.connect(uri, {})
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("Error conecting to MongoDB:", error)
    process.exit(1)
  }
}
