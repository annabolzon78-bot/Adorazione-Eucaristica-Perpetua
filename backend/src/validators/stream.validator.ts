import { z } from 'zod'

export const createStreamSchema = z.object({
  // Relazioni
  chapelId:    z.string().optional(),
  parishId:    z.string().optional(),
  // Identificazione
  title:       z.string().min(3, 'Titolo troppo corto').max(200).trim(),
  description: z.string().max(5000).optional(),
  type:        z.enum([
    'YOUTUBE_LIVE','YOUTUBE_CHANNEL','VIMEO',
    'HLS','RTSP','FACEBOOK_LIVE','TWITCH','CUSTOM_EMBED'
  ]),
  // URL
  url:         z.string().url('URL non valido'),
  embedUrl:    z.string().url().optional(),
  embedHtml:   z.string().max(10000).optional(),
  channelId:   z.string().max(200).optional(),
  videoId:     z.string().max(200).optional(),
  hlsUrl:      z.string().url().optional(),
  rtspUrl:     z.string().optional(),
  // Metadati
  language:    z.enum(['IT','EN','ES','FR','PT','DE','PL','LA','AR','ZH','JA','KO','OTHER']).default('IT'),
  continent:   z.enum(['EUROPA','AMERICA_NORD','AMERICA_SUD','AFRICA','ASIA','OCEANIA','MEDIO_ORIENTE']),
  thumbnailUrl: z.string().url().optional(),
  tags:        z.array(z.string().max(50)).max(10).default([]),
  // Opzioni
  isDefault:   z.boolean().default(false),
  isActive:    z.boolean().default(true),
  isFeatured:  z.boolean().default(false),
  contactEmail: z.string().email().optional(),
  websiteUrl:  z.string().url().optional(),
}).refine(data => data.chapelId || data.parishId, {
  message: 'Specifica almeno una cappella o una parrocchia',
})

export const updateStreamSchema = z.object({
  title:        z.string().min(3).max(200).trim().optional(),
  description:  z.string().max(5000).optional(),
  type:         z.enum(['YOUTUBE_LIVE','YOUTUBE_CHANNEL','VIMEO','HLS','RTSP','FACEBOOK_LIVE','TWITCH','CUSTOM_EMBED']).optional(),
  url:          z.string().url().optional(),
  embedUrl:     z.string().url().optional(),
  embedHtml:    z.string().max(10000).optional(),
  channelId:    z.string().max(200).optional(),
  videoId:      z.string().max(200).optional(),
  hlsUrl:       z.string().url().optional(),
  rtspUrl:      z.string().optional(),
  language:     z.enum(['IT','EN','ES','FR','PT','DE','PL','LA','AR','ZH','JA','KO','OTHER']).optional(),
  continent:    z.enum(['EUROPA','AMERICA_NORD','AMERICA_SUD','AFRICA','ASIA','OCEANIA','MEDIO_ORIENTE']).optional(),
  thumbnailUrl: z.string().url().optional(),
  tags:         z.array(z.string().max(50)).max(10).optional(),
  isDefault:    z.boolean().optional(),
  isActive:     z.boolean().optional(),
  isFeatured:   z.boolean().optional(),
  contactEmail: z.string().email().optional(),
  websiteUrl:   z.string().url().optional(),
})

export const createScheduleSchema = z.object({
  dayOfWeek:    z.number().int().min(0).max(6).optional(),
  specificDate: z.string().datetime().optional(),
  startTime:    z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM richiesto'),
  endTime:      z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM richiesto'),
  timezone:     z.string().default('Europe/Rome'),
  notes:        z.string().max(500).optional(),
  isRecurring:  z.boolean().default(true),
})

export const streamQuerySchema = z.object({
  page:      z.coerce.number().int().positive().default(1),
  limit:     z.coerce.number().int().positive().max(100).default(20),
  type:      z.enum(['YOUTUBE_LIVE','YOUTUBE_CHANNEL','VIMEO','HLS','RTSP','FACEBOOK_LIVE','TWITCH','CUSTOM_EMBED']).optional(),
  status:    z.enum(['ACTIVE','OFFLINE','SCHEDULED','UNKNOWN']).optional(),
  language:  z.enum(['IT','EN','ES','FR','PT','DE','PL','LA','AR','ZH','JA','KO','OTHER']).optional(),
  continent: z.enum(['EUROPA','AMERICA_NORD','AMERICA_SUD','AFRICA','ASIA','OCEANIA','MEDIO_ORIENTE']).optional(),
  parishId:  z.string().optional(),
  chapelId:  z.string().optional(),
  featured:  z.coerce.boolean().optional(),
  active:    z.coerce.boolean().optional(),
  q:         z.string().max(100).optional(),
})

export const statusUpdateSchema = z.object({
  status:       z.enum(['ACTIVE','OFFLINE','SCHEDULED','UNKNOWN']),
  viewerCount:  z.number().int().nonnegative().optional(),
})
