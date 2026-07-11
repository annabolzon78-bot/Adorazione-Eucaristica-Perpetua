import { useState } from 'react'
import type { StreamData }  from '../../hooks/useStreams'
import { createStream, updateStreamStatus } from '../../hooks/useStreams'

const TYPE_OPTS = [
  { value:'YOUTUBE_LIVE',    label:'YouTube Live' },
  { value:'YOUTUBE_CHANNEL', label:'YouTube (canale)' },
  { value:'VIMEO',           label:'Vimeo' },
  { value:'HLS',             label:'HLS (.m3u8)' },
  { value:'RTSP',            label:'RTSP' },
  { value:'FACEBOOK_LIVE',   label:'Facebook Live' },
  { value:'TWITCH',          label:'Twitch' },
  { value:'CUSTOM_EMBED',    label:'Embed personalizzato' },
]
const LANG_OPTS = [
  { value:'IT',label:'🇮🇹 Italiano' },{ value:'EN',label:'🇬🇧 English' },
  { value:'ES',label:'🇪🇸 Español' },{ value:'FR',label:'🇫🇷 Français' },
  { value:'PT',label:'🇵🇹 Português' },{ value:'DE',label:'🇩🇪 Deutsch' },
  { value:'PL',label:'🇵🇱 Polski' },{ value:'LA',label:'⛪ Latino' },
  { value:'AR',label:'🇸🇦 Arabo' },{ value:'ZH',label:'🇨🇳 Cinese' },
  { value:'OTHER',label:'🌐 Altro' },
]
const CONT_OPTS = [
  { value:'EUROPA',label:'🌍 Europa' },
  { value:'AMERICA_NORD',label:'🌎 America del Nord' },
  { value:'AMERICA_SUD',label:'🌎 America del Sud' },
  { value:'AFRICA',label:'🌍 Africa' },
  { value:'ASIA',label:'🌏 Asia' },
  { value:'OCEANIA',label:'🌏 Oceania' },
  { value:'MEDIO_ORIENTE',label:'🌍 Medio Oriente' },
]

interface Props {
  streams:    StreamData[]
  parishId:   string
  onRefetch:  () => void
}

interface StreamForm {
  title:        string
  description:  string
  type:         string
  url:          string
  embedHtml:    string
  hlsUrl:       string
  language:     string
  continent:    string
  tags:         string
  isDefault:    boolean
  contactEmail: string
  websiteUrl:   string
}

const EMPTY_FORM: StreamForm = {
  title:'', description:'', type:'YOUTUBE_LIVE', url:'',
  embedHtml:'', hlsUrl:'', language:'IT', continent:'EUROPA',
  tags:'', isDefault:false, contactEmail:'', websiteUrl:'',
}

export function ParishStreamPanel({ streams, parishId, onRefetch }: Props) {
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState<StreamForm>(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [message, setMessage]     = useState<{ type:'ok'|'err'; text:string } | null>(null)

  const f = (key: keyof StreamForm, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    if (!form.title || !form.url || !form.type) {
      setMessage({ type:'err', text:'Titolo, URL e tipo sono obbligatori' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        parishId,
        title:        form.title,
        description:  form.description || undefined,
        type:         form.type,
        url:          form.url,
        embedHtml:    form.type === 'CUSTOM_EMBED' ? form.embedHtml : undefined,
        hlsUrl:       form.type === 'HLS' ? form.hlsUrl || form.url : undefined,
        language:     form.language,
        continent:    form.continent,
        tags:         form.tags.split(',').map(t => t.trim()).filter(Boolean),
        isDefault:    form.isDefault,
        contactEmail: form.contactEmail || undefined,
        websiteUrl:   form.websiteUrl || undefined,
      }
      const res = await createStream(payload)
      if (res.success) {
        setMessage({ type:'ok', text:'Stream registrato con successo!' })
        setForm(EMPTY_FORM)
        setShowForm(false)
        onRefetch()
      } else {
        setMessage({ type:'err', text: res.error ?? 'Errore nel salvataggio' })
      }
    } catch (err: any) {
      setMessage({ type:'err', text: err.message ?? 'Errore di rete' })
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (stream: StreamData) => {
    const next = stream.status === 'ACTIVE' ? 'OFFLINE' : 'ACTIVE'
    await updateStreamStatus(stream.id, next)
    onRefetch()
  }

  return (
    <div className="psp-wrap">
      {/* Header */}
      <div className="psp-header">
        <div>
          <div className="psp-title">I tuoi stream</div>
          <div className="psp-sub">{streams.length} stream registrati</div>
        </div>
        <button className="psp-add-btn" onClick={() => { setShowForm(s => !s); setMessage(null) }}>
          {showForm ? '✕ Annulla' : '+ Aggiungi stream'}
        </button>
      </div>

      {/* Feedback */}
      {message && (
        <div className={`psp-msg psp-msg-${message.type}`}>
          {message.type === 'ok' ? '✓' : '⚠'} {message.text}
        </div>
      )}

      {/* Form registrazione */}
      {showForm && (
        <div className="psp-form">
          <div className="psp-form-title">Registra nuovo stream</div>

          <div className="pf-row">
            <div className="pf-field pf-field-lg">
              <label className="pf-label">TITOLO *</label>
              <input className="pf-input" placeholder="es. Adorazione domenicale" value={form.title} onChange={e => f('title', e.target.value)} />
            </div>
            <div className="pf-field">
              <label className="pf-label">TIPO STREAM *</label>
              <select className="pf-select" value={form.type} onChange={e => f('type', e.target.value)}>
                {TYPE_OPTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-label">URL STREAM *
              <span className="pf-hint">
                {form.type === 'YOUTUBE_LIVE'    && ' — es. https://www.youtube.com/live/VIDEO_ID'}
                {form.type === 'VIMEO'           && ' — es. https://vimeo.com/123456789'}
                {form.type === 'HLS'             && ' — es. https://example.com/stream.m3u8'}
                {form.type === 'RTSP'            && ' — es. rtsp://camera.example.com/stream'}
                {form.type === 'FACEBOOK_LIVE'   && ' — es. https://www.facebook.com/parrocchia/videos/123'}
                {form.type === 'CUSTOM_EMBED'    && ' — URL originale per riferimento'}
              </span>
            </label>
            <input className="pf-input" placeholder="https://..." value={form.url} onChange={e => f('url', e.target.value)} />
          </div>

          {form.type === 'HLS' && (
            <div className="pf-field">
              <label className="pf-label">URL HLS DIRETTO (.m3u8) — se diverso dall'URL sopra</label>
              <input className="pf-input" placeholder="https://cdn.example.com/stream.m3u8" value={form.hlsUrl} onChange={e => f('hlsUrl', e.target.value)} />
            </div>
          )}

          {form.type === 'CUSTOM_EMBED' && (
            <div className="pf-field">
              <label className="pf-label">CODICE HTML EMBED</label>
              <textarea className="pf-textarea" placeholder='<iframe src="..." width="100%" height="360" ...></iframe>' value={form.embedHtml} onChange={e => f('embedHtml', e.target.value)} rows={4} />
            </div>
          )}

          <div className="pf-field">
            <label className="pf-label">DESCRIZIONE</label>
            <textarea className="pf-textarea" placeholder="Breve descrizione dello streaming..." value={form.description} onChange={e => f('description', e.target.value)} rows={2} />
          </div>

          <div className="pf-row">
            <div className="pf-field">
              <label className="pf-label">LINGUA</label>
              <select className="pf-select" value={form.language} onChange={e => f('language', e.target.value)}>
                {LANG_OPTS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div className="pf-field">
              <label className="pf-label">CONTINENTE</label>
              <select className="pf-select" value={form.continent} onChange={e => f('continent', e.target.value)}>
                {CONT_OPTS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-label">TAG (separati da virgola)</label>
            <input className="pf-input" placeholder="adorazione, perpetua, italia" value={form.tags} onChange={e => f('tags', e.target.value)} />
          </div>

          <div className="pf-row pf-row-sm">
            <div className="pf-field">
              <label className="pf-label">EMAIL DI CONTATTO</label>
              <input className="pf-input" type="email" placeholder="parroco@parrocchia.it" value={form.contactEmail} onChange={e => f('contactEmail', e.target.value)} />
            </div>
            <div className="pf-field">
              <label className="pf-label">SITO WEB</label>
              <input className="pf-input" placeholder="https://..." value={form.websiteUrl} onChange={e => f('websiteUrl', e.target.value)} />
            </div>
          </div>

          <label className="pf-checkbox-row">
            <input type="checkbox" checked={form.isDefault} onChange={e => f('isDefault', e.target.checked)} />
            <span>Imposta come stream principale della parrocchia</span>
          </label>

          <div className="pf-actions">
            <button className="pf-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvataggio...' : '✓ Registra stream'}
            </button>
            <button className="pf-cancel-btn" onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}>Annulla</button>
          </div>
        </div>
      )}

      {/* Lista stream esistenti */}
      <div className="psp-list">
        {streams.length === 0 ? (
          <div className="psp-empty">
            <div className="psp-empty-ico">📡</div>
            <div>Nessuno stream registrato.<br/><span style={{color:'var(--t3)'}}>Aggiungi il tuo primo stream.</span></div>
          </div>
        ) : (
          streams.map(stream => (
            <div key={stream.id} className="psp-item">
              <div className="psp-item-info">
                <div className="psp-item-title">{stream.title}</div>
                <div className="psp-item-meta">
                  {stream.type} · {stream.language} · {stream.continent.replace('_', ' ')}
                </div>
                {stream.schedules.length > 0 && (
                  <div className="psp-item-sched">
                    ⏰ {stream.schedules.length} orari configurati
                  </div>
                )}
              </div>
              <div className="psp-item-actions">
                <span className={`psp-status psp-status-${stream.status.toLowerCase()}`}>
                  {stream.status === 'ACTIVE' ? '● LIVE' : stream.status === 'OFFLINE' ? '○ OFF' : '⏰ SCHED'}
                </span>
                <button
                  className="psp-toggle-btn"
                  onClick={() => toggleStatus(stream)}
                  title={stream.status === 'ACTIVE' ? 'Metti offline' : 'Metti online'}
                >
                  {stream.status === 'ACTIVE' ? '⏸' : '▶'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
