import type { Response } from 'express'
import type { AuthRequest } from '../types'
import { notificationService } from '../services/notification.service'
import { R } from '../utils/response'

export const notificationController = {
  async getAll(req: AuthRequest, res: Response) {
    try { const r = await notificationService.getForUser(req.user!.id, req); return R.paginated(res, r.data, r.meta) }
    catch { return R.serverError(res) }
  },
  async markRead(req: AuthRequest, res: Response) {
    try { return R.ok(res, await notificationService.markRead(req.params.id, req.user!.id)) }
    catch { return R.notFound(res, 'Notifica non trovata') }
  },
  async markAllRead(req: AuthRequest, res: Response) {
    try { await notificationService.markAllRead(req.user!.id); return R.ok(res, null, 'Tutte le notifiche segnate come lette') }
    catch { return R.serverError(res) }
  },
  async delete(req: AuthRequest, res: Response) {
    try { await notificationService.delete(req.params.id, req.user!.id); return R.noContent(res) }
    catch { return R.notFound(res, 'Notifica non trovata') }
  },
}
