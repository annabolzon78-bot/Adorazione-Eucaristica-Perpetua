import { prisma }                  from '../config/database'
import { getPagination, buildMeta } from '../utils/pagination'
import type { Request }             from 'express'
import type { StreamLanguage, Continent, StreamType, StreamStatus } from '../types'

// ── Selezione campi pubblica ────────────────────────────────
const SELECT = {
  id: true, title: true, description: true,
  type: true, status: true, language: true, continent: true,
  url: true, embedUrl: true, embedHtml: true,
  channelId: true, videoId: true, hlsUrl: true,
  thumbnailUrl: true, tags: true,
  isDefault: true, isActive: true, isFeatured: true,
  viewerCount: true, totalViews: true,
  lastCheckedAt: true, lastOnlineAt: true,
  contactEmail: true, websiteUrl: true,
  chapel: {
    select: { id: true, name: true, address: true, lat: true, lng: true,
              city: { select: { name: true } },
              country: { select: { nameIt: true, flagEmoji: true, code: true } } }
  },
  parish: {
    select: { id: true, name: true, address: true,
              city: { select: { name: true } },
              country: { select: { nameIt: true, flagEmoji: true, code: true } } }
  },
  schedules: { orderBy: [{ dayOfWeek: 'asc' as const }, { startTime: 'asc' as const }] },
  createdAt: true, updatedAt: true,
}

// ── Helper: costruisce l'embed URL dal tipo + videoId/url ──
export function buildEmbedUrl(type: StreamType, url: string, videoId?: string): string | null {
  switch (type) {
    case 'YOUTUBE_LIVE':
    case 'YOUTUBE_CHANNEL': {
      const id = videoId ?? extractYouTubeId(url)
      if (!id) return null
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    }
    case 'VIMEO': {
      const id = videoId ?? extractVimeoId(url)
      if (!id) return null
      return `https://player.vimeo.com/video/${id}?autoplay=1&color=8b1a2a`
    }
    case 'HLS':
      return null // Gestito lato frontend con hls.js
    case 'RTSP':
      return null // Richiede proxy backend
    default:
      return url
  }
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/live\/)([^?&]+)/,
    /(?:youtube\.com\/embed\/)([^?&]+)/,
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?&]+)/,
    /(?:youtube\.com\/channel\/)([^?&]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

// ── Servizio principale ─────────────────────────────────────
export const streamService: Record<string, any> = {

  async findMany(req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const q = req.query as Record<string, string>
    const where: any = {}

    if (q.active !== undefined)  where.isActive  = q.active === 'true'
    if (q.featured !== undefined) where.isFeatured = q.featured === 'true'
    if (q.status)    where.status    = q.status
    if (q.type)      where.type      = q.type
    if (q.language)  where.language  = q.language
    if (q.continent) where.continent = q.continent
    if (q.parishId)  where.parishId  = q.parishId
    if (q.chapelId)  where.chapelId  = q.chapelId
    if (q.q) where.OR = [
      { title:       { contains: q.q, mode: 'insensitive' } },
      { description: { contains: q.q, mode: 'insensitive' } },
      { tags:        { has: q.q } },
    ]

    const [data, total] = await Promise.all([
      prisma.liveStream.findMany({
        where, select: SELECT, skip, take,
        orderBy: [{ isFeatured: 'desc' }, { status: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.liveStream.count({ where }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async findById(id: string) {
    const stream = await prisma.liveStream.findUniqueOrThrow({ where: { id }, select: SELECT })
    // Incrementa visualizzazioni
    await prisma.liveStream.update({ where: { id }, data: { totalViews: { increment: 1 } } })
    return stream
  },

  async findActive() {
    return prisma.liveStream.findMany({
      where:   { isActive: true, status: 'ACTIVE' },
      select:  SELECT,
      orderBy: [{ isFeatured: 'desc' }, { viewerCount: 'desc' }],
    })
  },

  async findFeatured() {
    return prisma.liveStream.findMany({
      where:   { isFeatured: true, isActive: true },
      select:  SELECT,
      take:    6,
      orderBy: { viewerCount: 'desc' },
    })
  },

  async findByParish(parishId: string) {
    return prisma.liveStream.findMany({
      where:   { parishId },
      select:  SELECT,
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
  },

  async create(data: {
    chapelId?:   string
    parishId?:   string
    title:       string
    description?:string
    type:        StreamType
    url:         string
    embedUrl?:   string
    embedHtml?:  string
    channelId?:  string
    videoId?:    string
    hlsUrl?:     string
    rtspUrl?:    string
    language:    StreamLanguage
    continent:   Continent
    thumbnailUrl?: string
    tags?:       string[]
    isDefault?:  boolean
    isActive?:   boolean
    isFeatured?: boolean
    contactEmail?: string
    websiteUrl?: string
  }) {
    // Se isDefault, rimuovi default dagli altri stream della stessa entità
    if (data.isDefault && (data.chapelId || data.parishId)) {
      await prisma.liveStream.updateMany({
        where: {
          ...(data.chapelId ? { chapelId: data.chapelId } : {}),
          ...(data.parishId ? { parishId: data.parishId } : {}),
        },
        data: { isDefault: false },
      })
    }
    // Auto-genera embedUrl se non fornito
    const embedUrl = data.embedUrl ?? buildEmbedUrl(data.type, data.url, data.videoId) ?? undefined
    const videoId  = data.videoId ?? extractYouTubeId(data.url) ?? extractVimeoId(data.url) ?? undefined

    return prisma.liveStream.create({
      data: { ...data, embedUrl, videoId },
      select: SELECT,
    })
  },

  async update(id: string, data: Partial<typeof streamService.create extends (d: infer D) => any ? D : never>) {
    if ((data as any).isDefault) {
      const existing = await prisma.liveStream.findUniqueOrThrow({ where: { id }, select: { chapelId: true, parishId: true } })
      await prisma.liveStream.updateMany({
        where: {
          id:         { not: id },
          ...(existing.chapelId ? { chapelId: existing.chapelId } : {}),
          ...(existing.parishId ? { parishId: existing.parishId } : {}),
        },
        data: { isDefault: false },
      })
    }
    return prisma.liveStream.update({ where: { id }, data: data as any, select: SELECT })
  },

  async delete(id: string) {
    return prisma.liveStream.delete({ where: { id } })
  },

  async updateStatus(id: string, status: StreamStatus, viewerCount?: number) {
    const data: any = { status, lastCheckedAt: new Date() }
    if (status === 'ACTIVE') data.lastOnlineAt = new Date()
    if (viewerCount !== undefined) data.viewerCount = viewerCount
    return prisma.liveStream.update({ where: { id }, data, select: { id: true, status: true, viewerCount: true } })
  },

  // ── Schedules ──────────────────────────────────────────────
  async addSchedule(streamId: string, data: {
    dayOfWeek?: number
    specificDate?: Date
    startTime: string
    endTime: string
    timezone?: string
    notes?: string
    isRecurring?: boolean
  }) {
    return prisma.streamSchedule.create({ data: { streamId, ...data } })
  },

  async updateSchedule(scheduleId: string, data: any) {
    return prisma.streamSchedule.update({ where: { id: scheduleId }, data })
  },

  async deleteSchedule(scheduleId: string) {
    return prisma.streamSchedule.delete({ where: { id: scheduleId } })
  },

  // ── Stats globali ──────────────────────────────────────────
  async getGlobalStats() {
    const [total, active, byContinent, byType, byLanguage] = await Promise.all([
      prisma.liveStream.count({ where: { isActive: true } }),
      prisma.liveStream.count({ where: { status: 'ACTIVE' } }),
      prisma.liveStream.groupBy({ by: ['continent'], where: { isActive: true }, _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
      prisma.liveStream.groupBy({ by: ['type'],      where: { isActive: true }, _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
      prisma.liveStream.groupBy({ by: ['language'],  where: { isActive: true }, _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    ])
    return { total, active, byContinent, byType, byLanguage }
  },
}
