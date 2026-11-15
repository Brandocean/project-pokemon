import { Router } from 'express'
import { getFavorites } from '../controllers/favorites.js'

const favoritesRouter = Router()

favoritesRouter.get('/', getFavorites)

export { favoritesRouter }
