import { prisma } from '../config/database'
import { getPagination, buildMeta } from '../utils/pagination'
import type { Request } from 'express'

export const prayerService = {
  async getCategories() {
    return prisma.prayerCategory.findMany({
      where:   { isActive: true },
      include: { _count: { select: { prayers: true } } },
      orderBy: { sortOrder: 'asc' },
    })
  },

  async findMany(req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const q = req.query as Record<string, string>
    const where: any = { isPublished: true }
    if (q.categoryId) where.categoryId = q.categoryId
    if (q.language)   where.language   = q.language
    if (q.q) where.OR = [
      { title:        { contains: q.q, mode: 'insensitive' } },
      { originalText: { contains: q.q, mode: 'insensitive' } },
      { author:       { contains: q.q, mode: 'insensitive' } },
    ]
    const [data, total] = await Promise.all([
      prisma.prayer.findMany({ where, skip, take, include: { category: { select: { name: true, slug: true, icon: true, color: true } } }, orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] }),
      prisma.prayer.count({ where }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async findBySlug(slug: string) {
    const prayer = await prisma.prayer.findUniqueOrThrow({ where: { slug }, include: { category: true } })
    await prisma.prayer.update({ where: { id: prayer.id }, data: { viewCount: { increment: 1 } } })
    return prayer
  },

  async getRequests(req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const [data, total] = await Promise.all([
      prisma.prayerRequest.findMany({
        where: { isPublic: true },
        select: { id: true, text: true, authorName: true, isAnonymous: true, prayerCount: true, category: true, createdAt: true },
        skip, take, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.prayerRequest.count({ where: { isPublic: true } }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async createRequest(data: { text: string; authorName?: string; isAnonymous: boolean; category?: string; isPublic: boolean; userId?: string }) {
    return prisma.prayerRequest.create({ data: { ...data, authorName: data.isAnonymous ? undefined : data.authorName } })
  },

  async pray(requestId: string) {
    return prisma.prayerRequest.update({ where: { id: requestId }, data: { prayerCount: { increment: 1 } } })
  },
}
