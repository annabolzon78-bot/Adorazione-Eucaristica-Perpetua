import { useStatsStore } from '@/store'

export function Header() {
  const { stats } = useStatsStore()

  return (
    <header className="hdr">
      <div className="hdr-logo">
        <span className="hdr-heart">❤️‍🔥</span>
        <div>
          <div className="hdr-name">Adorazione Viva</div>
          <div className="hdr-sub">GESÙ EUCARISTIA TI ASPETTA · OVUNQUE TU SIA</div>
        </div>
      </div>
      <div className="hdr-count">
        <span className="hc-n">{stats.adorersNow.toLocaleString('it-IT')}</span>
        <span className="hc-l">adoratori ora nel mondo</span>
      </div>
    </header>
  )
}
