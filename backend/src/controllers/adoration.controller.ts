import type { Response } from 'express'
import type { AuthRequest } from '../types'
import { adorationService } from '../services/adoration.service'
import { R } from '../utils/response'

export const adorationController = {
  async startSession(req: AuthRequest, res: Response) {
    try {
      const session = await adorationService.startSession(req.user!.id, req.body)
      return R.created(res, session, 'Sessione di adorazione avviata. Gesù ti aspettava.')
    } catch { return R.serverError(res) }
  },

  async endSession(req: AuthRequest, res: Response) {
    try {
      const session = await adorationService.endSession(req.params.id, req.user!.id, req.body?.notes)
      return R.ok(res, session, 'Sessione completata. Grazie per la tua adorazione.')
    } catch (err: any) {
      if (err.code === 'P2025') return R.notFound(res, 'Sessione non trovata')
      return R.serverError(res)
    }
  },

  async getActiveSession(req: AuthRequest, res: Response) {
    try {
      const session = await adorationService.getActiveSession(req.user!.id)
      return R.ok(res, session)
    } catch { return R.serverError(res) }
  },

  async getSessions(req: AuthRequest, res: Response) {
    try {
      const result = await adorationService.getSessions(req.user!.id, req)
      return R.paginated(res, result.data, result.meta)
    } catch { return R.serverError(res) }
  },

  async getGlobalStats(_req: AuthRequest, res: Response) {
    try {
      const stats = await adorationService.getGlobalStats()
      return R.ok(res, stats)
    } catch { return R.serverError(res) }
  },

  async getAvailableShifts(req: AuthRequest, res: Response) {
    try {
      const chapelId = req.query.chapelId as string | undefined
      const shifts   = await adorationService.getAvailableShifts(chapelId)
      return R.ok(res, shifts)
    } catch { return R.serverError(res) }
  },

  async bookShift(req: AuthRequest, res: Response) {
    try {
      const shift = await adorationService.bookShift(req.params.id, req.user!.id)
      return R.ok(res, shift, 'Turno prenotato. Riceverai un promemoria.')
    } catch (err: any) {
      if (err.code === 'P2025') return R.notFound(res, 'Turno non trovato o non disponibile')
      return R.serverError(res)
    }
  },

  async unbookShift(req: AuthRequest, res: Response) {
    try {
      const shift = await adorationService.unbookShift(req.params.id, req.user!.id)
      return R.ok(res, shift, 'Prenotazione cancellata')
    } catch { return R.notFound(res, 'Turno non trovato') }
  },
}
