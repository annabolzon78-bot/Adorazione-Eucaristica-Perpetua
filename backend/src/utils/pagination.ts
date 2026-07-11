import type { Request } from 'express'
import type { PaginatedMeta } from './response'

export interface PaginationParams {
  skip:  number
  take:  number
  page:  number
  limit: number
}

export function getPagination(req: Request, defaultLimit = 20): PaginationParams {
  const page  = Math.max(1, parseInt(req.query.page  as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || defaultLimit))
  return { skip: (page - 1) * limit, take: limit, page, limit }
}

export function buildMeta(total: number, page: number, limit: number): PaginatedMeta {
  const pages = Math.ceil(total / limit)
  return { total, page, limit, pages, hasNext: page < pages, hasPrev: page > 1 }
}
