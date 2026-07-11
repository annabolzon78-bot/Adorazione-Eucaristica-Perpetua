import { prisma } from '../config/database'
import { getPagination, buildMeta } from '../utils/pagination'
import type { Request } from 'express'

const SELECT = {
  id: true, name: true, address: true, lat: true, lng: true,
  adorationType: true, is24h: true, isOpenNow: true, hasLiveStream: true,
  hasConfessions: true, isAccessible: true, status: true,
  country: { select: { code: true, nameIt: true, flagEmoji: true } },
  city:    { select: { name: true, region: true } },
  parish:  { select: { id: true, name: true } },
  streams: { where: { isActive: true, isDefault: true }, select: { type: true, url: true, embedUrl: true, status: true }, take: 1 },
  _count:  { select: { visits: true, sessions: true } },
  createdAt: true, updatedAt: true,
}

export const chapelService = {
  async findMany(req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const q = req.query as Record<string, string>
    const where: any = { deletedAt: null }
    if (q.countryId)      where.countryId     = q.countryId
    if (q.cityId)         where.cityId        = q.cityId
    if (q.adorationType)  where.adorationType = q.adorationType
    if (q.is24h === 'true')        where.is24h       = true
    if (q.openNow === 'true')      where.isOpenNow   = true
    if (q.hasLiveStream === 'true') where.hasLiveStream = true
    if (q.q) where.OR = [{ name: { contains: q.q, mode: 'insensitive' } }, { address: { contains: q.q, mode: 'insensitive' } }]

    // Geo filter: if lat/lng + radius → Haversine in raw SQL
    if (q.lat && q.lng && q.radiusKm) {
      const lat = parseFloat(q.lat), lng = parseFloat(q.lng), r = parseFloat(q.radiusKm)
      const ids = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM chapels
        WHERE deleted_at IS NULL
          AND (6371 * acos(
            cos(radians(${lat})) * cos(radians(lat)) *
            cos(radians(lng) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(lat))
          )) <= ${r}
        ORDER BY (6371 * acos(
          cos(radians(${lat})) * cos(radians(lat)) *
          cos(radians(lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(lat))
        )) ASC LIMIT ${take} OFFSET ${skip}`
      where.id = { in: ids.map((row: any) => row.id) }
    }

    const [data, total] = await Promise.all([
      prisma.chapel.findMany({ where, select: SELECT, skip, take, orderBy: { name: 'asc' } }),
      prisma.chapel.count({ where }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async findById(id: string) {
    return prisma.chapel.findFirstOrThrow({
      where: { id, deletedAt: null },
      include: {
        country: true, city: true, parish: { include: { diocese: true } },
        schedules: { where: { isAvailable: true }, orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }] },
        streams:   { where: { isActive: true } },
        _count:    { select: { visits: true, sessions: true } },
      },
    })
  },

  async create(data: any, adminId: string) {
    return prisma.chapel.create({ data: { ...data, parishId: data.parishId ?? undefined }, select: SELECT })
  },

  async update(id: string, data: any) {
    return prisma.chapel.update({ where: { id }, data, select: SELECT })
  },

  async softDelete(id: string) {
    return prisma.chapel.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async getStats() {
    const [total, perpetua, openNow, withStream] = await Promise.all([
      prisma.chapel.count({ where: { deletedAt: null, status: 'VERIFIED' } }),
      prisma.chapel.count({ where: { deletedAt: null, adorationType: 'PERPETUA' } }),
      prisma.chapel.count({ where: { deletedAt: null, isOpenNow: true } }),
      prisma.chapel.count({ where: { deletedAt: null, hasLiveStream: true } }),
    ])
    return { total, perpetua, openNow, withStream }
  },
}
