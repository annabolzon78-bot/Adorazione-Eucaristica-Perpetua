import { Router } from 'express'
import { authController }    from '../controllers/auth.controller'
import { authenticate }      from '../middleware/auth'
import { validate }          from '../middleware/validate'
import { authLimiter }       from '../middleware/rateLimiter'
import { registerSchema, loginSchema, refreshSchema, changePasswordSchema } from '../validators/auth.validator'

const router = Router()

router.post('/register',         authLimiter, validate(registerSchema),       authController.register)
router.post('/login',            authLimiter, validate(loginSchema),           authController.login)
router.post('/refresh',                       validate(refreshSchema),          authController.refresh)
router.post('/logout',           authenticate,                                  authController.logout)
router.get ('/me',               authenticate,                                  authController.me)
router.patch('/change-password', authenticate, validate(changePasswordSchema),  authController.changePassword)

export default router
