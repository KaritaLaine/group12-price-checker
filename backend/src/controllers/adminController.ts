import { Request, Response } from "express"
import User from "../models/user"

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()

    res.json({ message: "Users fetched successfully", users })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
  }
}

// Delete a store user
const deleteStoreUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) return res.status(404).json({ message: "User not found" })

    res.json({ message: "User deleted successfully", deletedUser })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
  }
}

// Approve a pending store user
const approveStoreUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (user.status !== "pending")
      return res.status(400).json({ message: "User is not pending approval" })

    user.status = "unlocked"
    await user.save()

    res.json({ message: "User approved successfully", user })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
  }
}

// Decline a pending store user
const declineStoreUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (user.status !== "pending")
      return res.status(400).json({ message: "User is not pending approval" })

    await deleteStoreUser(req, res)

    res.json({ message: "User declined successfully", user })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
  }
}

const updateStoreUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { status } = req.body

    // Check that given status is valid (locked or unlocked)
    if (!["locked", "unlocked"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Please use either locked or unlocked as status" })
    }

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: "User was not found" })

    user.status = status
    await user.save()

    res.json({
      message: `User ${status} successfully`,
      user,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
  }
}

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" })

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" })

    const newAdmin = new User({ username, email, password, role: "admin" })
    await newAdmin.save()

    res.status(201).json({ message: "Admin created successfully", newAdmin })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
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
