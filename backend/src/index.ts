import dotenv from "dotenv"
import type { Request, Response } from "express"
import express from "express"
import mongoose from "mongoose"
import authRoutes from "./routes/v1/auth/auth.routes.js"

dotenv.config()

const app = express()
app.use(express.json())

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in the .env file")
  process.exit(1)
}

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message)
    process.exit(1)
  })

app.get("/", (req: Request, res: Response) => {
  res.send("API is running")
})

app.use("/api/v1/auth", authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
