import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { favoritesRouter } from './favorites.js'
import { usersRouter } from './users.js'

const router = Router()

router.use('/users', auth, usersRouter)
router.use('/favorites', auth, favoritesRouter)

export default router
