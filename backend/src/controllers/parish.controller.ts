import type { Response } from 'express'
import type { AuthRequest } from '../types'
import { parishService } from '../services/parish.service'
import { R } from '../utils/response'

export const parishController = {
  async getAll(req: AuthRequest, res: Response) {
    try { const r = await parishService.findMany(req); return R.paginated(res, r.data, r.meta) }
    catch { return R.serverError(res) }
  },
  async getById(req: AuthRequest, res: Response) {
    try { return R.ok(res, await parishService.findById(req.params.id)) }
    catch { return R.notFound(res, 'Parrocchia non trovata') }
  },
  async create(req: AuthRequest, res: Response) {
    try { return R.created(res, await parishService.create(req.body)) }
    catch { return R.serverError(res) }
  },
  async update(req: AuthRequest, res: Response) {
    try { return R.ok(res, await parishService.update(req.params.id, req.body)) }
    catch { return R.notFound(res, 'Parrocchia non trovata') }
  },
  async delete(req: AuthRequest, res: Response) {
    try { await parishService.delete(req.params.id); return R.noContent(res) }
    catch { return R.notFound(res, 'Parrocchia non trovata') }
  },
  async verify(req: AuthRequest, res: Response) {
    try { return R.ok(res, await parishService.verify(req.params.id), 'Parrocchia verificata') }
    catch { return R.notFound(res, 'Parrocchia non trovata') }
  },
}
