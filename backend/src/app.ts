import express, { type Application } from 'express'
import cors       from 'cors'
import helmet     from 'helmet'
import morgan     from 'morgan'
import compression from 'compression'
import { env }           from './config/env'
import { globalLimiter } from './middleware/rateLimiter'
import { errorHandler }  from './middleware/errorHandler'
import { requestId }     from './middleware/requestId'
import { logger }        from './utils/logger'
import routes            from './routes'

export function createApp(): Application {
  const app = express()

  // ── Security headers ──────────────────────
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: env.NODE_ENV === 'production',
  }))

  // ── CORS ──────────────────────────────────
  app.use(cors({
    origin:      env.CORS_ORIGIN.split(',').map(s => s.trim()),
    credentials: true,
    methods:     ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-Request-ID'],
  }))

  // ── Compression ───────────────────────────
  app.use(compression())

  // ── Body parsing ──────────────────────────
  app.use(express.json({ limit: `${env.MAX_FILE_SIZE_MB}mb` }))
  app.use(express.urlencoded({ extended: true, limit: `${env.MAX_FILE_SIZE_MB}mb` }))

  // ── Request ID ───────────────────────────
  app.use(requestId)

  // ── HTTP Logging ──────────────────────────
  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  } else {
    app.use(morgan('combined', {
      stream: { write: (msg: string) => logger.http(msg.trim()) },
      skip:   (req) => req.url === '/api/health',
    }))
  }

  // ── Rate limiting globale ─────────────────
  app.use(globalLimiter)

  // ── Proxy trust (Nginx in prod) ───────────
  if (env.NODE_ENV === 'production') app.set('trust proxy', 1)

  // ── Routes ────────────────────────────────
  app.use('/api', routes)

  // ── 404 ───────────────────────────────────
  app.use((_req, res) => res.status(404).json({ success: false, error: 'Endpoint non trovato' }))

  // ── Global error handler ──────────────────
  app.use(errorHandler)

  return app
}
