import type { Chapel } from '../../types'

interface Props {
  chapel:   Chapel | null
  onClose:  () => void
}

const TYPE_LABEL: Record<string, string> = {
  PERPETUA:    '♾ Adorazione perpetua',
  GIORNALIERA: '🌅 Adorazione giornaliera',
  SETTIMANALE: '📅 Adorazione settimanale',
  MENSILE:     '🗓 Adorazione mensile',
  OCCASIONALE: '🎯 Adorazione occasionale',
}

export function ChapelPanel({ chapel, onClose }: Props) {
  if (!chapel) return null

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${chapel.lat},${chapel.lng}&travelmode=driving`
  const osmUrl = `https://www.openstreetmap.org/?mlat=${chapel.lat}&mlon=${chapel.lng}&zoom=17`

  return (
    <div className={`chapel-panel ${chapel ? 'visible' : ''}`}>
      {/* Header */}
      <div className="cp-header">
        <div className="cp-title-row">
          <div>
            <div className="cp-name">{chapel.name}</div>
            <div className="cp-city">{chapel.city}{chapel.country ? `, ${chapel.country}` : ''}</div>
          </div>
          <button className="cp-close" onClick={onClose}>✕</button>
        </div>

        {/* Stato */}
        <div className="cp-status-row">
          {chapel.isOpenNow
            ? <span className="cp-badge cp-badge-open">● Aperta ora</span>
            : <span className="cp-badge cp-badge-closed">○ Chiusa</span>
          }
          {chapel.is24h && <span className="cp-badge cp-badge-24">🕐 24h</span>}
          {chapel.hasLiveStream && <span className="cp-badge cp-badge-live">▶ Live</span>}
        </div>
      </div>

      {/* Body */}
      <div className="cp-body">
        {/* Tipo adorazione */}
        <div className="cp-section">
          <div className="cp-label">TIPO DI ADORAZIONE</div>
          <div className="cp-type">{TYPE_LABEL[chapel.adorationType] ?? chapel.adorationType}</div>
        </div>

        {/* Indirizzo */}
        <div className="cp-section">
          <div className="cp-label">INDIRIZZO</div>
          <div className="cp-value">📍 {chapel.address}</div>
        </div>

        {/* Servizi */}
        <div className="cp-section">
          <div className="cp-label">SERVIZI</div>
          <div className="cp-services">
            {(chapel as any).hasMass        && <span className="cp-svc">✝️ Messa</span>}
            {chapel.hasConfessions           && <span className="cp-svc">🙏 Confessioni</span>}
            {chapel.hasLiveStream            && <span className="cp-svc">▶ Streaming</span>}
            {chapel.accessible               && <span className="cp-svc">♿ Accessibile</span>}
          </div>
        </div>

        {/* Live stream */}
        {chapel.hasLiveStream && (chapel as any).streamUrl && (
          <div className="cp-section">
            <div className="cp-label">DIRETTA LIVE</div>
            <a
              href={(chapel as any).streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cp-stream-link"
            >
              ▶ Guarda la diretta
            </a>
          </div>
        )}

        {/* Navigazione */}
        <div className="cp-section">
          <div className="cp-label">NAVIGAZIONE</div>
          <div className="cp-nav-buttons">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="cp-nav-btn cp-nav-google">
              <span>📍</span>
              <span>Google Maps</span>
            </a>
            <a href={osmUrl} target="_blank" rel="noopener noreferrer" className="cp-nav-btn cp-nav-osm">
              <span>🗺️</span>
              <span>OpenStreetMap</span>
            </a>
          </div>
        </div>

        {/* CTA principale */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cp-portami"
        >
          ❤️‍🔥 Portami da Gesù
        </a>
      </div>
    </div>
  )
}
