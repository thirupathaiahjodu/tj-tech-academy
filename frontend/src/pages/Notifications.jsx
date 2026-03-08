import { useState, useEffect, useRef } from 'react'
import API from '../api/axios'

// ── Sample data — backend connect replace 
const SAMPLE_NOTIFS = [
 { id: 1, type: 'badge', icon: '🏆', title: 'New Badge Earned!', message: 'First Step badge earn — Keep going!', is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), link: '/leaderboard' },
 { id: 2, type: 'streak', icon: '🔥', title: '7 Day Streak! 🔥', message: '7 days continuous learning — Amazing!', is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), link: '/dashboard' },
 { id: 3, type: 'quiz', icon: '⚡', title: 'Quiz Passed!', message: 'Python Basics quiz 90% score!', is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), link: '/courses' },
 { id: 4, type: 'lesson', icon: '📚', title: 'Lesson Complete', message: 'Variables & Data Types lesson complete! +20 pts', is_read: true, created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), link: '/courses' },
 { id: 5, type: 'course', icon: '🚀', title: 'New Course Available', message: 'Django REST Framework Advanced course launched!', is_read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), link: '/courses' },
 { id: 6, type: 'system', icon: '🎉', title: 'Welcome to TJ Tech Academy Pro!', message: 'Learning journey start — All the best!', is_read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), link: '/dashboard' },
]

function timeAgo(dateStr) {
 const diff = Date.now() - new Date(dateStr).getTime()
 const mins = Math.floor(diff / 60000)
 const hours = Math.floor(diff / 3600000)
 const days = Math.floor(diff / 86400000)
 if (mins < 1) return 'just now'
 if (mins < 60) return `${mins}m ago`
 if (hours < 24) return `${hours}h ago`
 return `${days}d ago`
}

const TYPE_COLORS = {
 badge: '#f59e0b',
 streak: '#6c47ff',
 quiz: '#6c47ff',
 lesson: '#10b981',
 course: '#3b82f6',
 system: '#a855f7',
}

// ── NOTIFICATION BELL (Navbar use ) ──────────────────────
export function NotificationBell() {
 const [open, setOpen] = useState(false)
 const [notifs, setNotifs] = useState(SAMPLE_NOTIFS)
 const [unread, setUnread] = useState(3)
 const [loading, setLoading] = useState(false)
 const dropdownRef = useRef(null)

 // Outside click close
 useEffect(() => {
 const handler = (e) => {
 if (dropdownRef.current &&!dropdownRef.current.contains(e.target)) {
 setOpen(false)
 }
 }
 document.addEventListener('mousedown', handler)
 return () => document.removeEventListener('mousedown', handler)
 }, [])

 // Fetch from backend
 useEffect(() => {
 const fetch = async () => {
 try {
 const res = await API.get('/notifications/')
 setNotifs(res.data.notifications)
 setUnread(res.data.unread_count)
 } catch {
 // fallback sample data
 }
 }
 fetch()
 // Poll every 30 seconds
 const interval = setInterval(fetch, 30000)
 return () => clearInterval(interval)
 }, [])

 const markAllRead = async () => {
 try {
 await API.post('/notifications/mark-read/', { id: 'all' })
 } catch {}
 setNotifs(n => n.map(x => ({...x, is_read: true })))
 setUnread(0)
 }

 const markRead = async (id) => {
 try {
 await API.post('/notifications/mark-read/', { id })
 } catch {}
 setNotifs(n => n.map(x => x.id === id ? {...x, is_read: true } : x))
 setUnread(u => Math.max(0, u - 1))
 }

 const deleteNotif = async (e, id) => {
 e.stopPropagation()
 try {
 await API.delete(`/notifications/${id}/delete/`)
 } catch {}
 setNotifs(n => n.filter(x => x.id!== id))
 }

 return (
 <div ref={dropdownRef} style={{ position: 'relative' }}>
 {/* Bell Button */}
 <button
 onClick={() => setOpen(o =>!o)}
 style={{
 position: 'relative', background: '#faf9ff',
 border: '1px solid #ede9fe', borderRadius: 10,
 padding: '7px 10px', cursor: 'pointer',
 display: 'flex', alignItems: 'center',
 }}
 >
 <span style={{ fontSize: 18 }}>🔔</span>
 {unread > 0 && (
 <span style={{
 position: 'absolute', top: -4, right: -4,
 background: '#ef4444', color: '#fff',
 borderRadius: '50%', width: 18, height: 18,
 fontSize: 10, fontWeight: 800,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 border: '2px solid #020817',
 }}>
 {unread > 9 ? '9+' : unread}
 </span>
 )}
 </button>

 {/* Dropdown */}
 {open && (
 <div style={{
 position: 'absolute', top: '110%', right: 0,
 width: 360, maxHeight: 480,
 background: '#faf9ff', border: '1px solid #ede9fe',
 borderRadius: 14, zIndex: 1000,
 boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
 overflow: 'hidden', display: 'flex', flexDirection: 'column',
 animation: 'fadeDown 0.15s ease both',
 }}>
 <style>{`
 @keyframes fadeDown {
 from { opacity: 0; transform: translateY(-8px); }
 to { opacity: 1; transform: translateY(0); }
 }
 `}</style>

 {/* Header */}
 <div style={{
 padding: '12px 16px', borderBottom: '1px solid #e2e8f0',
 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
 background: '#ffffff', flexShrink: 0,
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ color: '#0f0a2e', fontWeight: 800, fontSize: 14 }}>
 Notifications
 </span>
 {unread > 0 && (
 <span style={{
 background: '#ef444420', color: '#ef4444',
 border: '1px solid #ef444440', borderRadius: 10,
 padding: '1px 7px', fontSize: 11, fontWeight: 700,
 }}>{unread} new</span>
 )}
 </div>
 {unread > 0 && (
 <button onClick={markAllRead} style={{
 background: 'none', border: 'none',
 color: '#6c47ff', cursor: 'pointer',
 fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
 }}>Mark all read</button>
 )}
 </div>

 {/* Notifications list */}
 <div style={{ flex: 1, overflowY: 'auto' }}>
 {notifs.length === 0 ? (
 <div style={{
 textAlign: 'center', padding: '2.5rem',
 color: '#9ca3af',
 }}>
 <div style={{ fontSize: 36, marginBottom: 8 }}>🔔</div>
 <div style={{ fontSize: 13 }}>No notifications yet!</div>
 </div>
 ) : (
 notifs.map(n => (
 <div
 key={n.id}
 onClick={() => { markRead(n.id); setOpen(false) }}
 style={{
 padding: '12px 16px',
 borderBottom: '1px solid #0f172a',
 background: n.is_read ? 'transparent' : '#f9731610',
 cursor: 'pointer', display: 'flex', gap: 10,
 alignItems: 'flex-start', transition: 'background 0.1s',
 }}
 onMouseEnter={e => e.currentTarget.style.background = '#1e293b30'}
 onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : '#f9731610'}
 >
 {/* Icon */}
 <div style={{
 width: 36, height: 36, borderRadius: 10, flexShrink: 0,
 background: (TYPE_COLORS[n.type] || '#6c47ff') + '20',
 border: `1px solid ${(TYPE_COLORS[n.type] || '#6c47ff')}30`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 18,
 }}>{n.icon}</div>

 {/* Content */}
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{
 color: n.is_read ? '#9ca3af' : '#f5f3ff',
 fontSize: 13, fontWeight: n.is_read ? 500 : 700,
 marginBottom: 2,
 }}>{n.title}</div>
 <div style={{
 color: '#6b7280', fontSize: 12, lineHeight: 1.4,
 overflow: 'hidden', display: '-webkit-box',
 WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
 }}>{n.message}</div>
 <div style={{ color: '#d1d5db', fontSize: 11, marginTop: 4 }}>
 {timeAgo(n.created_at)}
 </div>
 </div>

 {/* Unread dot + delete */}
 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
 {!n.is_read && (
 <div style={{
 width: 8, height: 8, borderRadius: '50%',
 background: '#6c47ff',
 }} />
 )}
 <button
 onClick={e => deleteNotif(e, n.id)}
 style={{
 background: 'none', border: 'none', cursor: 'pointer',
 color: '#d1d5db', fontSize: 12, padding: 0, lineHeight: 1,
 }}
 >✕</button>
 </div>
 </div>
 ))
 )}
 </div>

 {/* Footer */}
 <div style={{
 padding: '10px 16px', borderTop: '1px solid #e2e8f0',
 background: '#ffffff', textAlign: 'center', flexShrink: 0,
 }}>
 <button
 onClick={() => setOpen(false)}
 style={{
 background: 'none', border: 'none', color: '#6b7280',
 cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
 }}
 >Close</button>
 </div>
 </div>
 )}
 </div>
 )
}

// ── FULL NOTIFICATIONS PAGE ────────────────────────────────────────
export default function Notifications() {
 const [notifs, setNotifs] = useState(SAMPLE_NOTIFS)
 const [filter, setFilter] = useState('all')
 const [unread, setUnread] = useState(3)

 useEffect(() => {
 const fetch = async () => {
 try {
 const res = await API.get('/notifications/')
 setNotifs(res.data.notifications)
 setUnread(res.data.unread_count)
 } catch {}
 }
 fetch()
 }, [])

 const markAllRead = async () => {
 try { await API.post('/notifications/mark-read/', { id: 'all' }) } catch {}
 setNotifs(n => n.map(x => ({...x, is_read: true })))
 setUnread(0)
 }

 const filtered = filter === 'all'
 ? notifs
 : filter === 'unread'
 ? notifs.filter(n =>!n.is_read)
 : notifs.filter(n => n.type === filter)

 return (
 <div style={{ maxWidth: 700, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
 <style>{`
 @keyframes fadeUp {
 from { opacity: 0; transform: translateY(12px); }
 to { opacity: 1; transform: translateY(0); }
 }
 `}</style>

 {/* Header */}
 <div style={{
 display: 'flex', justifyContent: 'space-between',
 alignItems: 'center', marginBottom: '1.5rem',
 animation: 'fadeUp 0.3s ease both',
 }}>
 <div>
 <h1 style={{ color: '#0f0a2e', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
 🔔 Notifications
 </h1>
 <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
 {unread > 0 ? `${unread} unread notifications` : 'All caught up!'}
 </p>
 </div>
 {unread > 0 && (
 <button onClick={markAllRead} style={{
 padding: '8px 16px', background: '#f5f3ff',
 color: '#6c47ff', border: '1px solid #6366f140',
 borderRadius: 8, cursor: 'pointer',
 fontSize: 13, fontFamily: 'inherit',
 }}>✅ Mark All Read</button>
 )}
 </div>

 {/* Filter tabs */}
 <div style={{
 display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap',
 animation: 'fadeUp 0.3s ease 0.05s both',
 }}>
 {[
 { id: 'all', label: `All (${notifs.length})` },
 { id: 'unread', label: `Unread (${unread})` },
 { id: 'badge', label: '🏆 Badges' },
 { id: 'quiz', label: '⚡ Quiz' },
 { id: 'lesson', label: '📚 Lessons' },
 { id: 'course', label: '🚀 Courses' },
 ].map(f => (
 <button key={f.id} onClick={() => setFilter(f.id)} style={{
 padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
 background: filter === f.id ? '#6c47ff' : '#f9f8ff',
 color: filter === f.id ? '#fff' : '#64748b',
 border: `1px solid ${filter === f.id ? '#6c47ff' : '#f5f3ff'}`,
 fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
 }}>{f.label}</button>
 ))}
 </div>

 {/* List */}
 <div style={{
 background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: 14, overflow: 'hidden',
 animation: 'fadeUp 0.3s ease 0.1s both',
 }}>
 {filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
 <div style={{ fontSize: 40, marginBottom: 10 }}>🔔</div>
 <div>No notifications</div>
 </div>
 ) : (
 filtered.map((n, idx) => (
 <div key={n.id} style={{
 display: 'flex', gap: 14, padding: '14px 16px',
 borderBottom: idx < filtered.length - 1 ? '1px solid #0f172a' : 'none',
 background: n.is_read ? 'transparent' : '#f9731610',
 animation: `fadeUp 0.2s ease ${idx * 0.03}s both`,
 }}>
 {/* Icon */}
 <div style={{
 width: 44, height: 44, borderRadius: 12, flexShrink: 0,
 background: (TYPE_COLORS[n.type] || '#6c47ff') + '20',
 border: `1px solid ${(TYPE_COLORS[n.type] || '#6c47ff')}30`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 22,
 }}>{n.icon}</div>

 {/* Content */}
 <div style={{ flex: 1 }}>
 <div style={{
 display: 'flex', justifyContent: 'space-between',
 alignItems: 'flex-start', gap: 8,
 }}>
 <div style={{
 color: n.is_read ? '#9ca3af' : '#f5f3ff',
 fontSize: 14, fontWeight: n.is_read ? 500 : 700,
 }}>{n.title}</div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
 {!n.is_read && (
 <div style={{
 width: 8, height: 8, borderRadius: '50%', background: '#6c47ff',
 }} />
 )}
 <span style={{ color: '#d1d5db', fontSize: 11 }}>{timeAgo(n.created_at)}</span>
 </div>
 </div>
 <div style={{ color: '#6b7280', fontSize: 13, marginTop: 3, lineHeight: 1.5 }}>
 {n.message}
 </div>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 )
}