import { NavLink } from 'react-router-dom'

const NAV = [
  { to:'/',         icon:'❤️‍🔥', label:'Home'      },
  { to:'/trova',    icon:'🗺️',   label:'Trova'     },
  { to:'/live',     icon:'▶',    label:'Live'      },
  { to:'/miracoli', icon:'✝️',   label:'Miracoli'  },
  { to:'/prega',    icon:'🙏',   label:'Prega'     },
  { to:'/comunita', icon:'👥',   label:'Comunità'  },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `bn-item ${isActive ? 'bn-active' : ''}`}
        >
          <span className="bn-icon">{icon}</span>
          <span className="bn-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
