import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const STREAMS = [
  { videoId: 'hMNLrStmcTs', watchUrl: 'https://www.youtube.com/watch?v=hMNLrStmcTs' },
  { videoId: 'GlGkFWPKomU', watchUrl: 'https://www.youtube.com/watch?v=GlGkFWPKomU' },
]

export function Home() {
  const { t }    = useTranslation()
  const navigate = useNavigate()
  const [liveIdx, setLiveIdx]      = useState(0)

  const SHORTCUTS = [
    { ico:'🗺️', lbl: t('home.find_jesus'),  sub: t('home.find_jesus_sub'),  to:'/trova' },
    { ico:'🙏', lbl: t('home.pray'),         sub: t('home.pray_sub'),         to:'/prega' },
    { ico:'👥', lbl: t('home.community'),    sub: t('home.community_sub'),    to:'/comunita' },
  ]

  const current = STREAMS[liveIdx]

  return (
    <div className="pg home-page">
      <a
        href={current.watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display:'block', background:'#08050a', borderRadius:14, overflow:'hidden', marginBottom:14, textDecoration:'none' }}
      >
        <div style={{ position:'relative', aspectRatio:'16/9' }}>
          <img
            src={`https://img.youtube.com/vi/${current.videoId}/hqdefault.jpg`}
            alt={t('home.live_label')}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
          />
          <div style={{ position:'absolute', inset:0, background:'rgba(8,5,10,.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(0,0,0,.55)', border:'2px solid #e8d08a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', color:'#e8d08a' }}>
              ▶
            </div>
          </div>
        </div>
        <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
          <span className="ldot"/>
          <div style={{ fontFamily:'Cinzel,serif', fontSize:'.72rem', color:'#e8d08a' }}>{t('home.live_label')}</div>
          <div
            style={{ marginLeft:'auto', fontSize:'.62rem', color:'rgba(245,237,224,.45)', cursor:'pointer', borderBottom:'1px solid rgba(245,237,224,.2)' }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiveIdx(i => (i + 1) % STREAMS.length) }}
          >
            {t('home.chapel2')}
          </div>
        </div>
      </a>

      <div className="home-cta-grid">
        {SHORTCUTS.map(({ ico, lbl, sub, to }) => (
          <div key={to} className="hcg-btn" onClick={() => navigate(to)}>
            <span className="hcg-icon">{ico}</span>
            <span className="hcg-label">{lbl}</span>
            <span className="hcg-sub">{sub}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
