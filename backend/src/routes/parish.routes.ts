import { Router } from 'express'
import { parishController }  from '../controllers/parish.controller'
import { authenticate, isAdmin, isParishAdmin, optionalAuth } from '../middleware/auth'
import { validate }          from '../middleware/validate'
import { searchLimiter }     from '../middleware/rateLimiter'
import { createParishSchema, updateParishSchema, parishQuerySchema } from '../validators/parish.validator'

const router = Router()

router.get ('/',            searchLimiter, validate(parishQuerySchema, 'query'), optionalAuth, parishController.getAll)
router.get ('/:id',                                                               parishController.getById)
router.post('/',            authenticate, isParishAdmin, validate(createParishSchema), parishController.create)
router.patch('/:id',        authenticate, isParishAdmin, validate(updateParishSchema), parishController.update)
router.delete('/:id',       authenticate, isAdmin,                                parishController.delete)
router.post('/:id/verify',  authenticate, isAdmin,                                parishController.verify)

export default router
