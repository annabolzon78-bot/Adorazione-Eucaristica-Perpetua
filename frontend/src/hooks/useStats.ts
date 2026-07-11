import { useEffect } from 'react'
import { statsService } from '@/services/stats'
import { useStatsStore } from '@/store'

export function useStats(pollIntervalMs = 10_000) {
  const setStats = useStatsStore((s) => s.setStats)

  useEffect(() => {
    const fetch = () =>
      statsService.getGlobal().then((res) => setStats(res.data.data)).catch(() => {})

    fetch()
    const id = setInterval(fetch, pollIntervalMs)
    return () => clearInterval(id)
  }, [pollIntervalMs, setStats])
}
