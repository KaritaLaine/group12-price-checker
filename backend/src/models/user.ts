import bcrypt from "bcrypt"
import type { Document } from "mongoose"
import mongoose from "mongoose"

interface User extends Document {
  username: string
  password: string
}

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

userSchema.pre<User>("save", async function (this: User) {
  if (!this.isModified("password")) return

  this.password = await bcrypt.hash(this.password, 10)
})
