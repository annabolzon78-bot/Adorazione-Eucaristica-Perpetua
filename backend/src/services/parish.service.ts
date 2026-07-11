import { prisma } from '../config/database'
import { getPagination, buildMeta } from '../utils/pagination'
import type { Request } from 'express'

const SELECT = {
  id: true, name: true, address: true, lat: true, lng: true,
  status: true, hasAdoration: true, hasPerpetualAdoration: true,
  hasLiveStream: true, hasConfessions: true, isAccessible: true,
  email: true, phone: true, websiteUrl: true, pastorName: true,
  country: { select: { code: true, nameIt: true, flagEmoji: true } },
  city:    { select: { name: true, region: true } },
  diocese: { select: { id: true, name: true } },
  _count:  { select: { chapels: true, events: true, massSchedules: true } },
  createdAt: true, updatedAt: true,
}

export const parishService = {
  async findMany(req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const q = req.query as Record<string, string>
    const where: any = {}
    if (q.countryId)   where.countryId   = q.countryId
    if (q.cityId)      where.cityId      = q.cityId
    if (q.dioceseId)   where.dioceseId   = q.dioceseId
    if (q.hasAdoration === 'true') where.hasAdoration = true
    if (q.q) where.OR = [{ name: { contains: q.q, mode: 'insensitive' } }, { address: { contains: q.q, mode: 'insensitive' } }]
    const [data, total] = await Promise.all([
      prisma.parish.findMany({ where, select: SELECT, skip, take, orderBy: { name: 'asc' } }),
      prisma.parish.count({ where }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async findById(id: string) {
    return prisma.parish.findUniqueOrThrow({
      where: { id },
      include: {
        country: true, city: true, diocese: true, religiousOrder: true,
        chapels:  { where: { deletedAt: null }, select: { id: true, name: true, adorationType: true, is24h: true } },
        massSchedules: { orderBy: [{ dayOfWeek: 'asc' }, { time: 'asc' }] },
        confessions:   { orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }] },
        events: { where: { startDate: { gte: new Date() }, isPublished: true }, orderBy: { startDate: 'asc' }, take: 5 },
      },
    })
  },

  async create(data: any)          { return prisma.parish.create({ data, select: SELECT }) },
  async update(id: string, data: any) { return prisma.parish.update({ where: { id }, data, select: SELECT }) },
  async delete(id: string)         { return prisma.parish.delete({ where: { id } }) },

  async verify(id: string) {
    return prisma.parish.update({ where: { id }, data: { status: 'VERIFIED', verifiedAt: new Date() } })
  },
}
