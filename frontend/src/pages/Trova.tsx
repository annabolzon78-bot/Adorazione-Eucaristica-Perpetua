import { useState, useCallback } from 'react'
import { MapView }    from '../components/map/MapView'
import { MapFilters } from '../components/map/MapFilters'
import { MapSearch }  from '../components/map/MapSearch'
import { ChapelPanel } from '../components/map/ChapelPanel'
import { useMapChapels } from '../hooks/useMapChapels'
import type { Chapel, MapFilter } from '../types'
import '../styles/map.css'

export function Trova() {
  // State filtri
  const [filter,        setFilter]        = useState<MapFilter>({})
  const [searchTerm,    setSearchTerm]    = useState('')
  const [searchCity,    setSearchCity]    = useState('')
  const [searchCountry, setSearchCountry] = useState('')
  const [locating,      setLocating]      = useState(false)

  // Cappella selezionata
  const [selectedChapel, setSelectedChapel] = useState<Chapel | null>(null)

  // Sidebar filtri
  const [showFilters, setShowFilters] = useState(false)

  // Data
  const { chapels, loading, total } = useMapChapels({
    filter, searchTerm, searchCity, searchCountry,
  })

  // Geolocalizzazione
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        // Emetti evento per centrare la mappa
        window.dispatchEvent(new CustomEvent('map:locate', {
          detail: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }))
        setLocating(false)
      },
      () => setLocating(false),
      { timeout: 8000 }
    )
  }, [])

  return (
    <div className="trova-page">

      {/* ── SEARCH + FILTER BAR ────────────────── */}
      <div className="trova-topbar">
        <MapSearch
          searchTerm={searchTerm}       setSearchTerm={setSearchTerm}
          searchCity={searchCity}       setSearchCity={setSearchCity}
          searchCountry={searchCountry} setSearchCountry={setSearchCountry}
          onLocateMe={handleLocateMe}   locating={locating}
        />
        <button
          className={`trova-filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(s => !s)}
          title="Filtri"
        >
          <span>⚙️</span>
          <span className="tft-label">Filtri</span>
          {Object.values(filter).some(Boolean) && <span className="tft-dot"/>}
        </button>
      </div>

      {/* ── FILTRI (collassabile) ──────────────── */}
      {showFilters && (
        <MapFilters
          filter={filter}
          setFilter={setFilter}
          total={total}
          loading={loading}
        />
      )}

      {/* ── MAPPA + PANEL ─────────────────────── */}
      <div className="trova-body">
        <MapView
          chapels={chapels}
          selectedChapel={selectedChapel}
          onSelectChapel={setSelectedChapel}
          loading={loading}
        />

        {/* Panel dettaglio cappella */}
        <ChapelPanel
          chapel={selectedChapel}
          onClose={() => setSelectedChapel(null)}
        />
      </div>

      {/* ── COUNTER FLOATING ──────────────────── */}
      <div className="trova-counter">
        <span className="tc-n">{loading ? '...' : total}</span>
        <span className="tc-l">cappelle</span>
      </div>
    </div>
  )
}
