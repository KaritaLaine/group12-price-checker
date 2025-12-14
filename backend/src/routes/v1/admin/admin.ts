import { Router } from "express"
import { adminController } from "../../../controllers/adminController.js"

const router = Router()

router.get("/users", adminController.getAllUsers)
router.patch("/approve/:userId", adminController.approveStoreUser)
router.patch("/decline/:userId", adminController.declineStoreUser)
router.patch("/user-status/:userId", adminController.updateStoreUserStatus)
router.delete("/delete/:userId", adminController.deleteStoreUser)
router.post("/create-admin", adminController.createAdmin)

export default router
