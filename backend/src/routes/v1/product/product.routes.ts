import { Router } from "express"
import { productController } from "../../../controllers/productController"

const router = Router()

router.get(
  "/compare/:barcode",
  productController.getProductPriceByBarcode
)
export default router
