import { z } from 'zod'
export const searchSchema = z.object({
  q:     z.string().min(2).max(100).trim(),
  type:  z.enum(['all','chapel','parish','prayer','miracle','event','pilgrimage']).default('all'),
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  lat: z.coerce.number().optional(), lng: z.coerce.number().optional(),
})
