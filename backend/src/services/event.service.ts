import { prisma } from '../config/database'
import { getPagination, buildMeta } from '../utils/pagination'
import type { Request } from 'express'

export const eventService = {
  async findMany(req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const q = req.query as Record<string, string>
    const where: any = { isPublished: true, startDate: { gte: new Date() } }
    if (q.type)     where.type     = q.type
    if (q.cityId)   where.cityId   = q.cityId
    if (q.parishId) where.parishId = q.parishId
    if (q.q) where.OR = [{ title: { contains: q.q, mode: 'insensitive' } }, { description: { contains: q.q, mode: 'insensitive' } }]
    const [data, total] = await Promise.all([
      prisma.event.findMany({ where, skip, take, include: { city: { select: { name: true } }, parish: { select: { id: true, name: true } } }, orderBy: { startDate: 'asc' } }),
      prisma.event.count({ where }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async findBySlug(slug: string) {
    const event = await prisma.event.findUniqueOrThrow({ where: { slug }, include: { city: true, parish: true } })
    await prisma.event.update({ where: { id: event.id }, data: { viewCount: { increment: 1 } } })
    return event
  },

  async create(data: any)          { return prisma.event.create({ data }) },
  async update(id: string, data: any) { return prisma.event.update({ where: { id }, data }) },
  async delete(id: string)         { return prisma.event.delete({ where: { id } }) },
}
