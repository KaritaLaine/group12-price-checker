import { type Request, type Response } from "express"
import Store from "../models/store.js"
import User from "../models/user.js"
import { authUtils } from "../utils/auth.js"
import { handleResponse } from "../utils/response"

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, storeName, latitude, longitude } =
      req.body

    if (
      !username ||
      !email ||
      !password ||
      !storeName ||
      !latitude ||
      !longitude
    ) {
      handleResponse(
        res,
        400,
        "Please provide username, email, password, store name, latitude, and longitude"
      )
      return
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      handleResponse(res, 409, "This username or email is already in use")
      return
    }

    const user = new User({
      username,
      email,
      password,
    })

    await user.save()

    const store = new Store({
      name: storeName,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      owner: user._id,
    })

    await store.save()

    handleResponse(res, 201, "User was registered!", user)
  } catch (error) {
    handleResponse(res, 500, "Something went wrong, please try again!")
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      handleResponse(res, 400, "Please provide username and password")
      return
    }

    const user = await User.findOne({ username })
    if (!user) {
      handleResponse(res, 401, "Invalid login credentials, please try again.")
      return
    }

    // Check if account is locked
    if (user.status === "locked") {
      handleResponse(
        res,
        403,
        "Your account is locked. Please contact support."
      )
      return
    }

    // Check if account is waiting for admin approval
    if (user.status === "pending" && user.role === "storeUser") {
      handleResponse(
        res,
        403,
        "Your account is waiting for admin approval. Please try again later."
      )
      return
    }

    // Check that password matches the stored hash
    const isPasswordValid = await authUtils.comparePasswords(
      password,
      user.password
    )
    if (!isPasswordValid) {
      handleResponse(res, 401, "Invalid login credentials, please try again.")
      return
    }

    // Create payload for tokens
    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      status: user.status,
    }

    // Generate access and refresh tokens
    const accessToken = authUtils.generateAccessToken(tokenPayload)
    const refreshToken = authUtils.generateRefreshToken(tokenPayload)

    handleResponse(res, 200, "User logged in successfully!", {
      user,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    handleResponse(res, 500, "Something went wrong, please try again!")
  }
}

// Refresh token when access token expires or is invalid
const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      handleResponse(res, 400, "You need a refresh token")
      return
    }

    // Check if refresh token is still valid
    const payload = authUtils.verifyToken(refreshToken)

    // Check that user exists and is unlocked
    const user = await User.findById(payload.userId)
    if (!user || user.status === "locked") {
      handleResponse(
        res,
        403,
        "Invalid token or account is locked. Please try again."
      )
      return
    }

    // Create new payload and generate new access token
    const newTokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      status: user.status,
    }
    const newAccessToken = authUtils.generateAccessToken(newTokenPayload)

    handleResponse(res, 200, "Token refreshed!", {
      user,
      accessToken: newAccessToken,
    })
  } catch (error) {
    handleResponse(res, 500, "Something went wrong, please try again!")
  }
}

export const authController = {
  register,
  login,
  refreshToken,
}
