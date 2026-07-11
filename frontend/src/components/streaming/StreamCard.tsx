import type { StreamData } from '../../hooks/useStreams'

const TYPE_ICON: Record<string, string>  = {
  YOUTUBE_LIVE: '▶', YOUTUBE_CHANNEL: '▶', VIMEO: '▷',
  HLS: '📡', RTSP: '🔗', FACEBOOK_LIVE: '📘', TWITCH: '🎮', CUSTOM_EMBED: '🖥',
}
const TYPE_LABEL: Record<string, string> = {
  YOUTUBE_LIVE: 'YouTube Live', YOUTUBE_CHANNEL: 'YouTube', VIMEO: 'Vimeo',
  HLS: 'HLS Stream', RTSP: 'RTSP', FACEBOOK_LIVE: 'Facebook Live', TWITCH: 'Twitch', CUSTOM_EMBED: 'Embed',
}
const LANG_LABEL: Record<string, string> = {
  IT:'🇮🇹 IT', EN:'🇬🇧 EN', ES:'🇪🇸 ES', FR:'🇫🇷 FR',
  PT:'🇵🇹 PT', DE:'🇩🇪 DE', PL:'🇵🇱 PL', LA:'LA',
  AR:'🇸🇦 AR', ZH:'🇨🇳 ZH', JA:'🇯🇵 JA', KO:'🇰🇷 KO', OTHER:'🌐',
}
const CONT_LABEL: Record<string, string> = {
  EUROPA:'🌍 Europa', AMERICA_NORD:'🌎 N. America', AMERICA_SUD:'🌎 S. America',
  AFRICA:'🌍 Africa', ASIA:'🌏 Asia', OCEANIA:'🌏 Oceania', MEDIO_ORIENTE:'🌍 M. Oriente',
}

const DAYS = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab']

interface Props {
  stream:   StreamData
  onClick:  (stream: StreamData) => void
  selected: boolean
}

export function StreamCard({ stream, onClick, selected }: Props) {
  const location = stream.parish ?? stream.chapel
  const country  = location?.country

  return (
    <div
      className={`stream-card ${selected ? 'selected' : ''} ${stream.status === 'ACTIVE' ? 'live' : ''}`}
      onClick={() => onClick(stream)}
      role="button"
      tabIndex={0}
    >
      {/* Thumbnail */}
      <div className="sc-thumb">
        {stream.thumbnailUrl
          ? <img src={stream.thumbnailUrl} alt={stream.title} className="sc-thumb-img" />
          : <div className="sc-thumb-placeholder">
              <span>{TYPE_ICON[stream.type] ?? '▶'}</span>
            </div>
        }
        {/* Status badge */}
        <div className={`sc-status-badge sc-status-${stream.status.toLowerCase()}`}>
          {stream.status === 'ACTIVE'    && <><span className="sc-live-dot"/>LIVE</>}
          {stream.status === 'OFFLINE'   && 'OFFLINE'}
          {stream.status === 'SCHEDULED' && 'PROGRAMMATO'}
          {stream.status === 'UNKNOWN'   && '?'}
        </div>
        {/* Featured */}
        {stream.isFeatured && <div className="sc-featured-badge">★</div>}
      </div>

      {/* Info */}
      <div className="sc-body">
        <div className="sc-title">{stream.title}</div>

        {/* Location */}
        {location && (
          <div className="sc-location">
            {country?.flagEmoji && <span>{country.flagEmoji}</span>}
            <span>{location.name}</span>
            {location.city && <span className="sc-city">· {location.city.name}</span>}
          </div>
        )}

        {/* Tags row */}
        <div className="sc-tags-row">
          <span className="sc-tag sc-tag-type">{TYPE_LABEL[stream.type]}</span>
          <span className="sc-tag">{LANG_LABEL[stream.language]}</span>
          <span className="sc-tag">{CONT_LABEL[stream.continent]}</span>
        </div>

        {/* Schedule summary */}
        {stream.schedules.length > 0 && (
          <div className="sc-schedule">
            {stream.schedules.slice(0, 2).map(s => (
              <span key={s.id} className="sc-sched-item">
                {s.dayOfWeek !== undefined && s.dayOfWeek !== null
                  ? `${DAYS[s.dayOfWeek]} ${s.startTime}–${s.endTime}`
                  : `${s.startTime}–${s.endTime}`
                }
              </span>
            ))}
            {stream.schedules.length > 2 && (
              <span className="sc-sched-more">+{stream.schedules.length - 2}</span>
            )}
          </div>
        )}

        {/* Metrics */}
        <div className="sc-metrics">
          {stream.viewerCount != null && stream.status === 'ACTIVE' && (
            <span className="sc-metric sc-metric-viewers">👁 {stream.viewerCount.toLocaleString('it-IT')}</span>
          )}
          <span className="sc-metric">📊 {stream.totalViews.toLocaleString('it-IT')} views</span>
        </div>
      </div>
    </div>
  )
}
