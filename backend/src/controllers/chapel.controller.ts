import type { Response } from 'express'
import type { AuthRequest } from '../types'
import { chapelService } from '../services/chapel.service'
import { R } from '../utils/response'

export const chapelController = {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const result = await chapelService.findMany(req)
      return R.paginated(res, result.data, result.meta)
    } catch (err) { return R.serverError(res) }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const chapel = await chapelService.findById(req.params.id)
      return R.ok(res, chapel)
    } catch { return R.notFound(res, 'Cappella non trovata') }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const chapel = await chapelService.create(req.body, req.user!.id)
      return R.created(res, chapel)
    } catch (err) { return R.serverError(res) }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const chapel = await chapelService.update(req.params.id, req.body)
      return R.ok(res, chapel)
    } catch { return R.notFound(res, 'Cappella non trovata') }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await chapelService.softDelete(req.params.id)
      return R.noContent(res)
    } catch { return R.notFound(res, 'Cappella non trovata') }
  },

  async getStats(_req: AuthRequest, res: Response) {
    try {
      const stats = await chapelService.getStats()
      return R.ok(res, stats)
    } catch { return R.serverError(res) }
  },
}
