import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'
import { R }      from '../utils/response'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ message: err.message, stack: err.stack, name: err.name })

  const e = err as any
  // Prisma errors (by error code)
  if (e.code === 'P2002') {
    const field = (e.meta?.target as string[])?.join(', ') ?? 'campo'
    return R.conflict(res, `Il valore del campo '${field}' è già in uso`)
  }
  if (e.code === 'P2025') return R.notFound(res)
  if (e.code === 'P2003') return R.unprocessable(res, 'Errore di relazione: record correlato non trovato')
  if (e.name === 'PrismaClientValidationError') return R.unprocessable(res, 'Dati non validi per il database')
  if (e.name === 'ZodError') return R.unprocessable(res, e.message)

  return R.serverError(res)
}
