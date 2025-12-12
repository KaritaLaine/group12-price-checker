import bcrypt from "bcrypt"
import type { Document } from "mongoose"
import mongoose from "mongoose"

interface User extends Document {
  username: string
  password: string
  role: "admin" | "store_user"
  status: "pending" | "unlocked" | "locked"
  email: string
}

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "store_user"], default: "store_user" },
  status: {
    type: String,
    enum: ["pending", "unlocked", "locked"],
  },
  email: { type: String, required: true, unique: true },
})

userSchema.pre<User>("save", async function (this: User) {
  // unlock new admin users by default and set store users to pending
  if (this.isNew && !this.status) {
    this.status = this.role === "admin" ? "unlocked" : "pending"
  }

  if (!this.isModified("password")) return

  this.password = await bcrypt.hash(this.password, 10)
})

export default mongoose.model<User>("User", userSchema)
