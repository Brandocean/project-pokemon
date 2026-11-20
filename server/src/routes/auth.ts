import { Router } from 'express'
import { signin, signup } from '../controllers/auth.js'
import { signinLimiter, signupLimiter } from '../middleware/limiter.js'

const authRouter = Router()

authRouter.post('/signup', signupLimiter, signup)
authRouter.post('/signin', signinLimiter, signin)

export { authRouter }
