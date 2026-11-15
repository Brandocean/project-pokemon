import type { RequestHandler } from 'express'
import { ERROR_MESSAGES } from '../config/constants.js'
import { AppError } from '../middleware/error-handler.js'
import User from '../models/User.js'

export const getCurrentUser: RequestHandler = async (req, res) => {
  const userId = req.user?._id
  if (!userId) {
    throw new AppError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, 401)
  }

  const user = await User.findById(userId).select('_id email name')
  if (!user) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404)
  }

  res.status(200).json({
    _id: user._id,
    email: user.email,
    name: user.name,
  })
}
