import api from './api'
import type { Chapel, MapFilter, PaginatedResponse } from '@/types'

export const chapelsService = {
  getAll: (filters?: MapFilter) =>
    api.get<PaginatedResponse<Chapel>>('/chapels', { params: filters }),

  getById: (id: string) =>
    api.get<{ data: Chapel }>(`/chapels/${id}`),

  getNearby: (lat: number, lng: number, radiusKm = 10) =>
    api.get<PaginatedResponse<Chapel>>('/chapels/nearby', {
      params: { lat, lng, radiusKm },
    }),

  getOpenNow: () =>
    api.get<PaginatedResponse<Chapel>>('/chapels/open-now'),
}
