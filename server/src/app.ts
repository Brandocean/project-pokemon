import cors from 'cors'
import express, { type RequestHandler } from 'express'
import mongoose from 'mongoose'
import { errorHandler } from './middleware/error-handler.js'
import notFound from './middleware/not-found.js'
import router from './routes/index.js'

const app = express()
const databaseRoutePrefixes = ['/signup', '/signin', '/users', '/favorites']
let connectionPromise: Promise<typeof mongoose> | null = null

const connectToDatabase = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('La variable de entorno MONGO_URI es obligatoria')
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri, { maxPoolSize: 10 })
      .catch((error: unknown) => {
        connectionPromise = null
        throw error
      })
  }

  return connectionPromise
}

mongoose.connection.on('disconnected', () => {
  connectionPromise = null
})

const ensureDatabaseConnection: RequestHandler = async (req, _res, next) => {
  const requiresDatabase = databaseRoutePrefixes.some((prefix) =>
    req.path === prefix || req.path.startsWith(`${prefix}/`),
  )

  if (!requiresDatabase) {
    next()
    return
  }

  try {
    await connectToDatabase()
    next()
  } catch (error: unknown) {
    next(error)
  }
}

app.set('trust proxy', 1)
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000' }))
app.use(express.json())
app.use(ensureDatabaseConnection)
app.use(router)
app.use(notFound)
app.use(errorHandler)

export const startServer = async (): Promise<void> => {
  const port = Number(process.env.PORT ?? 3001)

  try {
    if (!process.env.CLIENT_ORIGIN) {
      throw new Error('La variable de entorno CLIENT_ORIGIN es obligatoria')
    }

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('La variable de entorno PORT debe ser un puerto válido')
    }

    await connectToDatabase()
    app.listen(port, () => {
      console.log(`Servidor ejecutándose en el puerto ${port}`)
    })
  } catch (error: unknown) {
    console.error('No fue posible iniciar el servidor o conectar con MongoDB:', error)
    process.exitCode = 1
  }
}

export default app
