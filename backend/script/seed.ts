import "dotenv/config"
import { connectToDatabase } from "../src/config/database"
import User from "../src/models/user"

const createAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined in the .env file")
      process.exit(1)
    }

    await connectToDatabase(process.env.MONGODB_URI)

    const existingAdmin = await User.findOne({ role: "admin" })
    if (existingAdmin) {
      console.log("Admin account already exists!")
      process.exit(0)
    }

    await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      status: "unlocked",
    })

    console.log("Admin account has been created!")

    process.exit(0)
  } catch (error) {
    console.error("Error creating admin account:", error)
    process.exit(1)
  }
}

createAdmin()
