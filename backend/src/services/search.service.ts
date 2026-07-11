import { prisma } from '../config/database'

export const searchService = {
  async search(q: string, type: string, skip: number, take: number) {
    const term = { contains: q, mode: 'insensitive' as const }
    const results: Record<string, unknown[]> = {}

    if (type === 'all' || type === 'chapel') {
      results.chapels = await prisma.chapel.findMany({
        where:   { deletedAt: null, OR: [{ name: term }, { address: term }] },
        select:  { id: true, name: true, address: true, adorationType: true, lat: true, lng: true, country: { select: { nameIt: true, flagEmoji: true } }, city: { select: { name: true } } },
        take: type === 'all' ? 5 : take, skip: type === 'all' ? 0 : skip,
      })
    }
    if (type === 'all' || type === 'parish') {
      results.parishes = await prisma.parish.findMany({
        where:   { OR: [{ name: term }, { address: term }] },
        select:  { id: true, name: true, address: true, hasAdoration: true, country: { select: { nameIt: true, flagEmoji: true } }, city: { select: { name: true } } },
        take: type === 'all' ? 5 : take, skip: type === 'all' ? 0 : skip,
      })
    }
    if (type === 'all' || type === 'prayer') {
      results.prayers = await prisma.prayer.findMany({
        where:   { isPublished: true, OR: [{ title: term }, { author: term }] },
        select:  { id: true, title: true, slug: true, author: true, category: { select: { name: true, icon: true } } },
        take: type === 'all' ? 5 : take, skip: type === 'all' ? 0 : skip,
      })
    }
    if (type === 'all' || type === 'miracle') {
      results.miracles = await prisma.eucharisticMiracle.findMany({
        where:   { isPublished: true, OR: [{ title: term }, { location: term }, { summary: term }] },
        select:  { id: true, title: true, slug: true, location: true, yearCa: true, verificationLevel: true },
        take: type === 'all' ? 3 : take, skip: type === 'all' ? 0 : skip,
      })
    }
    if (type === 'all' || type === 'event') {
      results.events = await prisma.event.findMany({
        where:   { isPublished: true, startDate: { gte: new Date() }, OR: [{ title: term }, { description: term }] },
        select:  { id: true, title: true, slug: true, type: true, startDate: true, address: true },
        take: type === 'all' ? 3 : take, skip: type === 'all' ? 0 : skip,
      })
    }
    if (type === 'all' || type === 'pilgrimage') {
      results.pilgrimages = await prisma.pilgrimage.findMany({
        where:   { isPublished: true, OR: [{ name: term }, { location: term }, { description: term }] },
        select:  { id: true, name: true, slug: true, type: true, location: true, country: { select: { nameIt: true, flagEmoji: true } } },
        take: type === 'all' ? 3 : take, skip: type === 'all' ? 0 : skip,
      })
    }
    return results
  },
}
