import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { env } from '../config/env'

const { combine, timestamp, colorize, printf, json, errors } = winston.format

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
    return `${timestamp} [${level}] ${message}${metaStr}${stack ? `\n${stack}` : ''}`
  })
)

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
)

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: env.NODE_ENV === 'development' ? devFormat : prodFormat,
  }),
]

if (env.NODE_ENV === 'production') {
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      zippedArchive: true,
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: true,
    })
  )
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  transports,
  exitOnError: false,
})

export type Logger = typeof logger
