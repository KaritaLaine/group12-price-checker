import { Router } from "express"
import authRoutes from "./auth/auth"
import productRoutes from "./product/product.routes"

const router = Router()

router.use("/auth", authRoutes)
router.use("/products", productRoutes)

export default router
