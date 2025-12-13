import mongoose from "mongoose"
import type { User } from "../types/user"
import { authUtils } from "../utils/auth"

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

  this.password = await authUtils.hashPassword(this.password)
})

export default mongoose.model<User>("User", userSchema)
