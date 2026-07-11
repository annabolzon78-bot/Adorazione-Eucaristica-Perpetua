import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { authenticate }   from '../middleware/auth'
import { writeLimiter }   from '../middleware/rateLimiter'

const router = Router()
router.get   ('/profile',           authenticate, userController.getProfile)
router.patch ('/profile',           authenticate, userController.updateProfile)
router.get   ('/stats',             authenticate, userController.getStats)
router.get   ('/visits',            authenticate, userController.getVisits)
// Favorites
router.get   ('/favorites',         authenticate, userController.getFavorites)
router.post  ('/favorites',         authenticate, writeLimiter, userController.toggleFavorite)
// Journal
router.get   ('/journal',           authenticate, userController.getJournal)
router.post  ('/journal',           authenticate, writeLimiter, userController.createJournalEntry)
router.patch ('/journal/:id',       authenticate, userController.updateJournalEntry)
router.delete('/journal/:id',       authenticate, userController.deleteJournalEntry)
export default router
