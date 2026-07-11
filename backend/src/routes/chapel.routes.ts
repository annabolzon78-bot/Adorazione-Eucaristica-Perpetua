import { Router } from 'express'
import { chapelController }  from '../controllers/chapel.controller'
import { authenticate, isAdmin, isParishAdmin, optionalAuth } from '../middleware/auth'
import { validate }          from '../middleware/validate'
import { searchLimiter }     from '../middleware/rateLimiter'
import { createChapelSchema, updateChapelSchema, chapelQuerySchema } from '../validators/chapel.validator'
import { idParam }           from '../middleware/validate'

const router = Router()

router.get ('/',         searchLimiter, validate(chapelQuerySchema, 'query'), optionalAuth, chapelController.getAll)
router.get ('/stats',                                                          chapelController.getStats)
router.get ('/:id',      validate(idParam, 'params'),                         chapelController.getById)
router.post('/',         authenticate, isParishAdmin, validate(createChapelSchema), chapelController.create)
router.patch('/:id',     authenticate, isParishAdmin, validate(updateChapelSchema), chapelController.update)
router.delete('/:id',    authenticate, isAdmin,                                chapelController.delete)

export default router
