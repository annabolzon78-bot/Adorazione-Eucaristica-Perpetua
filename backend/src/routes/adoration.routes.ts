import { Router } from 'express'
import { adorationController } from '../controllers/adoration.controller'
import { authenticate }        from '../middleware/auth'
import { validate }            from '../middleware/validate'
import { startSessionSchema, endSessionSchema, createScheduleSchema } from '../validators/adoration.validator'
import { writeLimiter }        from '../middleware/rateLimiter'

const router = Router()

// Stats globale (pubblica)
router.get('/stats',               adorationController.getGlobalStats)

// Turni
router.get('/shifts',              adorationController.getAvailableShifts)
router.post('/shifts/:id/book',    authenticate, writeLimiter, adorationController.bookShift)
router.delete('/shifts/:id/book',  authenticate,              adorationController.unbookShift)

// Sessioni
router.get('/sessions/active',     authenticate, adorationController.getActiveSession)
router.get('/sessions',            authenticate, adorationController.getSessions)
router.post('/sessions',           authenticate, writeLimiter, validate(startSessionSchema), adorationController.startSession)
router.patch('/sessions/:id/end',  authenticate, validate(endSessionSchema), adorationController.endSession)

export default router
