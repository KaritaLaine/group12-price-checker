import { Router } from "express"
import { authenticate } from "../../middleware/auth"
import { AuthorizationMiddleware } from "../../middleware/authorize"
import { requireUnlockedStoreUser } from "../../middleware/unlockedStoreUser"
import adminRoutes from "./admin/admin"
import authRoutes from "./auth/auth"
import productRoutes from "./product/product.routes"
import storeRoutes from "./store/store"

const router = Router()

router.use("/auth", authRoutes)
router.use("/products", productRoutes)
router.use(
  "/store",
  authenticate,
  AuthorizationMiddleware.storeUserOnly,
  requireUnlockedStoreUser,
  storeRoutes
)
router.use(
  "/admin",
  authenticate,
  AuthorizationMiddleware.adminOnly,
  adminRoutes
)

export default router
