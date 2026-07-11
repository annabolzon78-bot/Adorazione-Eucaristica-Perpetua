import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const schema = z.object({
  NODE_ENV:           z.enum(['development', 'production', 'test']).default('development'),
  PORT:               z.coerce.number().default(4000),
  DATABASE_URL:       z.string().min(1, 'DATABASE_URL obbligatoria'),
  JWT_SECRET:         z.string().min(32, 'JWT_SECRET deve essere >= 32 caratteri'),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  JWT_EXPIRES_IN:     z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN:        z.string().default('http://localhost:5173'),
  BCRYPT_ROUNDS:      z.coerce.number().default(12),
  LOG_LEVEL:          z.enum(['error','warn','info','debug']).default('info'),
  SMTP_HOST:          z.string().optional(),
  SMTP_PORT:          z.coerce.number().optional(),
  SMTP_USER:          z.string().optional(),
  SMTP_PASS:          z.string().optional(),
  SMTP_FROM:          z.string().default('noreply@adorazioneviva.com'),
  MAX_FILE_SIZE_MB:   z.coerce.number().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX:     z.coerce.number().default(200),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('❌ Variabili d\'ambiente invalide:')
  parsed.error.issues.forEach(i => console.error(`  ${i.path.join('.')}: ${i.message}`))
  process.exit(1)
}

export const env = parsed.data
export type Env = typeof env
