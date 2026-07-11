import { z } from 'zod'
export const startSessionSchema = z.object({
  chapelId: z.string().optional(), isVirtual: z.boolean().default(false),
  lat: z.number().optional(), lng: z.number().optional(),
  offeredFor: z.string().max(500).optional(),
})
export const endSessionSchema    = z.object({ notes: z.string().max(2000).optional() })
export const createScheduleSchema = z.object({
  chapelId: z.string().min(1), dayOfWeek: z.number().int().min(0).max(6).optional(),
  specificDate: z.string().datetime().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/), endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isRecurring: z.boolean().default(true), notes: z.string().max(500).optional(),
})
