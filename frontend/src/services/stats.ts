import api from './api'
import type { GlobalStats } from '@/types'

export const statsService = {
  getGlobal: () => api.get<{ data: GlobalStats }>('/stats'),
  markAdoring: (isAdoring: boolean) =>
    api.post('/stats/adoring', { isAdoring }),
}
