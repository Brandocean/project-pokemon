import type { RequestHandler } from 'express'
import { ERROR_MESSAGES } from '../config/constants.js'

const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: ERROR_MESSAGES.NOT_FOUND })
}

export default notFound
