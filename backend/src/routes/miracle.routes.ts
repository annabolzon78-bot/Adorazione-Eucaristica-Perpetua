import { Router }                from 'express'
import { miracleController }     from '../controllers/miracle.controller'
import { authenticate, isAdmin } from '../middleware/auth'
import { validate }              from '../middleware/validate'
import { searchLimiter, writeLimiter } from '../middleware/rateLimiter'
import {
  miracleQuerySchema, createMiracleSchema, updateMiracleSchema,
  createImageSchema, createVideoSchema, createDocumentSchema,
  createBibliographySchema, createPilgrimageSchema,
} from '../validators/miracle.validator'

const r = Router()

// ── Publiche ─────────────────────────────────────────────────
r.get('/featured',   searchLimiter, miracleController.getFeatured)
r.get('/map-points', searchLimiter, miracleController.getMapPoints)
r.get('/stats',                     miracleController.getStats)
r.get('/',           searchLimiter, validate(miracleQuerySchema, 'query'), miracleController.getAll)
r.get('/id/:id',                    miracleController.getById)
r.get('/:slug',                     miracleController.getBySlug)

// ── Admin: CRUD ───────────────────────────────────────────────
r.post('/',          authenticate, isAdmin, writeLimiter, validate(createMiracleSchema), miracleController.create)
r.patch('/:id',      authenticate, isAdmin, validate(updateMiracleSchema),  miracleController.update)
r.delete('/:id',     authenticate, isAdmin,                                  miracleController.delete)

// ── Admin: Images ─────────────────────────────────────────────
r.post('/:id/images',        authenticate, isAdmin, validate(createImageSchema),   miracleController.addImage)
r.delete('/:id/images/:imageId', authenticate, isAdmin,                            miracleController.deleteImage)

// ── Admin: Videos ─────────────────────────────────────────────
r.post('/:id/videos',        authenticate, isAdmin, validate(createVideoSchema),   miracleController.addVideo)
r.delete('/:id/videos/:videoId', authenticate, isAdmin,                            miracleController.deleteVideo)

// ── Admin: Documents ──────────────────────────────────────────
r.post('/:id/documents',     authenticate, isAdmin, validate(createDocumentSchema), miracleController.addDocument)
r.delete('/:id/documents/:docId', authenticate, isAdmin,                            miracleController.deleteDocument)

// ── Admin: Bibliography ───────────────────────────────────────
r.post('/:id/bibliography',        authenticate, isAdmin, validate(createBibliographySchema), miracleController.addBibliography)
r.patch('/:id/bibliography/:bibId', authenticate, isAdmin,                                     miracleController.updateBibliography)
r.delete('/:id/bibliography/:bibId',authenticate, isAdmin,                                     miracleController.deleteBibliography)

// ── Admin: Pilgrimages ────────────────────────────────────────
r.post('/:id/pilgrimages',         authenticate, isAdmin, validate(createPilgrimageSchema), miracleController.addPilgrimage)
r.patch('/:id/pilgrimages/:pilgId', authenticate, isAdmin,                                   miracleController.updatePilgrimage)
r.delete('/:id/pilgrimages/:pilgId',authenticate, isAdmin,                                   miracleController.deletePilgrimage)

export default r
