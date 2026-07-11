import type { StreamFilter } from '../../hooks/useStreams'

const TYPES = [
  { value: '',                label: 'Tutti i tipi' },
  { value: 'YOUTUBE_LIVE',    label: '▶ YouTube Live' },
  { value: 'YOUTUBE_CHANNEL', label: '▶ YouTube' },
  { value: 'VIMEO',           label: '▷ Vimeo' },
  { value: 'HLS',             label: '📡 HLS' },
  { value: 'RTSP',            label: '🔗 RTSP' },
  { value: 'FACEBOOK_LIVE',   label: '📘 Facebook' },
  { value: 'CUSTOM_EMBED',    label: '🖥 Custom' },
]
const STATUSES = [
  { value: '',          label: 'Tutti gli stati' },
  { value: 'ACTIVE',    label: '● Online ora' },
  { value: 'OFFLINE',   label: '○ Offline' },
  { value: 'SCHEDULED', label: '⏰ Programmato' },
]
const LANGUAGES = [
  { value: '', label: 'Tutte le lingue' },
  { value: 'IT', label: '🇮🇹 Italiano' },
  { value: 'EN', label: '🇬🇧 English' },
  { value: 'ES', label: '🇪🇸 Español' },
  { value: 'FR', label: '🇫🇷 Français' },
  { value: 'PT', label: '🇵🇹 Português' },
  { value: 'DE', label: '🇩🇪 Deutsch' },
  { value: 'PL', label: '🇵🇱 Polski' },
  { value: 'LA', label: '⛪ Latino' },
  { value: 'OTHER', label: '🌐 Altro' },
]
const CONTINENTS = [
  { value: '', label: 'Tutti i continenti' },
  { value: 'EUROPA',       label: '🌍 Europa' },
  { value: 'AMERICA_NORD', label: '🌎 America del Nord' },
  { value: 'AMERICA_SUD',  label: '🌎 America del Sud' },
  { value: 'AFRICA',       label: '🌍 Africa' },
  { value: 'ASIA',         label: '🌏 Asia' },
  { value: 'OCEANIA',      label: '🌏 Oceania' },
  { value: 'MEDIO_ORIENTE',label: '🌍 Medio Oriente' },
]

interface Props {
  filter:    StreamFilter
  setFilter: (f: StreamFilter) => void
  total:     number
  loading:   boolean
}

export function StreamFilters({ filter, setFilter, total, loading }: Props) {
  const set = (key: keyof StreamFilter, value: string | boolean) =>
    setFilter({ ...filter, [key]: value || undefined })

  const activeCount = Object.values(filter).filter(Boolean).length
  const reset = () => setFilter({})

  return (
    <div className="stream-filters">
      {/* Ricerca */}
      <div className="sf-search-row">
        <div className="sf-search-wrap">
          <span className="sf-search-ico">🔍</span>
          <input
            className="sf-search-input"
            type="text"
            placeholder="Cerca stream, parrocchia, tag..."
            value={filter.q ?? ''}
            onChange={e => set('q', e.target.value)}
          />
          {filter.q && <button className="sf-clear" onClick={() => set('q', '')}>✕</button>}
        </div>
        <div className="sf-result-count">
          {loading ? '...' : <><strong>{total}</strong> stream</>}
        </div>
      </div>

      {/* Filtri a cascata */}
      <div className="sf-selects-row">
        <select className="sf-select" value={filter.status ?? ''} onChange={e => set('status', e.target.value)}>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="sf-select" value={filter.type ?? ''} onChange={e => set('type', e.target.value)}>
          {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className="sf-select" value={filter.language ?? ''} onChange={e => set('language', e.target.value)}>
          {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <select className="sf-select" value={filter.continent ?? ''} onChange={e => set('continent', e.target.value)}>
          {CONTINENTS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Quick filters */}
      <div className="sf-quick-row">
        <button
          className={`sf-quick ${filter.featured ? 'on' : ''}`}
          onClick={() => setFilter({ ...filter, featured: filter.featured ? undefined : true })}
        >★ In evidenza</button>
        <button
          className={`sf-quick ${filter.status === 'ACTIVE' ? 'on' : ''}`}
          onClick={() => set('status', filter.status === 'ACTIVE' ? '' : 'ACTIVE')}
        ><span className="sfl-dot"/>Live ora</button>
        {activeCount > 0 && (
          <button className="sf-reset" onClick={reset}>
            ✕ Rimuovi filtri ({activeCount})
          </button>
        )}
      </div>
    </div>
  )
}
