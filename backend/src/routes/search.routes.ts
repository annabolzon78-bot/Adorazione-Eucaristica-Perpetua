import { Router } from 'express'
import { searchController }  from '../controllers/search.controller'
import { searchLimiter }     from '../middleware/rateLimiter'
import { validate }          from '../middleware/validate'
import { searchSchema }      from '../validators/search.validator'

const router = Router()
router.get('/', searchLimiter, validate(searchSchema, 'query'), searchController.search)
export default router
