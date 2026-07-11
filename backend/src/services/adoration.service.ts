import { prisma } from '../config/database'
import { getPagination, buildMeta } from '../utils/pagination'
import type { Request } from 'express'

export const adorationService = {
  async startSession(userId: string, data: { chapelId?: string; isVirtual: boolean; lat?: number; lng?: number; offeredFor?: string }) {
    // Chiudi sessioni attive precedenti
    await prisma.adorationSession.updateMany({
      where: { userId, status: 'ACTIVE' },
      data:  { status: 'INTERRUPTED', endedAt: new Date() },
    })
    const session = await prisma.adorationSession.create({
      data: { userId, status: 'ACTIVE', startedAt: new Date(), ...data },
      include: { chapel: { select: { name: true, country: { select: { nameIt: true } } } } },
    })
    await prisma.user.update({ where: { id: userId }, data: { adoringNow: true } })
    return session
  },

  async endSession(sessionId: string, userId: string, notes?: string) {
    const session = await prisma.adorationSession.findFirstOrThrow({ where: { id: sessionId, userId } })
    const endedAt    = new Date()
    const durationMin = Math.round((endedAt.getTime() - session.startedAt.getTime()) / 60000)
    const updated = await prisma.adorationSession.update({
      where: { id: sessionId },
      data:  { status: 'COMPLETED', endedAt, durationMin, notes },
    })
    await prisma.user.update({
      where: { id: userId },
      data:  { adoringNow: false, totalAdorationHours: { increment: durationMin / 60 } },
    })
    if (session.chapelId) await prisma.userVisit.create({ data: { userId, chapelId: session.chapelId, durationMin, isVirtual: session.isVirtual } })
    return updated
  },

  async getActiveSession(userId: string) {
    return prisma.adorationSession.findFirst({
      where:   { userId, status: 'ACTIVE' },
      include: { chapel: { select: { name: true } } },
    })
  },

  async getSessions(userId: string, req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const [data, total] = await Promise.all([
      prisma.adorationSession.findMany({
        where:   { userId },
        include: { chapel: { select: { name: true, city: { select: { name: true } } } } },
        orderBy: { startedAt: 'desc' },
        skip, take,
      }),
      prisma.adorationSession.count({ where: { userId } }),
    ])
    return { data, meta: buildMeta(total, page, limit) }
  },

  async getGlobalStats() {
    const [adorersNow, sessionsToday, totalHours] = await Promise.all([
      prisma.user.count({ where: { adoringNow: true } }),
      prisma.adorationSession.count({ where: { startedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
      prisma.adorationSession.aggregate({ where: { status: 'COMPLETED' }, _sum: { durationMin: true } }),
    ])
    return {
      adorersNow,
      sessionsToday,
      totalHoursAllTime: Math.round((totalHours._sum.durationMin ?? 0) / 60),
    }
  },

  async getAvailableShifts(chapelId?: string) {
    return prisma.adorationSchedule.findMany({
      where:   { ...(chapelId && { chapelId }), isAvailable: true },
      include: { chapel: { select: { id: true, name: true, address: true, city: { select: { name: true } }, country: { select: { nameIt: true, flagEmoji: true } } } } },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })
  },

  async bookShift(scheduleId: string, userId: string) {
    const shift = await prisma.adorationSchedule.findFirstOrThrow({ where: { id: scheduleId, isAvailable: true } })
    return prisma.adorationSchedule.update({
      where: { id: scheduleId },
      data:  { bookerId: userId, isAvailable: false, bookedAt: new Date() },
    })
  },

  async unbookShift(scheduleId: string, userId: string) {
    await prisma.adorationSchedule.findFirstOrThrow({ where: { id: scheduleId, bookerId: userId } })
    return prisma.adorationSchedule.update({
      where: { id: scheduleId },
      data:  { bookerId: null, isAvailable: true, bookedAt: null },
    })
  },
}
