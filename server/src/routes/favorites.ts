import { Router } from 'express'
import { createFavorite, getFavorites } from '../controllers/favorites.js'

const favoritesRouter = Router()

favoritesRouter.get('/', getFavorites)
favoritesRouter.post('/', createFavorite)

export { favoritesRouter }
