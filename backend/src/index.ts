import "dotenv/config"
import express from "express"
import { connectToDatabase } from "./config/database"
import apiRoutes from "./routes/index"

const PORT = process.env.PORT || 3000

export const app = express()
app.use(express.json())

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in the .env file")
  if (process.env.NODE_ENV !== "test") {
    process.exit(1)
  }
}

if (process.env.MONGODB_URI) {
  connectToDatabase(process.env.MONGODB_URI)
}

app.use(apiRoutes)

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

export default app
