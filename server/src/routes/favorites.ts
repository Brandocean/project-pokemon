import { Router } from 'express'
import {
  createFavorite,
  deleteFavorite,
  getFavorites,
} from '../controllers/favorites.js'

const favoritesRouter = Router()

favoritesRouter.get('/', getFavorites)
favoritesRouter.post('/', createFavorite)
favoritesRouter.delete('/:id', deleteFavorite)

export { favoritesRouter }
