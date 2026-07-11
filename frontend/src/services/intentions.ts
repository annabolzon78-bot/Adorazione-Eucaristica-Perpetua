import api from './api'

export interface Intention {
  id:         string
  text:       string
  authorName?:string
  isAnonymous:boolean
  prayerCount:number
  category?:  string
  isPublic:   boolean
  createdAt:  string
}

export const intentionsService = {
  async getAll(page = 1) {
    const { data } = await api.get(`/prayers/requests?page=${page}&limit=20`)
    return data
  },
  async create(payload: { text: string; authorName?: string; isAnonymous: boolean; isPublic: boolean }) {
    const { data } = await api.post('/prayers/requests', payload)
    return data
  },
  async pray(id: string) {
    const { data } = await api.post(`/prayers/requests/${id}/pray`)
    return data
  },
}
