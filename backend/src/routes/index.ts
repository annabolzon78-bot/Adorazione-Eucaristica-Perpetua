import { Router } from 'express'
import authRoutes         from './auth.routes'
import userRoutes         from './user.routes'
import chapelRoutes       from './chapel.routes'
import parishRoutes       from './parish.routes'
import dioceseRoutes      from './diocese.routes'
import adorationRoutes    from './adoration.routes'
import miracleRoutes      from './miracle.routes'
import prayerRoutes       from './prayer.routes'
import eventRoutes        from './event.routes'
import searchRoutes       from './search.routes'
import notificationRoutes from './notification.routes'
import streamRoutes       from './stream.routes'

const router = Router()

router.use('/auth',          authRoutes)
router.use('/users',         userRoutes)
router.use('/chapels',       chapelRoutes)
router.use('/parishes',      parishRoutes)
router.use('/dioceses',      dioceseRoutes)
router.use('/adoration',     adorationRoutes)
router.use('/miracles',      miracleRoutes)
router.use('/prayers',       prayerRoutes)
router.use('/events',        eventRoutes)
router.use('/search',        searchRoutes)
router.use('/notifications', notificationRoutes)
router.use('/streams',       streamRoutes)

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'adorazione-viva-api', ts: new Date().toISOString() })
})

export default router
