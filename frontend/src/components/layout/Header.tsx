import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  return (
    <header className="app-header">
      <div className="ah-logo">
        <span style={{ fontSize:'1.4rem' }}>❤️‍🔥</span>
        <div>
          <div className="ah-logo-name">Adorazione Eucaristica</div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
