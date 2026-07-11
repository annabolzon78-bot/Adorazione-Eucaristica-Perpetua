import type { Request, Response } from 'express'
import type { AuthRequest }       from '../types'
import { streamService }           from '../services/stream.service'
import { R }                       from '../utils/response'
import { logger }                  from '../utils/logger'

export const streamController = {

  // ── Pubblica ──────────────────────────────────────────────

  async getAll(req: Request, res: Response) {
    try {
      const result = await streamService.findMany(req)
      return R.paginated(res, result.data, result.meta)
    } catch (err) { logger.error(err); return R.serverError(res) }
  },

  async getActive(_req: Request, res: Response) {
    try { return R.ok(res, await streamService.findActive()) }
    catch (err) { logger.error(err); return R.serverError(res) }
  },

  async getFeatured(_req: Request, res: Response) {
    try { return R.ok(res, await streamService.findFeatured()) }
    catch (err) { logger.error(err); return R.serverError(res) }
  },

  async getById(req: Request, res: Response) {
    try { return R.ok(res, await streamService.findById(req.params.id)) }
    catch { return R.notFound(res, 'Stream non trovato') }
  },

  async getByParish(req: Request, res: Response) {
    try { return R.ok(res, await streamService.findByParish(req.params.parishId)) }
    catch (err) { logger.error(err); return R.serverError(res) }
  },

  async getStats(_req: Request, res: Response) {
    try { return R.ok(res, await streamService.getGlobalStats()) }
    catch (err) { logger.error(err); return R.serverError(res) }
  },

  // ── Gestione parrocchia ───────────────────────────────────

  async create(req: AuthRequest, res: Response) {
    try {
      const stream = await streamService.create(req.body)
      logger.info({ msg: 'Stream creato', id: stream.id, user: req.user?.id })
      return R.created(res, stream, 'Stream registrato con successo')
    } catch (err: any) {
      if (err.message?.includes('Specifica almeno')) return R.unprocessable(res, err.message)
      logger.error(err)
      return R.serverError(res)
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const stream = await streamService.update(req.params.id, req.body)
      return R.ok(res, stream, 'Stream aggiornato')
    } catch (err: any) {
      if (err.code === 'P2025') return R.notFound(res, 'Stream non trovato')
      logger.error(err)
      return R.serverError(res)
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await streamService.delete(req.params.id)
      logger.info({ msg: 'Stream eliminato', id: req.params.id, user: req.user?.id })
      return R.noContent(res)
    } catch { return R.notFound(res, 'Stream non trovato') }
  },

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { status, viewerCount } = req.body
      const updated = await streamService.updateStatus(req.params.id, status, viewerCount)
      return R.ok(res, updated, `Stato aggiornato: ${status}`)
    } catch { return R.notFound(res, 'Stream non trovato') }
  },

  // ── Schedules ──────────────────────────────────────────────

  async addSchedule(req: AuthRequest, res: Response) {
    try {
      const sched = await streamService.addSchedule(req.params.id, req.body)
      return R.created(res, sched, 'Orario aggiunto')
    } catch (err) { logger.error(err); return R.serverError(res) }
  },

  async updateSchedule(req: AuthRequest, res: Response) {
    try {
      const sched = await streamService.updateSchedule(req.params.scheduleId, req.body)
      return R.ok(res, sched, 'Orario aggiornato')
    } catch { return R.notFound(res, 'Orario non trovato') }
  },

  async deleteSchedule(req: AuthRequest, res: Response) {
    try {
      await streamService.deleteSchedule(req.params.scheduleId)
      return R.noContent(res)
    } catch { return R.notFound(res, 'Orario non trovato') }
  },
}
