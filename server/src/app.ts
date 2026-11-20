import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/error-handler.js'
import notFound from './middleware/not-found.js'
import router from './routes/index.js'

const app = express()

app.set('trust proxy', 1)
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000' }))
app.use(express.json())
app.use(router)
app.use(notFound)
app.use(errorHandler)

export default app
