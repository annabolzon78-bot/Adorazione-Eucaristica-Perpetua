import rateLimit from 'express-rate-limit'
import { env } from '../config/env'

const base = {
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (_req: any, res: any) => {
    res.status(429).json({ success: false, error: 'Troppe richieste. Riprova tra qualche minuto.' })
  },
}

// Generale: 200 req / 15 min
export const globalLimiter = rateLimit({
  ...base,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max:      env.RATE_LIMIT_MAX,
})

// Auth: 10 req / 15 min
export const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { success: false, error: 'Troppi tentativi di login. Riprova tra 15 minuti.' },
})

// Search: 60 req / 1 min
export const searchLimiter = rateLimit({
  ...base,
  windowMs: 60 * 1000,
  max:      60,
})

// Write ops: 30 req / 15 min
export const writeLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  max:      30,
})
