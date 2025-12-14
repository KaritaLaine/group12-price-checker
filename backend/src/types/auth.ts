export interface TokenPayload {
  userId: string
  role: "admin" | "storeUser"
  email: string
}
