import mongoose from 'mongoose'
import app from './app.js'

const mongoUri = process.env.MONGO_URI
const port = Number(process.env.PORT ?? 3001)

if (!mongoUri) {
  throw new Error('La variable de entorno MONGO_URI es obligatoria')
}

if (!process.env.CLIENT_ORIGIN) {
  throw new Error('La variable de entorno CLIENT_ORIGIN es obligatoria')
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('La variable de entorno PORT debe ser un puerto válido')
}

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
