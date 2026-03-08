import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const navItems = [
  { icon: '⚡', label: 'Dashboard',      path: '/dashboard' },
  { icon: '📚', label: 'Courses',        path: '/courses' },
  { icon: '💻', label: 'Playground',     path: '/playground' },
  { icon: '🤖', label: 'AI Solver',      path: '/ai-solver' },
  { icon: '🏆', label: 'Leaderboard',    path: '/leaderboard' },
  { icon: '🎯', label: 'Interview Prep', path: '/interview' },
  { icon: '📄', label: 'Resume Builder', path: '/resume' },
  { icon: '🎓', label: 'Certificates',   path: '/certificate' },
  { icon: '🔔', label: 'Notifications',  path: '/notifications' },
  { icon: '💬', label: 'Forum',          path: '/forum' },
  { icon: '🎥', label: 'Live Classes',   path: '/live' },
  { icon: '💎', label: 'Pricing',        path: '/pricing' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const allNavItems = [
    ...navItems,
    ...(user?.role === 'admin' ? [{ icon: '📊', label: 'Admin Panel', path: '/admin' }] : []),
  ]

  return (
    <aside style={{
      width: 248,
      background: '#ffffff',
      borderRight: '1px solid #ede9fe',
      height: '100vh',
      position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflowY: 'auto',
      boxShadow: '2px 0 12px rgba(108,71,255,0.06)',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── LOGO ── */}
      <div style={{
        padding: '1.4rem 1.2rem 1.1rem',
        borderBottom: '1px solid #ede9fe',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          boxShadow: '0 4px 12px rgba(108,71,255,0.35)',
        }}>🎓</div>
        <div>
          <div style={{ color: '#000000', fontWeight: 800, fontSize: 14, letterSpacing: '-0.3px' }}>
            TJ Tech Academy
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700,
            background: 'linear-gradient(90deg, #6c47ff, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {user?.subscription_plan === 'premium' ? '⭐ PREMIUM' : 'Learn • Build • Grow'}
          </div>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{ flex: 1, padding: '0.8rem 0.7rem', overflowY: 'auto' }}>
        <p style={{ color: '#111827', fontSize: 10, fontWeight: 700, padding: '4px 8px 6px', letterSpacing: 1 }}>
          MENU
        </p>

        {allNavItems.map(item => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 10, marginBottom: 1,
              textDecoration: 'none', fontSize: 13, fontWeight: 500,
              background: isActive ? 'linear-gradient(135deg, #ede9fe, #f5f3ff)' : 'transparent',
              color: isActive ? '#6c47ff' : '#4b5563',
              border: isActive ? '1px solid #ddd6fe' : '1px solid transparent',
              fontWeight: isActive ? 700 : 500,
              transition: 'all 0.15s',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('gradient')) {
                e.currentTarget.style.background = '#f5f3ff'
                e.currentTarget.style.color = '#6c47ff'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#4b5563'
              }
            }}
          >
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.path === '/admin' && (
              <span style={{
                background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
                color: '#fff', borderRadius: 6,
                padding: '1px 7px', fontSize: 9, fontWeight: 800,
              }}>ADMIN</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── USER ── */}
      <div style={{ padding: '0.9rem 0.8rem', borderTop: '1px solid #ede9fe' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px', borderRadius: 12,
          background: 'linear-gradient(135deg, #f5f3ff, #fdf4ff)',
          border: '1px solid #ede9fe', marginBottom: 8,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 14,
            boxShadow: '0 2px 8px rgba(108,71,255,0.35)',
          }}>{user?.username?.[0]?.toUpperCase() || 'U'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#000000', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username}
            </div>
            <div style={{ color: '#111827', fontSize: 11 }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login') }} style={{
          width: '100%', padding: '8px',
          background: '#fef2f2', color: '#ef4444',
          border: '1px solid #fecaca', borderRadius: 10,
          cursor: 'pointer', fontSize: 12, fontWeight: 700,
          fontFamily: 'inherit',
        }}>🚪 Sign Out</button>
      </div>
    </aside>
  )
}