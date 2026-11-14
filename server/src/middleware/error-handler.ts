import mongoose from 'mongoose'
import type { ErrorRequestHandler } from 'express'
import { ERROR_MESSAGES } from '../config/constants.js'

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  let statusCode = 500
  let message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR

  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof AppError) {
    statusCode = error.statusCode
    message =
      statusCode >= 500
        ? ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        : error.message
  } else if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    statusCode = 400
    message = ERROR_MESSAGES.INVALID_REQUEST
  } else if (
    error instanceof mongoose.mongo.MongoServerError &&
    error.code === 11000
  ) {
    statusCode = 409
    message = ERROR_MESSAGES.DUPLICATE_RESOURCE
  }

  if (statusCode >= 500) {
    console.error('Error no controlado en la solicitud:', error)
  }

  res.status(statusCode).json({ message })
}
