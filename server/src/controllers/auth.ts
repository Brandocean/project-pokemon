import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { ERROR_MESSAGES, MIN_PASSWORD_LENGTH, SALT_ROUNDS } from '../config/constants.js'
import { AppError } from '../middleware/error-handler.js'
import User from '../models/User.js'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const signup: RequestHandler = async (req, res) => {
  const body: unknown = req.body

  if (!isRecord(body)) {
    throw new AppError(ERROR_MESSAGES.INVALID_REQUEST, 400)
  }

  const { email, password, name } = body

  if (
    typeof email !== 'string' ||
    !email.trim() ||
    typeof password !== 'string' ||
    typeof name !== 'string' ||
    !name.trim()
  ) {
    throw new AppError(ERROR_MESSAGES.REQUIRED_SIGNUP_FIELDS, 400)
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
      400,
    )
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await User.create({
    email: email.trim(),
    password: hashedPassword,
    name: name.trim(),
  })

  res.status(201).json({
    _id: user._id,
    email: user.email,
    name: user.name,
  })
}
