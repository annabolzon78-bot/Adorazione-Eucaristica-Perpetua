import { useTranslation } from 'react-i18next'

export function Comunita() {
  const { t } = useTranslation()

  return (
    <div className="pg">
      <div style={{ fontFamily:'Cinzel,serif', fontSize:'.68rem', letterSpacing:'.14em', color:'var(--red)', marginTop:6, marginBottom:10 }}>{t('community.testimonials_title')}</div>
      {[
        { text:'«Ho iniziato a fare un\'ora di adorazione alla settimana. L\'adorazione ha cambiato il mio matrimonio, il mio rapporto con i figli, la mia pace interiore.»', name:'Francesca M.', loc:'Milano, Italia' },
        { text:'«Sono un medico. Ho iniziato a fermarmi in cappella prima dei turni di notte. Adesso non mi manca mai.»', name:'Dr. António S.', loc:'Lisbona, Portogallo' },
      ].map((tes, i) => (
        <div key={i} style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:12, padding:14, marginBottom:9 }}>
          <div style={{ fontSize:'.9rem', fontStyle:'italic', color:'var(--t2)', lineHeight:1.7, marginBottom:8 }}>{tes.text}</div>
          <div style={{ fontSize:'.75rem', fontWeight:600, color:'var(--red)' }}>{tes.name}</div>
          <div style={{ fontSize:'.7rem', color:'var(--t3)' }}>{tes.loc}</div>
        </div>
      ))}
    </div>
  )
}
