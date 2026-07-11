import type { Request, Response, NextFunction } from 'express'
import { z, type ZodSchema } from 'zod'
import { R } from '../utils/response'

export function validate<T>(schema: ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      const first = result.error.issues[0]
      const path  = first.path.join('.')
      return R.unprocessable(res, path ? `${path}: ${first.message}` : first.message)
    }
    req[source] = result.data
    next()
  }
}

// Schemi comuni riutilizzabili
export const idParam  = z.object({ id: z.string().min(1) })
export const slugParam = z.object({ slug: z.string().min(1) })
export const paginationQuery = z.object({
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
export const geoQuery = z.object({
  lat:      z.coerce.number().min(-90).max(90).optional(),
  lng:      z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().positive().max(500).default(50),
})
