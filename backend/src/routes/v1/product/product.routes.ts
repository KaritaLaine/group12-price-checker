import { Router } from "express";
import { productController } from "../../../controllers/productController";

const router = Router()

router.post("/scan", productController.addProduct)
router.get("/barcode/:barcode/compare", productController.getProductPriceByBarcode)
router.get("/name/:name/compare", productController.getProductPriceByName)

export default router