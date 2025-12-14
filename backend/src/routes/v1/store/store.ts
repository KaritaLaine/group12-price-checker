import { Router } from "express"
import { storeController } from "../../../controllers/storeController"
import { storeProductController } from "../../../controllers/storeProductController"

const router = Router()

router.put("/", storeController.updateStoreInfo)
router.post("/products", storeProductController.addStoreProducts)
router.put(
  "/products/:storeProductId/discount",
  storeProductController.addDiscount
)

export default router
