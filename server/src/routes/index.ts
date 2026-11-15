import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { usersRouter } from './users.js'

const router = Router()

router.use('/users', auth, usersRouter)

export default router
