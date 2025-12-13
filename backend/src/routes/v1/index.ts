import { Router } from "express"
import authRoutes from "./auth/auth"

const router = Router()

router.use("/auth", authRoutes)

export default router
