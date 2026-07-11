// ── Chapel ────────────────────────────────────
export type AdorationTypeEnum =
  | 'PERPETUA'
  | 'GIORNALIERA'
  | 'SETTIMANALE'
  | 'MENSILE'
  | 'OCCASIONALE'

export interface Chapel {
  id:             string
  name:           string
  address:        string
  city?:          string
  country?:       string
  lat:            number
  lng:            number
  adorationType:  AdorationTypeEnum
  isOpenNow:      boolean
  is24h:          boolean
  hasLiveStream:  boolean
  streamUrl?:     string
  hasConfessions: boolean
  accessible:     boolean
  hasMass?:       boolean
  phone?:         string
  email?:         string
  websiteUrl?:    string
  parish?:        { id: string; name: string }
  schedule:       Schedule[]
  createdAt:      string
  updatedAt:      string
}

export interface Schedule {
  id:          string
  chapelId:    string
  dayOfWeek:   number
  startTime:   string
  endTime:     string
  type:        'MASS' | 'ADORATION' | 'CONFESSION'
}

// ── Map Filter ────────────────────────────────
export interface MapFilter {
  type?:           AdorationTypeEnum
  openNow?:        boolean
  has24h?:         boolean
  hasLive?:        boolean
  hasConfessions?: boolean
  radiusKm?:       number
  lat?:            number
  lng?:            number
}

// ── Parish ────────────────────────────────────
export interface Parish {
  id:          string
  name:        string
  address:     string
  city?:       string
  country?:    string
  lat:         number
  lng:         number
  email?:      string
  phone?:      string
  website?:    string
  responsable?:string
  chapels:     Chapel[]
  verified:    boolean
}

// ── User ──────────────────────────────────────
export interface User {
  id:                 string
  email:              string
  name:               string
  displayName?:       string
  avatarUrl?:         string
  country?:           string
  role:               'USER' | 'PARISH_ADMIN' | 'DIOCESE_ADMIN' | 'ADMIN' | 'SUPER_ADMIN'
  adoringNow:         boolean
  totalAdorationHours: number
  currentStreak:      number
  createdAt:          string
}

// ── Stats ─────────────────────────────────────
export interface GlobalStats {
  adorersNow:      number
  nationsNow:      number
  totalChapels:    number
  perpetualChapels: number
}

// ── API Response ──────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data:    T
  message?: string
  error?:  string
}

export interface PaginatedMeta {
  total:   number
  page:    number
  limit:   number
  pages:   number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  success: boolean
  data:    T[]
  meta:    PaginatedMeta
}
