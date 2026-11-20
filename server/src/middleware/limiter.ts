import { rateLimit } from 'express-rate-limit'
import { ERROR_MESSAGES } from '../config/constants.js'

export const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: ERROR_MESSAGES.TOO_MANY_SIGNIN_ATTEMPTS },
})

export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: { message: ERROR_MESSAGES.TOO_MANY_SIGNUP_ATTEMPTS },
})
