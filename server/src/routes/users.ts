import { Router } from 'express'
import { getCurrentUser } from '../controllers/users.js'

const usersRouter = Router()

usersRouter.get('/me', getCurrentUser)

export { usersRouter }
