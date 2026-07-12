import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Webcam reale della cappella (click2stream.com) — non YouTube.
const STREAM = { watchUrl: 'https://orokimadas-vac.click2stream.com/' }

// Foto reale del Santissimo Sacramento esposto in un ostensorio.
// Fonte: Wikimedia Commons, licenza CC-BY-SA 3.0, autore: PerfectUnityOrg.
// https://commons.wikimedia.org/wiki/File:Eucharistic_Adoration_-_Monstrance.jpg
// NOTA: come per l'audio, questo link non è verificabile con gli strumenti
// di rete di questo ambiente (dominio non raggiungibile da qui) — va
// controllato che l'immagine carichi davvero una volta pubblicato.
const HERO_PHOTO_URL = 'https://upload.wikimedia.org/wikipedia/commons/6/62/Eucharistic_Adoration_-_Monstrance.jpg'

export function Home() {
  const { t }    = useTranslation()
  const navigate = useNavigate()

  const SHORTCUTS = [
    { ico:'🗺️', lbl: t('home.find_jesus'),  sub: t('home.find_jesus_sub'),  to:'/trova' },
    { ico:'🙏', lbl: t('home.pray'),         sub: t('home.pray_sub'),         to:'/prega' },
  ]

  return (
    <div className="pg home-page">
      <a
        href={STREAM.watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display:'block', background:'#08050a', borderRadius:14, overflow:'hidden', marginBottom:14, textDecoration:'none' }}
      >
        <div style={{ position:'relative', aspectRatio:'16/9' }}>
          <img
            src={HERO_PHOTO_URL}
            alt="Il Santissimo Sacramento esposto in un ostensorio per l'Adorazione Eucaristica"
            loading="eager"
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
