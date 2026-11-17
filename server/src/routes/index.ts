import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { authRouter } from './auth.js'
import { favoritesRouter } from './favorites.js'
import { healthRouter } from './health.js'
import { usersRouter } from './users.js'

const router = Router()

router.use(authRouter)
router.use(healthRouter)
router.use('/users', auth, usersRouter)
router.use('/favorites', auth, favoritesRouter)

export default router
