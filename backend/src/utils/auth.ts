import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { TokenPayload } from "../types/auth"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN

// Hash password before it's saved to the database
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

// Checks if password matches the one in the database
const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// Generates access token (valid for a short time, used for every API request)
const generateAccessToken = (payload: TokenPayload): string => {
  if (!JWT_SECRET) {
    throw new Error("Please set JWT environment variables")
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

// Generates refresh token (valid for a long time, used to get new access token)
const generateRefreshToken = (payload: TokenPayload): string => {
  if (!JWT_SECRET) {
    throw new Error("Please set JWT environment variables")
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions)
}

// Checks if token is still valid
const verifyToken = (token: string): TokenPayload => {
  if (!JWT_SECRET) {
    throw new Error("Please set JWT environment variables")
  }
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    throw new Error("Invalid or expired token, please try again.")
  }
}
// Remove sensitive fields from user object before sending it to client
const sanitizeUser = (user: any) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  status: user.status,
})

export const authUtils = {
  comparePasswords,
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  sanitizeUser,
}
