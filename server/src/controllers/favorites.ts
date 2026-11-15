import type { RequestHandler } from 'express'
import { ERROR_MESSAGES } from '../config/constants.js'
import { AppError } from '../middleware/error-handler.js'
import Favorite from '../models/Favorite.js'

export const getFavorites: RequestHandler = async (req, res) => {
  const owner = req.user?._id
  if (!owner) {
    throw new AppError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, 401)
  }

  const favorites = await Favorite.find({ owner })
    .select('_id pokemonId name image types')
    .lean()

  res.status(200).json(favorites)
}
