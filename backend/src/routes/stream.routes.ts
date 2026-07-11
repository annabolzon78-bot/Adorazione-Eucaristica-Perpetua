import { Router }                from 'express'
import { streamController }      from '../controllers/stream.controller'
import { authenticate, isAdmin, isParishAdmin, optionalAuth } from '../middleware/auth'
import { validate }              from '../middleware/validate'
import { searchLimiter, writeLimiter } from '../middleware/rateLimiter'
import {
  createStreamSchema,
  updateStreamSchema,
  createScheduleSchema,
  streamQuerySchema,
  statusUpdateSchema,
} from '../validators/stream.validator'

const router = Router()

// ── Publiche ─────────────────────────────────────────────────
// GET  /api/streams             Lista con filtri
// GET  /api/streams/active      Solo stream ACTIVE ora
// GET  /api/streams/featured    Stream in evidenza
// GET  /api/streams/stats       Statistiche globali
// GET  /api/streams/:id         Dettaglio stream
// GET  /api/streams/parish/:id  Stream di una parrocchia

router.get('/active',         searchLimiter,                                                 streamController.getActive)
router.get('/featured',       searchLimiter,                                                 streamController.getFeatured)
router.get('/stats',                                                                          streamController.getStats)
router.get('/parish/:parishId',                                                              streamController.getByParish)
router.get('/',               searchLimiter, validate(streamQuerySchema, 'query'), optionalAuth, streamController.getAll)
router.get('/:id',                                                                            streamController.getById)

// ── Gestione parrocchia ──────────────────────────────────────
// POST   /api/streams                       Registra nuovo stream
// PATCH  /api/streams/:id                   Aggiorna stream
// DELETE /api/streams/:id                   Elimina stream
// PATCH  /api/streams/:id/status            Aggiorna stato online/offline

router.post('/',
  authenticate, isParishAdmin, writeLimiter,
  validate(createStreamSchema),
  streamController.create
)

router.patch('/:id',
  authenticate, isParishAdmin,
  validate(updateStreamSchema),
  streamController.update
)

router.delete('/:id',
  authenticate, isParishAdmin,
  streamController.delete
)

router.patch('/:id/status',
  authenticate, isParishAdmin,
  validate(statusUpdateSchema),
  streamController.updateStatus
)

// ── Schedules (orari) ────────────────────────────────────────
// POST   /api/streams/:id/schedules
// PATCH  /api/streams/:id/schedules/:scheduleId
// DELETE /api/streams/:id/schedules/:scheduleId

router.post('/:id/schedules',
  authenticate, isParishAdmin, writeLimiter,
  validate(createScheduleSchema),
  streamController.addSchedule
)

router.patch('/:id/schedules/:scheduleId',
  authenticate, isParishAdmin,
  streamController.updateSchedule
)

router.delete('/:id/schedules/:scheduleId',
  authenticate, isParishAdmin,
  streamController.deleteSchedule
)

export default router
