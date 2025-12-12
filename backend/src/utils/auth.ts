import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { TokenPayload } from "../types/auth"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// Generates a JWT token
const generateAccessToken = (payload: TokenPayload): string => {
  if (!JWT_SECRET) {
    throw new Error("Please set JTW environment variables")
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

const generateRefreshToken = (payload: TokenPayload): string => {
  if (!JWT_SECRET) {
    throw new Error("Please set JTW environment variables")
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions)
}

const verifyToken = (token: string): TokenPayload => {
  if (!JWT_SECRET) {
    throw new Error("Please set JTW environment variables")
  }
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    throw new Error("Invalid or expired token, please try again.")
  }
}

export const authUtils = {
  comparePasswords,
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
}
