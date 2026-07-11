import { Router } from 'express'
import { prayerController } from '../controllers/prayer.controller'
import { optionalAuth }     from '../middleware/auth'
import { validate }         from '../middleware/validate'
import { searchLimiter, writeLimiter } from '../middleware/rateLimiter'
import { prayerQuerySchema, createPrayerRequestSchema } from '../validators/prayer.validator'

const router = Router()

router.get ('/categories',          prayerController.getCategories)
router.get ('/',       searchLimiter, validate(prayerQuerySchema, 'query'), prayerController.getAll)
router.get ('/:slug',                prayerController.getBySlug)
router.get ('/requests',             prayerController.getRequests)
router.post('/requests',  writeLimiter, optionalAuth, validate(createPrayerRequestSchema), prayerController.createRequest)
router.post('/requests/:id/pray', writeLimiter, prayerController.pray)

export default router
