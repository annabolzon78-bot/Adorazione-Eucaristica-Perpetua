import type { Response } from 'express'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  meta?: Record<string, unknown>
}

export interface PaginatedMeta {
  total:    number
  page:     number
  limit:    number
  pages:    number
  hasNext:  boolean
  hasPrev:  boolean
}

export const R = {
  ok<T>(res: Response, data: T, message?: string, meta?: Record<string, unknown>) {
    return res.status(200).json({ success: true, data, ...(message && { message }), ...(meta && { meta }) })
  },
  created<T>(res: Response, data: T, message = 'Creato con successo') {
    return res.status(201).json({ success: true, data, message })
  },
  paginated<T>(res: Response, data: T[], meta: PaginatedMeta) {
    return res.status(200).json({ success: true, data, meta })
  },
  noContent(res: Response) {
    return res.status(204).send()
  },
  badRequest(res: Response, error: string) {
    return res.status(400).json({ success: false, error })
  },
  unauthorized(res: Response, error = 'Non autorizzato') {
    return res.status(401).json({ success: false, error })
  },
  forbidden(res: Response, error = 'Accesso negato') {
    return res.status(403).json({ success: false, error })
  },
  notFound(res: Response, error = 'Risorsa non trovata') {
    return res.status(404).json({ success: false, error })
  },
  conflict(res: Response, error: string) {
    return res.status(409).json({ success: false, error })
  },
  unprocessable(res: Response, error: string) {
    return res.status(422).json({ success: false, error })
  },
  serverError(res: Response, error = 'Errore interno del server') {
    return res.status(500).json({ success: false, error })
  },
}
