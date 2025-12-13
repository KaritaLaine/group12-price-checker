import { type Request, type Response } from "express"
import User from "../models/user.js"
import { authUtils } from "../utils/auth.js"

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      res.status(400).json({
        error: "Please provide username, email, and password and try again.",
      })
      return
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      res.status(409).json({ error: "Username or e-mail is already in use!" })
      return
    }

    const user = new User({
      username,
      email,
      password,
    })

    await user.save()

    res.status(201).json({
      message: "User has been registered!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("Error registering user:", error)
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      res
        .status(400)
        .json({ error: "Please provide username and password and try again." })
      return
    }

    const user = await User.findOne({ username })
    if (!user) {
      res
        .status(401)
        .json({ error: "Invalid login credentials, please try again." })
      return
    }

    // Check if account is locked
    if (user.status === "locked") {
      res.status(403).json({
        error: "Your account is locked. Please contact the administrators.",
      })
      return
    }

    // Check if account is waiting for admin approval
    if (user.status === "pending" && user.role === "storeUser") {
      res.status(403).json({
        error: "Your account is waiting for approval. Please try again later.",
      })
      return
    }

    // Check that password matches the stored hash
    const isPasswordValid = await authUtils.comparePasswords(
      password,
      user.password
    )
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ error: "Invalid login credentials, please try again." })
      return
    }

    // Create payload for tokens
    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    }

    // Generate access and refresh tokens
    const accessToken = authUtils.generateAccessToken(tokenPayload)
    const refreshToken = authUtils.generateRefreshToken(tokenPayload)

    // Send tokens and user info back to client
    res.json({
      message: "User logged in successfully!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("Error logging in user:", error)
  }
}

// Refresh token when access token expires or is invalid
const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ error: "You need a refresh token." })
      return
    }

    // Check if refresh token is still valid
    const payload = authUtils.verifyToken(refreshToken)

    // Check that user exists and is unlocked
    const user = await User.findById(payload.userId)
    if (!user || user.status === "locked") {
      res
        .status(401)
        .json({ error: "Invalid token or account locked, please try again" })
      return
    }

    // Create new payload and generate new access token
    const newTokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    }
    const accessToken = authUtils.generateAccessToken(newTokenPayload)

    // Send new access token back to the client
    res.json({
      accessToken,
    })
  } catch (error) {
    console.error("Error refreshing token:", error)
  }
}

export const authController = {
  register,
  login,
  refreshToken,
}
