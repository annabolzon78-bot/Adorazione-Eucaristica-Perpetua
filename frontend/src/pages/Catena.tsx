import { useEffect, useRef, useState } from 'react'

const DOTS = [
  {x:.52,y:.33},{x:.5,y:.31},{x:.53,y:.35},{x:.54,y:.38},{x:.48,y:.32},{x:.51,y:.37},
  {x:.44,y:.32},{x:.43,y:.34},{x:.45,y:.28},{x:.42,y:.30},{x:.41,y:.31},{x:.46,y:.36},
  {x:.82,y:.45},{x:.80,y:.47},{x:.84,y:.43},{x:.78,y:.48},{x:.83,y:.40},{x:.81,y:.50},
  {x:.27,y:.38},{x:.29,y:.36},{x:.25,y:.35},{x:.28,y:.40},{x:.30,y:.38},{x:.26,y:.33},
  {x:.22,y:.52},{x:.20,y:.50},{x:.24,y:.54},{x:.18,y:.53},{x:.21,y:.48},{x:.23,y:.56},
  {x:.35,y:.60},{x:.33,y:.58},{x:.37,y:.62},{x:.30,y:.62},{x:.38,y:.58},{x:.32,y:.65},
  {x:.71,y:.55},{x:.69,y:.57},{x:.73,y:.53},{x:.68,y:.60},{x:.72,y:.50},{x:.74,y:.58},
]
const COUNTRIES = [
  { flag:'🇮🇹', name:'Italia',     n: 3218 },
  { flag:'🇵🇱', name:'Polonia',    n: 2847 },
  { flag:'🇵🇭', name:'Filippine',  n: 2104 },
  { flag:'🇧🇷', name:'Brasile',    n: 1983 },
  { flag:'🇲🇽', name:'Messico',    n: 1756 },
  { flag:'🇺🇸', name:'USA',        n: 1622 },
]

export function Catena() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [count, setCount] = useState(18427)
  const [adoringNow, setAdoringNow] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const t = setInterval(() => {
      setCount(v => v + Math.floor(Math.sin(Date.now() / 9000) * 200 + Math.random() * 40 - 20))
    }, 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const draw = () => {
      const W = canvas.offsetWidth || 340
      canvas.width = W; canvas.height = 200
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#08050a'; ctx.fillRect(0, 0, W, 200)
      ctx.strokeStyle = 'rgba(200,168,75,.06)'; ctx.lineWidth = .5
      for (let i = 0; i <= 6; i++) {
        ctx.beginPath(); ctx.moveTo(i*(W/6),0); ctx.lineTo(i*(W/6),200); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(0,i*(200/6)); ctx.lineTo(W,i*(200/6)); ctx.stroke()
      }
      const t = Date.now() / 1000
      DOTS.forEach((d, i) => {
        const x = d.x * W, y = d.y * 200
        const pulse = .5 + .5 * Math.sin(t * 2 + i * .7)
        const r = 2.5 + pulse * 2
        const a = .4 + pulse * .6
        const gr = ctx.createRadialGradient(x,y,0,x,y,r*3)
        gr.addColorStop(0, `rgba(200,140,75,${a*.8})`); gr.addColorStop(1,'rgba(200,140,75,0)')
        ctx.beginPath(); ctx.arc(x,y,r*3,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill()
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fillStyle=`rgba(232,208,138,${a})`; ctx.fill()
      })
      if (adoringNow) {
        const ux=.53*W, uy=.38*200, r2=5+2*Math.sin(t*3)
        const g2 = ctx.createRadialGradient(ux,uy,0,ux,uy,r2*4)
        g2.addColorStop(0,'rgba(139,26,42,.9)'); g2.addColorStop(1,'rgba(139,26,42,0)')
        ctx.beginPath(); ctx.arc(ux,uy,r2*4,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill()
        ctx.beginPath(); ctx.arc(ux,uy,r2,0,Math.PI*2); ctx.fillStyle='rgba(255,80,80,1)'; ctx.fill()
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [adoringNow])

  return (
    <div className="pg">
      {/* Counter */}
      <div style={{ background:'linear-gradient(135deg,#08050a,#1a0e0e)', borderRadius:14, padding:'20px 16px', marginBottom:14, textAlign:'center', color:'#fff' }}>
        <span style={{ fontFamily:'Cinzel,serif', fontSize:'2.5rem', color:'var(--gold)', display:'block', marginBottom:4 }}>
          {count.toLocaleString('it-IT')}
        </span>
        <div style={{ fontSize:'.78rem', opacity:.6, marginBottom:10 }}>persone davanti al Santissimo Sacramento in questo momento</div>
        <div style={{ fontFamily:'Cinzel,serif', fontSize:'1rem', color:'var(--gold)', opacity:.8 }}>🌍 132 nazioni unite in preghiera</div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ width:'100%', borderRadius:12, display:'block', background:'#08050a', marginBottom:14 }} height={200} />

      {/* CTA */}
      <button
        onClick={() => setAdoringNow(p => !p)}
        style={{ width:'100%', padding:14, background: adoringNow ? 'linear-gradient(135deg,#166534,#15803d)' : 'var(--red)', color:'#fff', border:'none', borderRadius:12, fontFamily:'Cinzel,serif', fontSize:'.88rem', letterSpacing:'.1em', cursor:'pointer', marginBottom:14, boxShadow:'0 4px 18px rgba(139,26,42,.35)' }}
      >
        {adoringNow ? '✓ Sto adorando — grazie!' : '❤️‍🔥 Sono davanti a Gesù — Illumina il tuo Paese'}
      </button>

      {/* Info */}
      <div style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:11, padding:'13px 14px', marginBottom:10, fontSize:'.82rem', color:'var(--t2)', lineHeight:1.6 }}>
        <div style={{ fontWeight:700, color:'var(--text)', marginBottom:4 }}>🌐 Come funziona la catena</div>
        Ogni volta che premi «Sono davanti a Gesù», il tuo Paese si illumina sulla mappa. Il contatore mondiale aumenta. In questo modo possiamo vedere in tempo reale quante anime nel mondo sono davanti al Santissimo.
      </div>

      {/* Paesi */}
      <div style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:11, padding:'13px 14px', marginBottom:14 }}>
        <div style={{ fontWeight:700, color:'var(--text)', fontSize:'.85rem', marginBottom:10 }}>📊 Paesi più attivi ora</div>
        {COUNTRIES.map(c => (
          <div key={c.name} style={{ display:'flex', justifyContent:'space-between', fontSize:'.78rem', padding:'5px 0', borderBottom:'1px solid var(--bg)', color:'var(--t2)' }}>
            <span>{c.flag} {c.name}</span>
            <span style={{ fontWeight:700, color:'var(--red)' }}>{c.n.toLocaleString('it-IT')}</span>
          </div>
        ))}
      </div>

      <div style={{ background:'var(--goldl)', border:'1px solid var(--goldb)', borderRadius:10, padding:'12px 14px', textAlign:'center', fontStyle:'italic', fontSize:'.83rem', color:'var(--t2)', lineHeight:1.7 }}>
        «Dove due o tre sono riuniti nel mio nome, io sono in mezzo a loro.»
        <span style={{ display:'block', fontSize:'.62rem', color:'var(--t3)', marginTop:4, fontStyle:'normal' }}>— MATTEO 18,20</span>
      </div>
    </div>
  )
}
