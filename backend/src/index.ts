import { createApp }    from './app'
import { env }          from './config/env'
import { connectDB, disconnectDB } from './config/database'
import { logger }       from './utils/logger'

async function bootstrap() {
  // 1. Connetti il database
  await connectDB()
  logger.info('✅ PostgreSQL connesso via Prisma')

  // 2. Crea e avvia l'app
  const app = createApp()
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Adorazione Viva API — http://localhost:${env.PORT}`)
    logger.info(`📖 Docs: http://localhost:${env.PORT}/api/health`)
    logger.info(`🌍 Ambiente: ${env.NODE_ENV}`)
  })

  // 3. Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`📴 ${signal} ricevuto — chiusura in corso...`)
    server.close(async () => {
      await disconnectDB()
      logger.info('✅ Chiusura completata')
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10_000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))
  process.on('uncaughtException',  (err)       => { logger.error('Uncaught Exception:',  err); process.exit(1) })
  process.on('unhandledRejection', (reason)    => { logger.error('Unhandled Rejection:', reason); process.exit(1) })
}

bootstrap()
