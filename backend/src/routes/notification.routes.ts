import { Router } from 'express'
import { notificationController } from '../controllers/notification.controller'
import { authenticate }            from '../middleware/auth'

const router = Router()
router.get ('/',              authenticate, notificationController.getAll)
router.patch('/:id/read',    authenticate, notificationController.markRead)
router.post ('/read-all',    authenticate, notificationController.markAllRead)
router.delete('/:id',        authenticate, notificationController.delete)
export default router
