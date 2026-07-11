import { prisma } from '../config/database'
import { getPagination, buildMeta } from '../utils/pagination'
import type { Request } from 'express'
import type { NotificationType } from '../types'

export const notificationService = {
  async getForUser(userId: string, req: Request) {
    const { skip, take, page, limit } = getPagination(req)
    const onlyUnread = req.query.unread === 'true'
    const where: any = { userId }
    if (onlyUnread) where.isRead = false
    const [data, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ])
    return { data, meta: { ...buildMeta(total, page, limit), unreadCount } }
  },

  async markRead(id: string, userId: string) {
    return prisma.notification.update({ where: { id, userId }, data: { isRead: true, readAt: new Date() } })
  },

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true, readAt: new Date() } })
  },

  async delete(id: string, userId: string) {
    return prisma.notification.delete({ where: { id, userId } })
  },

  async create(userId: string, type: NotificationType, title: string, body: string, data?: object) {
    return prisma.notification.create({ data: { userId, type, title, body, data: data ?? undefined } })
  },

  async send(userId: string, payload: { type: NotificationType; title: string; body: string; data?: object }) {
    return this.create(userId, payload.type, payload.title, payload.body, payload.data)
  },
}
