import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { ERROR_MESSAGES } from '../config/constants.js'
import { AppError } from './error-handler.js'

const unauthorized = () =>
  new AppError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, 401)

export const auth: RequestHandler = (req, _res, next) => {
  const authorization = req.get('authorization')
  const tokenMatch = authorization?.match(/^Bearer\s+(\S+)\s*$/i)

  if (!tokenMatch?.[1]) {
    next(unauthorized())
    return
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    next(new Error('La variable de entorno JWT_SECRET es obligatoria'))
    return
  }

  let payload: string | jwt.JwtPayload
  try {
    payload = jwt.verify(tokenMatch[1], jwtSecret, { algorithms: ['HS256'] })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(unauthorized())
      return
    }

    next(error)
    return
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload._id !== 'string' ||
    !payload._id
  ) {
    next(unauthorized())
    return
  }

  req.user = { _id: payload._id }
  next()
}
