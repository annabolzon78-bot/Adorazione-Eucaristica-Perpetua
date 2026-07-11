import { create } from 'zustand'
import type { GlobalStats, User, Chapel, MapFilter } from '@/types'

// ── Auth Store ────────────────────────────────
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
    set({ token })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

// ── Stats Store ───────────────────────────────
interface StatsState {
  stats: GlobalStats
  adoringNow: boolean
  setStats: (stats: GlobalStats) => void
  setAdoring: (adoring: boolean) => void
}

export const useStatsStore = create<StatsState>((set) => ({
  stats: {
    adorersNow: 18_427,
    nationsNow: 132,
    totalChapels: 4_218,
    perpetualChapels: 312,
  },
  adoringNow: false,
  setStats: (stats) => set({ stats }),
  setAdoring: (adoringNow) => set({ adoringNow }),
}))

// ── Map Store ─────────────────────────────────
interface MapState {
  selectedChapel: Chapel | null
  filters: MapFilter
  setSelectedChapel: (chapel: Chapel | null) => void
  setFilters: (filters: MapFilter) => void
  resetFilters: () => void
}

export const useMapStore = create<MapState>((set) => ({
  selectedChapel: null,
  filters: {},
  setSelectedChapel: (chapel) => set({ selectedChapel: chapel }),
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
}))
