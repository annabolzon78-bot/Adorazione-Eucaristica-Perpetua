import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STREAMS = [
  'https://www.youtube.com/embed/hMNLrStmcTs?autoplay=1&rel=0&modestbranding=1',
  'https://www.youtube.com/embed/GlGkFWPKomU?autoplay=1&rel=0&modestbranding=1',
]

export function Home() {
  const navigate = useNavigate()
  const [adorersNow, setAdorersNow] = useState(18427)
  const [adoringNow, setAdoringNow] = useState(false)
  const [liveIdx, setLiveIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setAdorersNow(v => v + Math.floor(Math.sin(Date.now() / 9000) * 200 + Math.random() * 60 - 30))
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const toggleAdoring = () => {
    setAdoringNow(p => !p)
    if (!adoringNow) setAdorersNow(v => v + 1)
    else setAdorersNow(v => v - 1)
  }

  return (
    <div className="pg home-page">
      {/* Hero */}
      <div className="home-hero">
        <span className="hh-crown">❤️‍🔥</span>
        <div className="hh-title">Gesù Eucaristia ti aspetta</div>
        <div className="hh-sub">Una rete mondiale di anime davanti al Santissimo Sacramento</div>
      </div>

      {/* Live chip */}
      <div style={{ textAlign:'center', margin:'12px 0' }}>
        <span className="live-chip">
          <span className="ldot"/>
          {adorersNow.toLocaleString('it-IT')} persone stanno adorando · 132 nazioni
        </span>
      </div>

      {/* Stats */}
      <div className="home-stats">
        <div className="hs-item"><span className="hs-num">4.218</span><span className="hs-lbl">Cappelle nel mondo</span></div>
        <div className="hs-item"><span className="hs-num">312</span><span className="hs-lbl">Adorazione perpetua</span></div>
        <div className="hs-item"><span className="hs-num">{adorersNow.toLocaleString('it-IT')}</span><span className="hs-lbl">Adoratori ora</span></div>
      </div>

      {/* Sono davanti a Gesù */}
      <button
        className="home-adoration-btn"
        style={adoringNow ? { background:'linear-gradient(135deg,#166534,#15803d)' } : {}}
        onClick={toggleAdoring}
      >
        {adoringNow ? '✓ Sto adorando — grazie!' : '❤️‍🔥 Sono davanti a Gesù'}
      </button>

      {/* Quick actions */}
      <div className="home-cta-grid">
        {[
          { ico:'🗺️', lbl:'Trova Gesù', sub:'Mappa mondiale delle cappelle', to:'/trova' },
          { ico:'🙏', lbl:'Prega',       sub:'Preghiere e meditazioni',        to:'/prega' },
          { ico:'🌍', lbl:'Catena',      sub:'Il mondo in preghiera ora',       to:'/catena' },
          { ico:'👥', lbl:'Comunità',    sub:'Parrocchie e testimonianze',      to:'/comunita' },
        ].map(({ ico, lbl, sub, to }) => (
          <div key={to} className="hcg-btn" onClick={() => navigate(to)}>
            <span className="hcg-icon">{ico}</span>
            <span className="hcg-label">{lbl}</span>
            <span className="hcg-sub">{sub}</span>
          </div>
        ))}
      </div>

      {/* Live stream */}
      <div style={{ background:'#08050a', borderRadius:14, overflow:'hidden', marginBottom:14 }}>
        <iframe
          src={STREAMS[liveIdx]}
          style={{ width:'100%', aspectRatio:'16/9', border:'none', display:'block' }}
          allow="autoplay; fullscreen; picture-in-picture"
          title="Adorazione Live"
        />
        <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
          <span className="ldot"/>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:'.72rem', color:'#e8d08a' }}>St Mary's Parish · Navan, Irlanda</div>
            <span style={{ fontSize:'.65rem', color:'rgba(245,237,224,.4)' }}>Cappella dell'Adorazione · Live 24h</span>
          </div>
          <div
            style={{ marginLeft:'auto', fontSize:'.62rem', color:'rgba(245,237,224,.45)', cursor:'pointer', borderBottom:'1px solid rgba(245,237,224,.2)' }}
            onClick={() => setLiveIdx(i => (i + 1) % STREAMS.length)}
          >
            Cappella 2 →
          </div>
        </div>
      </div>

      {/* Citazione */}
      <div style={{ background:'var(--goldl)', border:'1px solid var(--goldb)', borderRadius:10, padding:'12px 14px', textAlign:'center', fontStyle:'italic', fontSize:'.83rem', color:'var(--t2)', lineHeight:1.7 }}>
        «Una parrocchia in cui si fa l'Adorazione Eucaristica è una parrocchia viva.»
        <span style={{ display:'block', fontSize:'.62rem', color:'var(--t3)', marginTop:4, fontStyle:'normal', letterSpacing:'.06em' }}>— San Giovanni Paolo II</span>
      </div>
    </div>
  )
}
