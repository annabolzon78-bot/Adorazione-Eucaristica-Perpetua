import type { Response, Request } from 'express'
import type { AuthRequest } from '../types'
import { prayerService } from '../services/prayer.service'
import { R } from '../utils/response'

export const prayerController = {
  async getCategories(_req: Request, res: Response) {
    try { return R.ok(res, await prayerService.getCategories()) }
    catch { return R.serverError(res) }
  },
  async getAll(req: Request, res: Response) {
    try { const r = await prayerService.findMany(req); return R.paginated(res, r.data, r.meta) }
    catch { return R.serverError(res) }
  },
  async getBySlug(req: Request, res: Response) {
    try { return R.ok(res, await prayerService.findBySlug(req.params.slug)) }
    catch { return R.notFound(res, 'Preghiera non trovata') }
  },
  async getRequests(req: Request, res: Response) {
    try { const r = await prayerService.getRequests(req); return R.paginated(res, r.data, r.meta) }
    catch { return R.serverError(res) }
  },
  async createRequest(req: AuthRequest, res: Response) {
    try {
      const data = { ...req.body, userId: req.user?.id ?? undefined }
      return R.created(res, await prayerService.createRequest(data), 'Intenzione affidata')
    } catch { return R.serverError(res) }
  },
  async pray(req: Request, res: Response) {
    try { return R.ok(res, await prayerService.pray(req.params.id), 'Grazie per la tua preghiera') }
    catch { return R.notFound(res, 'Intenzione non trovata') }
  },
}
