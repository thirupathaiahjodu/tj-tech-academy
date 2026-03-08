import { useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { NotificationBell } from '../pages/Notifications'

const pageTitles = {
  '/dashboard':     { title: 'Dashboard',        sub: 'Welcome back! Keep learning 🔥' },
  '/courses':       { title: 'Courses',           sub: 'Browse all learning paths' },
  '/playground':    { title: 'Code Playground',   sub: 'Write, run, experiment' },
  '/ai-solver':     { title: 'AI Doubt Solver',   sub: 'Ask anything about code' },
  '/leaderboard':   { title: 'Leaderboard',       sub: 'Top learners this week' },
  '/interview':     { title: 'Interview Prep',    sub: 'Crack your dream job' },
  '/resume':        { title: 'Resume Builder',    sub: 'Build your profile' },
  '/certificate':   { title: 'Certificates',      sub: 'Your achievements' },
  '/notifications': { title: 'Notifications',     sub: 'Your latest updates' },
  '/forum':         { title: 'Discussion Forum',  sub: 'Ask, answer, learn together' },
  '/live':          { title: 'Live Classes',      sub: 'Learn live with mentors' },
  '/pricing':       { title: 'Pricing',           sub: 'Upgrade your plan' },
  '/admin':         { title: 'Admin Dashboard',   sub: 'Platform analytics' },
}

export default function Navbar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const page = pageTitles[location.pathname] || { title: 'TJ Tech Academy', sub: '' }

  return (
    <header style={{
      height: 62, background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #ede9fe',
      display: 'flex', alignItems: 'center',
      padding: '0 1.5rem', gap: 16,
      position: 'sticky', top: 0, zIndex: 30,
      boxShadow: '0 1px 8px rgba(108,71,255,0.07)',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Page title */}
      <div style={{ flex: 1 }}>
        <div style={{ color: '#0f0a2e', fontWeight: 800, fontSize: 16 }}>{page.title}</div>
        <div style={{ color: '#9ca3af', fontSize: 11 }}>{page.sub}</div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Streak */}
        <div style={{
          background: '#fff7ed', border: '1px solid #fed7aa',
          borderRadius: 100, padding: '4px 12px',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ fontSize: 13 }}>🔥</span>
          <span style={{ color: '#f97316', fontSize: 12, fontWeight: 700 }}>7 days</span>
        </div>

        {/* XP */}
        <div style={{
          background: '#ede9fe', border: '1px solid #ddd6fe',
          borderRadius: 100, padding: '4px 12px',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ fontSize: 13 }}>⚡</span>
          <span style={{ color: '#6c47ff', fontSize: 12, fontWeight: 700 }}>450 XP</span>
        </div>

        {/* Plan */}
        {user?.subscription_plan === 'premium' ? (
          <div style={{
            background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
            borderRadius: 100, padding: '4px 12px',
            color: '#fff', fontSize: 12, fontWeight: 700,
          }}>⭐ Premium</div>
        ) : (
          <div style={{
            background: '#f5f3ff', border: '1px solid #ddd6fe',
            borderRadius: 100, padding: '4px 12px',
            color: '#6c47ff', fontSize: 12, fontWeight: 700,
          }}>🆓 Free</div>
        )}

        <NotificationBell />

        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(108,71,255,0.35)',
        }}>
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}