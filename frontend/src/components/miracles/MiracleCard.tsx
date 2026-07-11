import type { Miracle } from '../../hooks/useMiracles'

const LEVEL_COLOR: Record<string, string> = {
  SCIENTIFICO: '#166534', PONTIFICIO: '#8b1a2a', DIOCESANO: '#1e40af', STORICO: '#92400e',
}
const LEVEL_LABEL: Record<string, string> = {
  SCIENTIFICO: '🔬 Scientifico', PONTIFICIO: '✝️ Pontificio', DIOCESANO: '⛪ Diocesano', STORICO: '📜 Storico',
}
const CONT_FLAG: Record<string, string> = {
  EUROPA:'🌍', AMERICA_NORD:'🌎', AMERICA_SUD:'🌎', AFRICA:'🌍', ASIA:'🌏', OCEANIA:'🌏', MEDIO_ORIENTE:'🌍',
}

interface Props { miracle: Miracle; onClick: (m: Miracle) => void; selected: boolean }

export function MiracleCard({ miracle: m, onClick, selected }: Props) {
  const lc  = LEVEL_COLOR[m.verificationLevel] ?? '#6b7280'
  const ll  = LEVEL_LABEL[m.verificationLevel] ?? m.verificationLevel

  return (
    <div className={`mc-card ${selected ? 'mc-selected' : ''}`} onClick={() => onClick(m)} role="button" tabIndex={0}>
      {/* Thumbnail */}
      <div className="mc-card-thumb">
        {m.imageUrl || m.thumbnailUrl
          ? <img src={m.thumbnailUrl ?? m.imageUrl} alt={m.title} className="mc-card-img" />
          : <div className="mc-card-placeholder"><span>❤️‍🔥</span></div>
        }
        {/* Level badge */}
        <div className="mc-card-badge" style={{ background: lc }}>{ll}</div>
        {/* Visitable */}
        {m.isVisitableToday && <div className="mc-card-visit">📍 Visitabile</div>}
      </div>

      {/* Body */}
      <div className="mc-card-body">
        <div className="mc-card-title">{m.title}</div>
        <div className="mc-card-loc">
          {m.country?.flagEmoji && <span>{m.country.flagEmoji}</span>}
          <span>{m.location}</span>
          {m.state && <span className="mc-card-state">· {m.state}</span>}
          <span className="mc-card-cont">{CONT_FLAG[m.continent]}</span>
        </div>
        <div className="mc-card-year">{m.yearCa ?? (m.year ? `${m.year}` : '—')}</div>
        <div className="mc-card-summary">{m.summary.slice(0, 120)}…</div>

        {/* Media count */}
        {m._count && (
          <div className="mc-card-counts">
            {m._count.images    > 0 && <span>🖼 {m._count.images}</span>}
            {m._count.videos    > 0 && <span>▶ {m._count.videos}</span>}
            {m._count.documents > 0 && <span>📄 {m._count.documents}</span>}
            {m._count.bibliography > 0 && <span>📚 {m._count.bibliography}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
