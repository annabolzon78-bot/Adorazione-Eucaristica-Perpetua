import type { Response } from 'express'
import type { AuthRequest } from '../types'
import { userService } from '../services/user.service'
import { R } from '../utils/response'

export const userController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await userService.getProfile(req.user!.id)
      return R.ok(res, user)
    } catch { return R.notFound(res, 'Utente non trovato') }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const user = await userService.updateProfile(req.user!.id, req.body)
      return R.ok(res, user, 'Profilo aggiornato')
    } catch { return R.serverError(res) }
  },

  async getStats(req: AuthRequest, res: Response) {
    try {
      const stats = await userService.getStats(req.user!.id)
      return R.ok(res, stats)
    } catch { return R.serverError(res) }
  },

  async getJournal(req: AuthRequest, res: Response) {
    try {
      const result = await userService.getJournal(req.user!.id, req)
      return R.paginated(res, result.data, result.meta)
    } catch { return R.serverError(res) }
  },

  async createJournalEntry(req: AuthRequest, res: Response) {
    try {
      const entry = await userService.createJournalEntry(req.user!.id, req.body)
      return R.created(res, entry)
    } catch { return R.serverError(res) }
  },

  async updateJournalEntry(req: AuthRequest, res: Response) {
    try {
      const entry = await userService.updateJournalEntry(req.params.id, req.user!.id, req.body)
      return R.ok(res, entry)
    } catch { return R.notFound(res, 'Voce non trovata') }
  },

  async deleteJournalEntry(req: AuthRequest, res: Response) {
    try {
      await userService.deleteJournalEntry(req.params.id, req.user!.id)
      return R.noContent(res)
    } catch { return R.notFound(res, 'Voce non trovata') }
  },

  async getVisits(req: AuthRequest, res: Response) {
    try {
      const result = await userService.getVisits(req.user!.id, req)
      return R.paginated(res, result.data, result.meta)
    } catch { return R.serverError(res) }
  },

  async getFavorites(req: AuthRequest, res: Response) {
    try {
      const result = await userService.getFavorites(req.user!.id, req)
      return R.paginated(res, result.data, result.meta)
    } catch { return R.serverError(res) }
  },

  async toggleFavorite(req: AuthRequest, res: Response) {
    try {
      const result = await userService.toggleFavorite(req.user!.id, req.body)
      return R.ok(res, result)
    } catch { return R.serverError(res) }
  },
}
