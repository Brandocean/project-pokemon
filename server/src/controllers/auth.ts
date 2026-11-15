import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import {
  ERROR_MESSAGES,
  JWT_EXPIRES_IN,
  MIN_PASSWORD_LENGTH,
  SALT_ROUNDS,
} from '../config/constants.js'
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

export const signin: RequestHandler = async (req, res) => {
  const body: unknown = req.body

  if (
    !isRecord(body) ||
    typeof body.email !== 'string' ||
    !body.email.trim() ||
    typeof body.password !== 'string' ||
    !body.password
  ) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401)
  }

  const user = await User.findOne({ email: body.email.trim() }).select('+password')
  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401)
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('La variable de entorno JWT_SECRET es obligatoria')
  }

  const token = jwt.sign({ _id: user._id.toString() }, jwtSecret, {
    expiresIn: JWT_EXPIRES_IN,
  })

  res.status(200).json({ token })
}
