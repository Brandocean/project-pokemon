import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

const mongoUri = process.env.MONGO_URI
const clientOrigin = process.env.CLIENT_ORIGIN
const port = Number(process.env.PORT ?? 3001)

if (!mongoUri) {
  throw new Error('La variable de entorno MONGO_URI es obligatoria')
}

if (!clientOrigin) {
  throw new Error('La variable de entorno CLIENT_ORIGIN es obligatoria')
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('La variable de entorno PORT debe ser un puerto válido')
}

const app = express()

app.set('trust proxy', 1)
app.use(cors({ origin: clientOrigin }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  })
})

const startServer = async (): Promise<void> => {
  await mongoose.connect(mongoUri, { maxPoolSize: 10 })
  app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`)
  })
}

startServer().catch((error: unknown) => {
  console.error('No fue posible iniciar el servidor o conectar con MongoDB:', error)
  process.exitCode = 1
})
