import mongoose from "mongoose"
import type { User } from "../types/user"
import { authUtils } from "../utils/auth"

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "storeUser"], default: "storeUser" },
  status: {
    type: String,
    enum: ["pending", "unlocked", "locked"],
    default: "pending",
  },
  email: { type: String, required: true, unique: true, lowercase: true },
})

userSchema.pre<User>("save", async function (this: User) {
  // Hash password if it has been edited
  if (!this.isModified("password")) return

  this.password = await authUtils.hashPassword(this.password)
})

export default mongoose.model<User>("User", userSchema)
