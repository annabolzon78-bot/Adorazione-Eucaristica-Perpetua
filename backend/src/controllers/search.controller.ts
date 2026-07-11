import type { Request, Response } from 'express'
import { searchService } from '../services/search.service'
import { R } from '../utils/response'

export const searchController = {
  async search(req: Request, res: Response) {
    try {
      const q     = req.query.q as string
      const type  = (req.query.type as string) || 'all'
      const page  = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50)
      const skip  = (page - 1) * limit
      const results = await searchService.search(q, type, skip, limit)
      return R.ok(res, results)
    } catch { return R.serverError(res) }
  },
}
