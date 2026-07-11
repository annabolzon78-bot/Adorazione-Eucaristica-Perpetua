import { prisma } from '../config/database'
import { getPagination, buildMeta } from '../utils/pagination'
import type { Request } from 'express'

const PUBLIC_SELECT = { id: true, name: true, displayName: true, avatarUrl: true, bio: true, country: { select: { nameIt: true, flagEmoji: true } }, totalAdorationHours: true, currentStreak: true, createdAt: true }
const PRIVATE_SELECT = { ...PUBLIC_SELECT, email: true, role: true, phone: true, adoringNow: true, isEmailVerified: true, lastLoginAt: true, updatedAt: true }

export const userService = {
  async getProfile(id: string) {
    return prisma.user.findUniqueOrThrow({ where: { id, deletedAt: null }, select: PRIVATE_SELECT })
  },

  async updateProfile(id: string, data: { name?: string; displayName?: string; bio?: string; avatarUrl?: string; phone?: string; countryId?: string; languageId?: string; timezone?: string }) {
    return prisma.user.update({ where: { id }, data, select: PRIVATE_SELECT })
  },

  async getStats(userId: string) {
    const [sessions, journal, favorites, visits] = await Promise.all([
      prisma.adorationSession.aggregate({ where: { userId, status: 'COMPLETED' }, _sum: { durationMin: true }, _count: true }),
      prisma.spiritualJournal.count({ where: { userId } }),
      prisma.favorite.count({ where: { userId } }),
      prisma.userVisit.count({ where: { userId } }),
    ])
    return {
      totalSessions:    sessions._count,
      totalMinutes:     sessions._sum.durationMin ?? 0,
      totalHours:       Math.round((sessions._sum.durationMin ?? 0) / 60 * 10) / 10,
      journalEntries:   journal,
      favorites,
      chapelsVisited:   visits,
    }
  },

  async getJournal(userId: string, req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const [data, total] = await Promise.all([
      prisma.spiritualJournal.findMany({ where: { userId }, orderBy: { date: 'desc' }, skip, take }),
      prisma.spiritualJournal.count({ where: { userId } }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async createJournalEntry(userId: string, data: { title?: string; text: string; mood?: any; adorationMin?: number; tags?: string[] }) {
    return prisma.spiritualJournal.create({ data: { userId, ...data } })
  },

  async updateJournalEntry(id: string, userId: string, data: any) {
    return prisma.spiritualJournal.update({ where: { id, userId }, data })
  },

  async deleteJournalEntry(id: string, userId: string) {
    return prisma.spiritualJournal.delete({ where: { id, userId } })
  },

  async getVisits(userId: string, req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const [data, total] = await Promise.all([
      prisma.userVisit.findMany({
        where: { userId },
        include: { chapel: { select: { id: true, name: true, city: { select: { name: true } }, country: { select: { nameIt: true, flagEmoji: true } } } } },
        orderBy: { visitedAt: 'desc' }, skip, take,
      }),
      prisma.userVisit.count({ where: { userId } }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async getFavorites(userId: string, req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const type = (req.query.type as string) ?? undefined
    const where: any = { userId }
    if (type) where.type = type
    const [data, total] = await Promise.all([
      prisma.favorite.findMany({
        where, skip, take, orderBy: { createdAt: 'desc' },
        include: {
          chapel:     { select: { id: true, name: true, adorationType: true, country: { select: { nameIt: true } } } },
          prayer:     { select: { id: true, title: true, slug: true } },
          miracle:    { select: { id: true, title: true, slug: true } },
          pilgrimage: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.favorite.count({ where }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async toggleFavorite(userId: string, data: { type: any; chapelId?: string; prayerId?: string; miracleId?: string; pilgrimageId?: string }) {
    const where: any = { userId }
    if (data.chapelId)     where.chapelId     = data.chapelId
    if (data.prayerId)     where.prayerId     = data.prayerId
    if (data.miracleId)    where.miracleId    = data.miracleId
    if (data.pilgrimageId) where.pilgrimageId = data.pilgrimageId
    const existing = await prisma.favorite.findFirst({ where })
    if (existing) { await prisma.favorite.delete({ where: { id: existing.id } }); return { action: 'removed' } }
    await prisma.favorite.create({ data: { userId, ...data } })
    return { action: 'added' }
  },
}
