import { useState, useEffect } from 'react'
import { chapelsService } from '@/services/chapels'
import type { Chapel, MapFilter } from '@/types'

export function useChapels(filters?: MapFilter) {
  const [chapels, setChapels] = useState<Chapel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    chapelsService
      .getAll(filters)
      .then((res) => { if (!cancelled) setChapels(res.data.data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [JSON.stringify(filters)])

  return { chapels, loading, error }
}
