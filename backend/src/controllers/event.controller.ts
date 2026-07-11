import type { Request, Response } from 'express'
import type { AuthRequest } from '../types'
import { eventService } from '../services/event.service'
import { R } from '../utils/response'

export const eventController = {
  async getAll(req: Request, res: Response) {
    try { const r = await eventService.findMany(req); return R.paginated(res, r.data, r.meta) }
    catch { return R.serverError(res) }
  },
  async getBySlug(req: Request, res: Response) {
    try { return R.ok(res, await eventService.findBySlug(req.params.slug)) }
    catch { return R.notFound(res, 'Evento non trovato') }
  },
  async create(req: AuthRequest, res: Response) {
    try { return R.created(res, await eventService.create(req.body)) }
    catch { return R.serverError(res) }
  },
  async update(req: AuthRequest, res: Response) {
    try { return R.ok(res, await eventService.update(req.params.id, req.body)) }
    catch { return R.notFound(res, 'Evento non trovato') }
  },
  async delete(req: AuthRequest, res: Response) {
    try { await eventService.delete(req.params.id); return R.noContent(res) }
    catch { return R.notFound(res, 'Evento non trovato') }
  },
}
