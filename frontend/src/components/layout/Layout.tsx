import { useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header }    from './Header'
import { BottomNav } from './BottomNav'

// Musica sacra di sottofondo — Tantum Ergo (canto gregoriano), l'inno
// tradizionale dell'Adorazione Eucaristica. Fonte: Wikimedia Commons,
// licenza libera (GFDL / CC-BY-SA), autore: Gareth Hughes.
// https://commons.wikimedia.org/wiki/File:Tantum_Ergo_I_Gregorian.ogg
// NOTA: il link non è stato verificabile con gli strumenti di rete di
// questo ambiente (dominio non raggiungibile da qui); va controllato che
// l'audio parta davvero una volta pubblicato. Se non funziona, va
// sostituito con un file caricato direttamente in /public/audio/.
const SACRED_MUSIC_URL = 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Tantum_Ergo_I_Gregorian.ogg'

export function Layout() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  return (
    <div id="app">
      <Header />
      <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <BottomNav />

      <audio ref={audioRef} src={SACRED_MUSIC_URL} loop preload="none" />
      <button
        onClick={toggleMusic}
        aria-label={playing ? 'Metti in pausa la musica sacra' : 'Attiva la musica sacra di sottofondo'}
        style={{
          position: 'fixed', bottom: 78, right: 16, zIndex: 40,
          width: 46, height: 46, borderRadius: '50%',
          background: 'rgba(20,10,6,.85)', border: '1.5px solid #e8d08a',
          color: '#e8d08a', fontSize: '1.2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,.35)', cursor: 'pointer',
        }}
      >
        {playing ? '🔊' : '🔈'}
      </button>
    </div>
  )
}
