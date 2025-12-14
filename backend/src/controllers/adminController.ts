import { Request, Response } from "express"
import User from "../models/user"
import { logAdminAction } from "../utils/adminLogger"
import { handleResponse } from "../utils/response"

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()

    handleResponse(res, 200, "Users fetched successfully", users)
  } catch (err) {
    handleResponse(res, 500, "Something went wrong, please try again!")
  }
}

// Delete a store user
const deleteStoreUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) return handleResponse(res, 404, "User was not found")

    if (user.role === "admin")
      return handleResponse(res, 403, "Cannot delete other admin users")

    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) return handleResponse(res, 404, "User was not found")

    handleResponse(res, 200, "User has been deleted", deletedUser)

    // Log delete store user for auditing
    await logAdminAction({
      adminId: req.user!.userId,
      action: "DELETE_STORE_USER",
      targetUserId: userId,
      details: `Deleted user with email ${user.email}`,
    })
  } catch (err) {
    handleResponse(res, 500, "Something went wrong, please try again!")
  }
}

// Approve a pending store user
const approveStoreUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) return handleResponse(res, 404, "User was not found")

    if (user.status !== "pending")
      return handleResponse(res, 400, "This user is not pending approval")

    user.status = "unlocked"
    await user.save()

    res.json({ message: "User has been approved", user })

    // Log approve store user for auditing
    await logAdminAction({
      adminId: req.user!.userId,
      action: "APPROVE_STORE_USER",
      targetUserId: userId,
      details: `Approved user with email ${user.email}`,
    })
  } catch (err) {
    handleResponse(res, 500, "Something went wrong, please try again!")
  }
}

// Decline a pending store user
const declineStoreUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) return handleResponse(res, 404, "User was not found")

    if (user.status !== "pending")
      return handleResponse(res, 400, "This user is not pending approval")

    await deleteStoreUser(req, res)

    handleResponse(res, 200, "User has declined and deleted", user)

    // Log decline store user for auditing
    await logAdminAction({
      adminId: req.user!.userId,
      action: "DECLINE_STORE_USER",
      targetUserId: userId,
      details: `Declined user with email ${user.email}`,
    })
  } catch (err) {
    handleResponse(res, 500, "Something went wrong, please try again!")
  }
}

const updateStoreUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { status } = req.body

    // Check that given status is valid (locked or unlocked)
    if (!["locked", "unlocked"].includes(status)) {
      return handleResponse(res, 400, "Status must be locked or unlocked")
    }
    2
    const user = await User.findById(userId)
    if (!user) return handleResponse(res, 404, "User was not found")
    if (user.role === "admin")
      return handleResponse(res, 403, "Cannot update other admin users")

    user.status = status
    await user.save()

    handleResponse(res, 200, "User status has been updated", user)

    // Log update store user status for auditing
    await logAdminAction({
      adminId: req.user!.userId,
      action: "UPDATE_STORE_USER_STATUS",
      targetUserId: userId,
      details: `Updated user with email ${user.email} status to ${status}`,
    })
  } catch (err) {
    handleResponse(res, 500, "Something went wrong, please try again!")
  }
}

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password)
      return handleResponse(
        res,
        400,
        "Please provide username, email, and password"
      )

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return handleResponse(res, 409, "This e-mail is already in use")

    const newAdmin = new User({ username, email, password, role: "admin" })
    await newAdmin.save()

    handleResponse(res, 201, "Admin account has been created", newAdmin)

    // Log create admin for auditing
    await logAdminAction({
      adminId: req.user!.userId,
      action: "CREATE_ADMIN",
      targetUserId: newAdmin._id.toString(),
      details: `Created admin with email ${email}`,
    })
  } catch (err) {
    handleResponse(res, 500, "Something went wrong, please try again!")
  }
}

export const adminController = {
  getAllUsers,
  approveStoreUser,
  declineStoreUser,
  updateStoreUserStatus,
  deleteStoreUser,
  createAdmin,
}
