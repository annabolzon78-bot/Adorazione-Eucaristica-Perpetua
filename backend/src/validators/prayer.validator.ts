import { z } from 'zod'
export const prayerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  categoryId: z.string().optional(), language: z.string().max(5).optional(),
  q: z.string().max(100).optional(),
})
export const createPrayerRequestSchema = z.object({
  text: z.string().min(5).max(2000).trim(),
  authorName: z.string().max(100).optional(),
  isAnonymous: z.boolean().default(false),
  category: z.string().max(50).optional(),
  isPublic: z.boolean().default(true),
})
