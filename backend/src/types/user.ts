import { Document } from "mongoose"

export type UserRole = "admin" | "storeUser"
export type UserStatus = "pending" | "unlocked" | "locked"

export interface User extends Document {
  username: string
  password: string
  role: UserRole
  status: UserStatus
  email: string
}
