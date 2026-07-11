import { Router } from 'express'
import { eventController }   from '../controllers/event.controller'
import { authenticate, isParishAdmin } from '../middleware/auth'
import { searchLimiter }     from '../middleware/rateLimiter'

const router = Router()
router.get ('/',         searchLimiter, eventController.getAll)
router.get ('/:slug',                   eventController.getBySlug)
router.post('/',         authenticate, isParishAdmin, eventController.create)
router.patch('/:id',     authenticate, isParishAdmin, eventController.update)
router.delete('/:id',    authenticate, isParishAdmin, eventController.delete)
export default router
