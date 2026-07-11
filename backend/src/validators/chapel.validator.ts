import { z } from 'zod'
export const createChapelSchema = z.object({
  name:            z.string().min(2).max(200).trim(),
  description:     z.string().max(5000).optional(),
  address:         z.string().min(5).max(500),
  lat:             z.number().min(-90).max(90),
  lng:             z.number().min(-180).max(180),
  countryId:       z.string().min(1),
  cityId:          z.string().optional(),
  parishId:        z.string().optional(),
  adorationType:   z.enum(['PERPETUA','GIORNALIERA','SETTIMANALE','MENSILE','OCCASIONALE']),
  is24h:           z.boolean().default(false),
  hasLiveStream:   z.boolean().default(false),
  hasConfessions:  z.boolean().default(false),
  isAccessible:    z.boolean().default(false),
  seatingCapacity: z.number().int().positive().optional(),
  phone:           z.string().max(30).optional(),
  email:           z.string().email().optional(),
  websiteUrl:      z.string().url().optional(),
})
export const updateChapelSchema  = createChapelSchema.partial()
export const chapelQuerySchema   = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  lat: z.coerce.number().optional(), lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().positive().max(500).optional(),
  countryId: z.string().optional(), cityId: z.string().optional(),
  adorationType: z.enum(['PERPETUA','GIORNALIERA','SETTIMANALE','MENSILE','OCCASIONALE']).optional(),
  is24h: z.coerce.boolean().optional(), openNow: z.coerce.boolean().optional(),
  hasLiveStream: z.coerce.boolean().optional(), q: z.string().max(100).optional(),
})
