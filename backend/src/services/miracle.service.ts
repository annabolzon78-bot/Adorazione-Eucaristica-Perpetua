import { prisma }                  from '../config/database'
import { getPagination, buildMeta } from '../utils/pagination'
import type { Request }             from 'express'
import type { Continent, MiracleVerificationLevel } from '../types'

// Selezione campi lista (leggera)
const LIST_SELECT = {
  id:true, title:true, slug:true, location:true, city:true, state:true,
  continent:true, year:true, yearCa:true, verificationLevel:true,
  summary:true, imageUrl:true, thumbnailUrl:true,
  tissueType:true, bloodType:true, isVisitableToday:true,
  country:{ select:{ code:true, nameIt:true, flagEmoji:true } },
  saints: { select:{ id:true, name:true } },
  _count: { select:{ images:true, videos:true, documents:true, bibliography:true, pilgrimages:true } },
  viewCount:true, featuredOrder:true, isPublished:true,
  createdAt:true,
}

// Selezione campi dettaglio (completa)
const DETAIL_INCLUDE = {
  country:      true,
  saints:       { select:{ id:true, name:true, slug:true, imageUrl:true, category:true } },
  images:       { orderBy:{ sortOrder:'asc' as const } },
  videos:       { orderBy:{ sortOrder:'asc' as const } },
  documents:    { where:{ isPublic:true }, orderBy:{ sortOrder:'asc' as const } },
  bibliography: { orderBy:{ sortOrder:'asc' as const } },
  pilgrimages:  { orderBy:{ sortOrder:'asc' as const } },
  favorites:    false,
}

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export const miracleService = {

  async findMany(req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const q = req.query as Record<string, string>
    const where: any = { isPublished: true }

    if (q.continent)         where.continent         = q.continent
    if (q.countryId)         where.countryId         = q.countryId
    if (q.verificationLevel) where.verificationLevel = q.verificationLevel
    if (q.isVisitable === 'true') where.isVisitableToday = true
    if (q.hasScience  === 'true') where.scientificAnalysis = { not: null }
    if (q.hasVideo    === 'true') where.videos = { some: {} }

    if (q.yearFrom || q.yearTo) {
      where.year = {}
      if (q.yearFrom) where.year.gte = parseInt(q.yearFrom)
      if (q.yearTo)   where.year.lte = parseInt(q.yearTo)
    }

    if (q.q) {
      const term = { contains: q.q, mode: 'insensitive' as const }
      where.OR = [
        { title:       term },
        { location:    term },
        { city:        term },
        { summary:     term },
        { fullDescription: term },
      ]
    }

    // Geo filter (Haversine)
    if (q.lat && q.lng && q.radiusKm) {
      const lat = parseFloat(q.lat), lng = parseFloat(q.lng), r = parseFloat(q.radiusKm)
      const ids = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM eucharistic_miracles
        WHERE is_published = true
          AND lat IS NOT NULL AND lng IS NOT NULL
          AND (6371 * acos(
            cos(radians(${lat})) * cos(radians(lat)) *
            cos(radians(lng) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(lat))
          )) <= ${r}
        ORDER BY (6371 * acos(
          cos(radians(${lat})) * cos(radians(lat)) *
          cos(radians(lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(lat))
        )) ASC`
      where.id = { in: ids.map((row: any) => row.id) }
    }

    const sortBy  = (q.sortBy  ?? 'featuredOrder') as string
    const sortDir = (q.sortDir ?? 'asc')            as 'asc' | 'desc'
    const orderBy: any = sortBy === 'featuredOrder'
      ? [{ featuredOrder: sortDir }, { year: 'asc' }]
      : [{ [sortBy]: sortDir }]

    const [data, total] = await Promise.all([
      prisma.eucharisticMiracle.findMany({ where, select: LIST_SELECT, skip, take, orderBy }),
      prisma.eucharisticMiracle.count({ where }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async findBySlug(slug: string) {
    const miracle = await prisma.eucharisticMiracle.findUniqueOrThrow({
      where:   { slug },
      include: DETAIL_INCLUDE as any,
    })
    await prisma.eucharisticMiracle.update({ where: { id: miracle.id }, data: { viewCount: { increment: 1 } } })
    return miracle
  },

  async findById(id: string) {
    return prisma.eucharisticMiracle.findUniqueOrThrow({ where: { id }, include: DETAIL_INCLUDE as any })
  },

  async getFeatured() {
    return prisma.eucharisticMiracle.findMany({
      where:   { isPublished: true, featuredOrder: { not: null } },
      select:  LIST_SELECT,
      orderBy: [{ featuredOrder: 'asc' }, { year: 'asc' }],
      take:    15,
    })
  },

  async getMapPoints() {
    return prisma.eucharisticMiracle.findMany({
      where:   { isPublished: true, lat: { not: null }, lng: { not: null } },
      select:  { id:true, title:true, slug:true, lat:true, lng:true, city:true,
                 continent:true, verificationLevel:true, year:true, yearCa:true,
                 thumbnailUrl:true, isVisitableToday:true,
                 country:{ select:{ nameIt:true, flagEmoji:true } } },
    })
  },

  async getStats() {
    const [total, byContinent, byLevel, withScience, visitable] = await Promise.all([
      prisma.eucharisticMiracle.count({ where: { isPublished: true } }),
      prisma.eucharisticMiracle.groupBy({ by: ['continent'], where: { isPublished: true }, _count: { id: true } }),
      prisma.eucharisticMiracle.groupBy({ by: ['verificationLevel'], where: { isPublished: true }, _count: { id: true } }),
      prisma.eucharisticMiracle.count({ where: { isPublished: true, scientificAnalysis: { not: null } } }),
      prisma.eucharisticMiracle.count({ where: { isPublished: true, isVisitableToday: true } }),
    ])
    return { total, byContinent, byLevel, withScience, visitable }
  },

  async create(data: any) {
    const slug = data.slug ?? slugify(data.title)
    return prisma.eucharisticMiracle.create({ data: { ...data, slug }, select: LIST_SELECT })
  },

  async update(id: string, data: any) {
    return prisma.eucharisticMiracle.update({ where: { id }, data, include: DETAIL_INCLUDE as any })
  },

  async delete(id: string) {
    return prisma.eucharisticMiracle.delete({ where: { id } })
  },

  // ── Images ───────────────────────────────────────────────
  async addImage(miracleId: string, data: any) {
    if (data.isCover) {
      await prisma.miracleImage.updateMany({ where: { miracleId }, data: { isCover: false } })
    }
    return prisma.miracleImage.create({ data: { miracleId, ...data } })
  },
  async deleteImage(id: string) { return prisma.miracleImage.delete({ where: { id } }) },

  // ── Videos ───────────────────────────────────────────────
  async addVideo(miracleId: string, data: any) {
    const embedUrl = data.embedUrl ?? buildVideoEmbed(data.platform ?? 'YOUTUBE', data.url, data.videoId)
    const videoId  = data.videoId  ?? extractVideoId(data.platform ?? 'YOUTUBE', data.url)
    return prisma.miracleVideo.create({ data: { miracleId, ...data, embedUrl, videoId } })
  },
  async deleteVideo(id: string) { return prisma.miracleVideo.delete({ where: { id } }) },

  // ── Documents ────────────────────────────────────────────
  async addDocument(miracleId: string, data: any) {
    return prisma.miracleDocument.create({ data: { miracleId, ...data } })
  },
  async deleteDocument(id: string) { return prisma.miracleDocument.delete({ where: { id } }) },

  // ── Bibliography ─────────────────────────────────────────
  async addBibliography(miracleId: string, data: any) {
    return prisma.miracleBibliography.create({ data: { miracleId, ...data } })
  },
  async updateBibliography(id: string, data: any) {
    return prisma.miracleBibliography.update({ where: { id }, data })
  },
  async deleteBibliography(id: string) { return prisma.miracleBibliography.delete({ where: { id } }) },

  // ── Pilgrimages ──────────────────────────────────────────
  async addPilgrimage(miracleId: string, data: any) {
    return prisma.miraclePilgrimage.create({ data: { miracleId, ...data } })
  },
  async updatePilgrimage(id: string, data: any) {
    return prisma.miraclePilgrimage.update({ where: { id }, data })
  },
  async deletePilgrimage(id: string) { return prisma.miraclePilgrimage.delete({ where: { id } }) },
}

function buildVideoEmbed(platform: string, url: string, videoId?: string): string | null {
  const id = videoId ?? extractVideoId(platform, url)
  if (!id) return null
  if (platform === 'YOUTUBE') return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
  if (platform === 'VIMEO')   return `https://player.vimeo.com/video/${id}`
  return null
}

function extractVideoId(platform: string, url: string): string | null {
  if (platform === 'YOUTUBE') {
    const m = url.match(/(?:v=|live\/|embed\/|youtu\.be\/)([^?&\s]+)/)
    return m ? m[1] : null
  }
  if (platform === 'VIMEO') {
    const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    return m ? m[1] : null
  }
  return null
}
