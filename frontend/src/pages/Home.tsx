import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const STREAMS = [
  'https://www.youtube.com/embed/hMNLrStmcTs?autoplay=1&rel=0&modestbranding=1',
  'https://www.youtube.com/embed/GlGkFWPKomU?autoplay=1&rel=0&modestbranding=1',
]

export function Home() {
  const { t }    = useTranslation()
  const navigate = useNavigate()
  const [liveIdx, setLiveIdx]      = useState(0)

  const SHORTCUTS = [
    { ico:'🗺️', lbl: t('home.find_jesus'),  sub: t('home.find_jesus_sub'),  to:'/trova' },
    { ico:'🙏', lbl: t('home.pray'),         sub: t('home.pray_sub'),         to:'/prega' },
    { ico:'🌍', lbl: t('home.chain'),        sub: t('home.chain_sub'),        to:'/catena' },
    { ico:'👥', lbl: t('home.community'),    sub: t('home.community_sub'),    to:'/comunita' },
  ]

  return (
    <div className="pg home-page">
      <div style={{ background:'#08050a', borderRadius:14, overflow:'hidden', marginBottom:14 }}>
        <iframe
          src={STREAMS[liveIdx]}
          style={{ width:'100%', aspectRatio:'16/9', border:'none', display:'block' }}
          allow="autoplay; fullscreen; picture-in-picture"
          title={t('home.live_label')}
        />
        <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
          <span className="ldot"/>
          <div style={{ fontFamily:'Cinzel,serif', fontSize:'.72rem', color:'#e8d08a' }}>{t('home.live_label')}</div>
          <div style={{ marginLeft:'auto', fontSize:'.62rem', color:'rgba(245,237,224,.45)', cursor:'pointer', borderBottom:'1px solid rgba(245,237,224,.2)' }}
            onClick={() => setLiveIdx(i => (i + 1) % STREAMS.length)}>
            {t('home.chapel2')}
          </div>
        </div>
      </div>

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
