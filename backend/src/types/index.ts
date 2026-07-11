import type { Request } from 'express'

export type Role = 'USER' | 'PARISH_ADMIN' | 'DIOCESE_ADMIN' | 'ADMIN' | 'SUPER_ADMIN'
export type NotificationType = 'SHIFT_REMINDER' | 'NEW_INTENTION' | 'PARISH_UPDATE' | 'EVENT_REMINDER' | 'SYSTEM' | 'SPIRITUAL_CHALLENGE' | 'ADORATION_REMINDER'
export type StreamLanguage = 'IT'|'EN'|'ES'|'FR'|'PT'|'DE'|'PL'|'LA'|'AR'|'ZH'|'JA'|'KO'|'OTHER'
export type Continent = 'EUROPA'|'AMERICA_NORD'|'AMERICA_SUD'|'AFRICA'|'ASIA'|'OCEANIA'|'MEDIO_ORIENTE'
export type StreamType = 'YOUTUBE_LIVE'|'YOUTUBE_CHANNEL'|'VIMEO'|'HLS'|'RTSP'|'FACEBOOK_LIVE'|'TWITCH'|'CUSTOM_EMBED'
export type StreamStatus = 'ACTIVE'|'OFFLINE'|'SCHEDULED'|'UNKNOWN'
export type MiracleVerificationLevel = 'STORICO'|'DIOCESANO'|'PONTIFICIO'|'SCIENTIFICO'

export interface AuthPayload {
  id:    string
  email: string
  role:  Role
}

export interface AuthRequest extends Request {
  user?: AuthPayload
}

export interface GeoQuery {
  lat?: number
  lng?: number
  radiusKm?: number
}

export type SortOrder = 'asc' | 'desc'
