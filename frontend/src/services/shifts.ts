import api from './api'

export interface Shift {
  id:          string
  chapelId:    string
  dayOfWeek?:  number
  startTime:   string
  endTime:     string
  isAvailable: boolean
  isRecurring: boolean
  notes?:      string
  booker?:     { id: string; name: string }
  chapel:      { id: string; name: string; city?: { name: string } }
}

export const shiftsService = {
  async getAvailable(chapelId?: string) {
    const url = chapelId ? `/adoration/shifts?chapelId=${chapelId}` : '/adoration/shifts'
    const { data } = await api.get(url)
    return data
  },
  async book(shiftId: string) {
    const { data } = await api.post(`/adoration/shifts/${shiftId}/book`)
    return data
  },
  async unbook(shiftId: string) {
    const { data } = await api.delete(`/adoration/shifts/${shiftId}/book`)
    return data
  },
}
