import "dotenv/config"
import express from "express"
import { connectToDatabase } from "./config/database"
import apiRoutes from "./routes/index"

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in the .env file")
  process.exit(1)
}

connectToDatabase(process.env.MONGODB_URI)

app.use(apiRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
