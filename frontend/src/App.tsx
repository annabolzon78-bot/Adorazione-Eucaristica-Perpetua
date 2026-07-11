import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout }   from './components/layout/Layout'
import { Home }     from './pages/Home'
import { Trova }    from './pages/Trova'
import { Live }     from './pages/Live'
import { Miracoli } from './pages/Miracoli'
import { Prega }    from './pages/Prega'
import { Catena }   from './pages/Catena'
import { Comunita } from './pages/Comunita'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index        element={<Home />} />
          <Route path="trova" element={<Trova />} />
          <Route path="live"  element={<Live />} />
          <Route path="miracoli" element={<Miracoli />} />
          <Route path="prega" element={<Prega />} />
          <Route path="catena" element={<Catena />} />
          <Route path="comunita" element={<Comunita />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
