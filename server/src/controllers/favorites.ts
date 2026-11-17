import type { RequestHandler } from 'express'
import { ERROR_MESSAGES } from '../config/constants.js'
import { AppError } from '../middleware/error-handler.js'
import Favorite from '../models/Favorite.js'
import { isRecord } from '../utils/validation.js'

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

export const createFavorite: RequestHandler = async (req, res) => {
  const owner = req.user?._id
  if (!owner) {
    throw new AppError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, 401)
  }

  const body: unknown = req.body
  if (!isRecord(body)) {
    throw new AppError(ERROR_MESSAGES.INVALID_REQUEST, 400)
  }

  const { pokemonId, name, image, types } = body
  if (
    typeof pokemonId !== 'number' ||
    !Number.isInteger(pokemonId) ||
    pokemonId < 1 ||
    typeof name !== 'string' ||
    !name.trim() ||
    typeof image !== 'string' ||
    !image.trim() ||
    !Array.isArray(types) ||
    types.length === 0 ||
    !types.every((type) => typeof type === 'string' && type.trim().length > 0)
  ) {
    throw new AppError(ERROR_MESSAGES.INVALID_REQUEST, 400)
  }

  const favorite = await Favorite.create({
    owner,
    pokemonId,
    name: name.trim(),
    image: image.trim(),
    types,
  })

  res.status(201).json({
    _id: favorite._id,
    pokemonId: favorite.pokemonId,
    name: favorite.name,
    image: favorite.image,
    types: favorite.types,
  })
}

export const deleteFavorite: RequestHandler = async (req, res) => {
  const owner = req.user?._id
  if (!owner) {
    throw new AppError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, 401)
  }

  const { id } = req.params
  if (typeof id !== 'string' || !/^[\da-f]{24}$/i.test(id)) {
    throw new AppError(ERROR_MESSAGES.INVALID_REQUEST, 400)
  }

  const favorite = await Favorite.findOneAndDelete({ _id: id, owner })
    .select('_id pokemonId name image types')
    .lean()

  if (!favorite) {
    const exists = await Favorite.exists({ _id: id })
    if (exists) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, 403)
    }

    throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404)
  }

  res.status(200).json(favorite)
}
