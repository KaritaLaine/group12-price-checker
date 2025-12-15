import { UserStatus } from "./user"

export interface TokenPayload {
  userId: string
  role: "admin" | "storeUser"
  email: string
  status: UserStatus
}
