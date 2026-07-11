import { Outlet } from 'react-router-dom'
import { Header }    from './Header'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div id="app">
      <Header />
      <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
