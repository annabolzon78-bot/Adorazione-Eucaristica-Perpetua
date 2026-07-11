import { z } from 'zod'
export const createParishSchema = z.object({
  name: z.string().min(2).max(200).trim(), address: z.string().min(5).max(500),
  lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180),
  countryId: z.string().min(1), cityId: z.string().min(1),
  dioceseId: z.string().optional(), religiousOrderId: z.string().optional(),
  pastorName: z.string().max(200).optional(), email: z.string().email().optional(),
  phone: z.string().max(30).optional(), websiteUrl: z.string().url().optional(),
  hasAdoration: z.boolean().default(false), hasPerpetualAdoration: z.boolean().default(false),
  hasLiveStream: z.boolean().default(false), hasConfessions: z.boolean().default(false),
})
export const updateParishSchema = createParishSchema.partial()
export const parishQuerySchema  = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  lat: z.coerce.number().optional(), lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().positive().max(500).optional(),
  countryId: z.string().optional(), cityId: z.string().optional(),
  hasAdoration: z.coerce.boolean().optional(), q: z.string().max(100).optional(),
})
