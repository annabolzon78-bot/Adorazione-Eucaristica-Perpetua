import { useState } from 'react'

const CHALLENGES = [
  { ico:'⏱️', name:'10 minuti oggi', desc:'Inizia con soli 10 minuti davanti a Gesù', current:10, total:10 },
  { ico:'🕐', name:'Un\'ora questa settimana', desc:'Dedica un\'ora completa di adorazione', current:39, total:60 },
  { ico:'🌙', name:'Un\'ora notturna', desc:'Veglia con Gesù di notte almeno una volta', current:0, total:1 },
  { ico:'⛪', name:'10 chiese diverse', desc:'Adora in 10 chiese o cappelle diverse', current:3, total:10 },
  { ico:'🏆', name:'100 ore nell\'anno', desc:'Un\'ora di adorazione alla settimana tutto l\'anno', current:39, total:100 },
]

const TESTIMONIALS = [
  { text:'«Ho iniziato a fare un\'ora di adorazione alla settimana. Dopo tre mesi, non riuscivo più a farne a meno. L\'adorazione ha cambiato il mio matrimonio, il mio rapporto con i figli, la mia pace interiore.»', name:'Francesca M.', loc:'Milano, Italia' },
  { text:'«Sono un medico. Lavoro in ospedale. Ho iniziato a fermarmi in cappella prima dei turni di notte. Adesso non mi manca mai. Gesù mi aspetta ogni volta.»', name:'Dr. António S.', loc:'Lisbona, Portogallo' },
]

const LANGS = ['🇮🇹 Italiano','🇬🇧 English','🇪🇸 Español','🇫🇷 Français','🇵🇹 Português','🇩🇪 Deutsch','🇵🇱 Polski','🇸🇦 العربية','🇨🇳 中文','🇯🇵 日本語','🇰🇷 한국어']

export function Comunita() {
  const [lang, setLang] = useState('🇮🇹 Italiano')

  return (
    <div className="pg">
      {/* Sfide spirituali */}
      <div style={{ fontFamily:'Cinzel,serif', fontSize:'.68rem', letterSpacing:'.14em', color:'var(--red)', marginBottom:10 }}>SFIDE SPIRITUALI — IL TUO CAMMINO</div>
      <div style={{ background:'var(--redl)', border:'1px solid var(--redb)', borderRadius:10, padding:'12px 14px', marginBottom:12, fontSize:'.8rem', color:'var(--t2)', lineHeight:1.6 }}>
        ❤️‍🔥 Non punteggi, ma un cammino. Ogni sfida ti aiuta a costruire una vita di adorazione costante.
      </div>

      {CHALLENGES.map((c, i) => {
        const pct = Math.min(100, Math.round(c.current / c.total * 100))
        const done = pct >= 100
        return (
          <div key={i} style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:12, padding:14, marginBottom:9, boxShadow:'0 1px 6px rgba(139,26,42,.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'var(--redl)', border:'1px solid var(--redb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{c.ico}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:'.88rem', color:'var(--text)', marginBottom:2 }}>{c.name}</div>
                <div style={{ fontSize:'.72rem', color:'var(--t3)' }}>{c.desc}</div>
              </div>
            </div>
            <div style={{ height:6, background:'var(--br)', borderRadius:3, overflow:'hidden', marginBottom:6 }}>
              <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--red),#b02235)', borderRadius:3, transition:'width .6s ease' }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.68rem', color:'var(--t3)' }}>
              {done ? <span style={{ color:'var(--red)', fontWeight:700 }}>✓ Completata!</span> : <span>{c.current}/{c.total}{i===1?' min':i===2?' notti':i===3?' chiese':' ore'}</span>}
              <span>{done ? '' : 'In corso'}</span>
            </div>
          </div>
        )
      })}

      {/* Testimonianze */}
      <div style={{ fontFamily:'Cinzel,serif', fontSize:'.68rem', letterSpacing:'.14em', color:'var(--red)', marginTop:6, marginBottom:10 }}>TESTIMONIANZE</div>
      {TESTIMONIALS.map((t, i) => (
        <div key={i} style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:12, padding:14, marginBottom:9 }}>
          <div style={{ fontSize:'.9rem', fontStyle:'italic', color:'var(--t2)', lineHeight:1.7, marginBottom:8 }}>{t.text}</div>
          <div style={{ fontSize:'.75rem', fontWeight:600, color:'var(--red)' }}>{t.name}</div>
          <div style={{ fontSize:'.7rem', color:'var(--t3)' }}>{t.loc}</div>
        </div>
      ))}

      {/* Parrocchie */}
      <div style={{ fontFamily:'Cinzel,serif', fontSize:'.68rem', letterSpacing:'.14em', color:'var(--red)', marginBottom:10 }}>PARROCCHIE SULLA PIATTAFORMA</div>
      <div style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:12, overflow:'hidden', marginBottom:9 }}>
        <div style={{ background:'var(--redl)', borderBottom:'1px solid var(--redb)', padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:'1.4rem' }}>⛪</span>
          <div>
            <div style={{ fontWeight:700, fontSize:'.88rem', color:'var(--red)' }}>St Mary's Parish</div>
            <div style={{ fontSize:'.7rem', color:'var(--t2)' }}>Navan, Co. Meath — Irlanda 🇮🇪</div>
          </div>
        </div>
        <div style={{ padding:'12px 14px' }}>
          {[['Adorazione','Perpetua 24h/7gg'],['Streaming','✓ Live su YouTube'],['Turni scoperti','3 disponibili'],['Adoratori registrati','247']].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'.78rem', padding:'4px 0', borderBottom:'1px solid var(--bg)', color:'var(--t2)' }}>
              <span style={{ fontSize:'.72rem', color:'var(--t3)' }}>{k}</span><span>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <button style={{ width:'100%', padding:12, background:'var(--red)', color:'#fff', border:'none', borderRadius:10, fontFamily:'Cinzel,serif', fontSize:'.8rem', letterSpacing:'.08em', cursor:'pointer', boxShadow:'0 4px 16px rgba(139,26,42,.28)', marginBottom:14 }}>
        + Registra la mia parrocchia
      </button>

      {/* Lingue */}
      <div style={{ fontFamily:'Cinzel,serif', fontSize:'.68rem', letterSpacing:'.14em', color:'var(--red)', marginBottom:10 }}>LINGUE DISPONIBILI</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:14 }}>
        {LANGS.map(l => (
          <div key={l} onClick={() => setLang(l)}
            style={{ padding:'5px 12px', background:lang===l?'var(--red)':'var(--white)', border:`1px solid ${lang===l?'var(--red)':'var(--br)'}`, borderRadius:20, fontSize:'.72rem', color:lang===l?'#fff':'var(--t2)', cursor:'pointer', transition:'all .2s' }}>
            {l}
          </div>
        ))}
      </div>

      <div style={{ background:'var(--goldl)', border:'1px solid var(--goldb)', borderRadius:10, padding:'12px 14px', textAlign:'center', fontStyle:'italic', fontSize:'.83rem', color:'var(--t2)', lineHeight:1.7 }}>
        «Se il progetto crescesse molto, potrebbe diventare il riferimento mondiale<br/>per trovare un luogo di Adorazione Eucaristica.»
        <span style={{ display:'block', fontSize:'.62rem', color:'var(--t3)', marginTop:4, fontStyle:'normal' }}>— Visione di Adorazione Viva</span>
      </div>
    </div>
  )
}
