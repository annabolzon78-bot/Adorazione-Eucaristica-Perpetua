import type { Request, Response } from 'express'
import type { AuthRequest }       from '../types'
import { miracleService }          from '../services/miracle.service'
import { R }                       from '../utils/response'

export const miracleController = {
  getAll:    async (req: Request, res: Response) => { try { const r = await miracleService.findMany(req); return R.paginated(res, r.data, r.meta) } catch(e) { return R.serverError(res) } },
  getFeatured: async (_req: Request, res: Response) => { try { return R.ok(res, await miracleService.getFeatured()) } catch { return R.serverError(res) } },
  getMapPoints:async (_req: Request, res: Response) => { try { return R.ok(res, await miracleService.getMapPoints()) } catch { return R.serverError(res) } },
  getStats:  async (_req: Request, res: Response) => { try { return R.ok(res, await miracleService.getStats()) } catch { return R.serverError(res) } },
  getBySlug: async (req: Request, res: Response)  => { try { return R.ok(res, await miracleService.findBySlug(req.params.slug)) } catch { return R.notFound(res, 'Miracolo non trovato') } },
  getById:   async (req: Request, res: Response)  => { try { return R.ok(res, await miracleService.findById(req.params.id)) } catch { return R.notFound(res, 'Miracolo non trovato') } },
  create:    async (req: AuthRequest, res: Response) => { try { return R.created(res, await miracleService.create(req.body)) } catch(e:any) { return e.code==='P2002' ? R.conflict(res,'Slug già esistente') : R.serverError(res) } },
  update:    async (req: AuthRequest, res: Response) => { try { return R.ok(res, await miracleService.update(req.params.id, req.body)) } catch { return R.notFound(res, 'Miracolo non trovato') } },
  delete:    async (req: AuthRequest, res: Response) => { try { await miracleService.delete(req.params.id); return R.noContent(res) } catch { return R.notFound(res, 'Miracolo non trovato') } },
  // Images
  addImage:    async (req: AuthRequest, res: Response) => { try { return R.created(res, await miracleService.addImage(req.params.id, req.body)) } catch { return R.serverError(res) } },
  deleteImage: async (req: AuthRequest, res: Response) => { try { await miracleService.deleteImage(req.params.imageId); return R.noContent(res) } catch { return R.notFound(res) } },
  // Videos
  addVideo:    async (req: AuthRequest, res: Response) => { try { return R.created(res, await miracleService.addVideo(req.params.id, req.body)) } catch { return R.serverError(res) } },
  deleteVideo: async (req: AuthRequest, res: Response) => { try { await miracleService.deleteVideo(req.params.videoId); return R.noContent(res) } catch { return R.notFound(res) } },
  // Documents
  addDocument:    async (req: AuthRequest, res: Response) => { try { return R.created(res, await miracleService.addDocument(req.params.id, req.body)) } catch { return R.serverError(res) } },
  deleteDocument: async (req: AuthRequest, res: Response) => { try { await miracleService.deleteDocument(req.params.docId); return R.noContent(res) } catch { return R.notFound(res) } },
  // Bibliography
  addBibliography:    async (req: AuthRequest, res: Response) => { try { return R.created(res, await miracleService.addBibliography(req.params.id, req.body)) } catch { return R.serverError(res) } },
  updateBibliography: async (req: AuthRequest, res: Response) => { try { return R.ok(res, await miracleService.updateBibliography(req.params.bibId, req.body)) } catch { return R.notFound(res) } },
  deleteBibliography: async (req: AuthRequest, res: Response) => { try { await miracleService.deleteBibliography(req.params.bibId); return R.noContent(res) } catch { return R.notFound(res) } },
  // Pilgrimages
  addPilgrimage:    async (req: AuthRequest, res: Response) => { try { return R.created(res, await miracleService.addPilgrimage(req.params.id, req.body)) } catch { return R.serverError(res) } },
  updatePilgrimage: async (req: AuthRequest, res: Response) => { try { return R.ok(res, await miracleService.updatePilgrimage(req.params.pilgId, req.body)) } catch { return R.notFound(res) } },
  deletePilgrimage: async (req: AuthRequest, res: Response) => { try { await miracleService.deletePilgrimage(req.params.pilgId); return R.noContent(res) } catch { return R.notFound(res) } },
}
