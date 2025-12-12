import bcrypt from "bcrypt"
import type { User } from "../types/user"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "storeUser"], default: "storeUser" },
  status: {
    type: String,
    enum: ["pending", "unlocked", "locked"],
  },
  email: { type: String, required: true, unique: true },
})

userSchema.pre<User>("save", async function (this: User) {
  // Set default status based on role (admin: unlocked, storeUser: pending)
  if (this.isNew && !this.status) {
    this.status = this.role === "admin" ? "unlocked" : "pending"
  }

  // Hash password if it has been edited
  if (!this.isModified("password")) return

  this.password = await bcrypt.hash(this.password, 10)
})

export default mongoose.model<User>("User", userSchema)
