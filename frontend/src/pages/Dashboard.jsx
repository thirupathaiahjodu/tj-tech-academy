import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const S = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
 @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
 @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
 @keyframes grad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

.dash * { font-family: 'Inter', sans-serif; }

.scard {
 background: #fff;
 border-radius: 18px;
 border: 1px solid #f0edff;
 padding: 1.3rem 1.4rem;
 position: relative; overflow: hidden;
 transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
 box-shadow: 0 2px 10px rgba(108,71,255,0.06);
 }
.scard:hover {
 transform: translateY(-4px);
 box-shadow: 0 12px 32px rgba(108,71,255,0.14);
 border-color: #ddd6fe;
 }

.qaction {
 display: flex; align-items: center; gap: 12px;
 padding: 11px 12px; border-radius: 12px; margin-bottom: 8px;
 background: #faf9ff; border: 1px solid #f0edff;
 cursor: pointer;
 transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
 }
.qaction:hover {
 transform: translateX(5px);
 background: #fff;
 box-shadow: 0 4px 16px rgba(108,71,255,0.1);
 border-color: #ddd6fe;
 }

.badge-item {
 transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
 cursor: pointer;
 }
.badge-item:hover { transform: scale(1.08) rotate(-1.5deg); }

.act-row {
 transition: background 0.15s;
 border-radius: 10px; padding: 9px 8px; margin: 0 -8px;
 }
.act-row:hover { background: #faf9ff; }
`

const courses = [
 { name: 'Python Fundamentals', pct: 72, color: '#6c47ff' },
 { name: 'React for Beginners', pct: 45, color: '#a855f7' },
 { name: 'Django REST API', pct: 20, color: '#10b981' },
 { name: 'MySQL Basics', pct: 88, color: '#f59e0b' },
]
const badges = [
 { icon: '🌱', label: 'Beginner', earned: true, color: '#10b981' },
 { icon: '⚡', label: 'Fast Learner', earned: true, color: '#f59e0b' },
 { icon: '🔥', label: '7-Day Streak', earned: true, color: '#ef4444' },
 { icon: '💻', label: 'Code Master', earned: false, color: '#6c47ff' },
 { icon: '🏆', label: 'Top 10', earned: false, color: '#eab308' },
 { icon: '🚀', label: 'Pro Dev', earned: false, color: '#a855f7' },
]
const activity = [
 { icon: '✅', text: 'Python Basics — Lesson 5 complete', time: '2h ago', color: '#10b981' },
 { icon: '🏅', text: 'Badge Earned: Fast Learner', time: '5h ago', color: '#f59e0b' },
 { icon: '📝', text: 'Quiz Passed: Data Types (90%)', time: 'Yesterday', color: '#6c47ff' },
 { icon: '💻', text: 'Challenge Solved: FizzBuzz', time: '2d ago', color: '#a855f7' },
]
const quickActions = [
 { icon: '▶️', label: 'Continue Learning', sub: 'Python — Lesson 6', color: '#6c47ff', path: '/courses' },
 { icon: '🤖', label: 'AI Doubt Solver', sub: 'Instant code help', color: '#a855f7', path: '/ai-solver' },
 { icon: '💻', label: 'Code Playground', sub: 'Write & run code', color: '#06b6d4', path: '/playground' },
 { icon: '🎯', label: 'Mock Interview', sub: 'Practice questions', color: '#ef4444', path: '/interview' },
]

function StatCard({ icon, label, value, sub, color, delay }) {
 return (
 <div className="scard" style={{ animation: `fadeUp 0.5s ease ${delay}s both` }}>
 <div style={{
 position: 'absolute', top: 0, left: 0, right: 0, height: 3,
 background: `linear-gradient(90deg, ${color}, ${color}80)`,
 borderRadius: '18px 18px 0 0',
 }} />
 <div style={{
 position: 'absolute', right: -16, bottom: -16,
 width: 72, height: 72, borderRadius: '50%',
 background: color + '0c',
 }} />
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
 <div>
 <p style={{ color: '#111827', fontSize: 11, fontWeight: 600, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</p>
 <p style={{ color: '#000000', fontSize: 30, fontWeight: 900, margin: '0 0 5px', lineHeight: 1 }}>{value}</p>
 <p style={{ color: color, fontSize: 12, fontWeight: 700, margin: 0 }}>{sub}</p>
 </div>
 <div style={{
 width: 50, height: 50, borderRadius: 14,
 background: `linear-gradient(135deg, ${color}20, ${color}08)`,
 border: `1.5px solid ${color}20`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 22,
 }}>{icon}</div>
 </div>
 </div>
 )
}

export default function Dashboard() {
 const { user } = useAuthStore()
 const navigate = useNavigate()
 const [go, setGo] = useState(false)
 useEffect(() => { setTimeout(() => setGo(true), 300) }, [])

 return (
 <div className="dash" style={{ maxWidth: 1120 }}>
 <style>{S}</style>

 {/* ── HERO ── */}
 <div style={{
 borderRadius: 22,
 padding: '2rem 2.2rem',
 marginBottom: '1.4rem',
 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
 animation: 'fadeUp 0.4s ease both',
 overflow: 'hidden', position: 'relative',
 background: 'linear-gradient(135deg, #6c47ff 0%, #8b5cf6 50%, #a855f7 100%)',
 backgroundSize: '200% 200%',
 animation: 'fadeUp 0.4s ease both, grad 5s ease infinite',
 boxShadow: '0 12px 40px rgba(108,71,255,0.35)',
 }}>
 {/* Decorative */}
 <div style={{ position:'absolute', right:140, top:-60, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }} />
 <div style={{ position:'absolute', right:-30, bottom:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
 <div style={{ position:'absolute', left:'38%', top:-30, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} />

 <div style={{ position:'relative', zIndex:1 }}>
 {/* Pill badge */}
 <div style={{
 display:'inline-flex', alignItems:'center', gap:6,
 background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)',
 border:'1px solid rgba(255,255,255,0.3)',
 borderRadius:100, padding:'4px 14px', marginBottom:14,
 }}>
 <span style={{ fontSize:11 }}>🎓</span>
 <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>TJ Tech Academy</span>
 </div>

 <h1 style={{ color:'#fff', fontSize:26, fontWeight:900, margin:'0 0 8px', letterSpacing:'-0.5px' }}>
 Hey {user?.username || 'Student'}! 👋
 </h1>
 <p style={{ color:'rgba(255,255,255,0.82)', fontSize:14, margin:'0 0 20px', lineHeight:1.6 }}>
 Daily goal: 2 lessons. 1 complete! Keep going 💪
 </p>
 <div style={{ display:'flex', gap:10 }}>
 <button onClick={() => navigate('/courses')} style={{
 background:'#fff', color:'#6c47ff',
 border:'none', borderRadius:12, padding:'10px 22px',
 fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit',
 boxShadow:'0 4px 16px rgba(0,0,0,0.15)',
 transition:'transform 0.15s',
 }}
 onMouseEnter={e=>e.currentTarget.style.transform='scale(1.03)'}
 onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
 >▶️ Resume Learning</button>
 <button onClick={() => navigate('/courses')} style={{
 background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)',
 color:'#fff', border:'1.5px solid rgba(255,255,255,0.35)',
 borderRadius:12, padding:'10px 22px',
 fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
 transition:'background 0.15s',
 }}
 onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'}
 onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
 >📚 Browse Courses</button>
 </div>
 </div>

 {/* Streak floating card */}
 <div style={{ position:'relative', zIndex:1, animation:'float 3s ease-in-out infinite' }}>
 <div style={{
 background:'rgba(255,255,255,0.18)', backdropFilter:'blur(12px)',
 border:'1.5px solid rgba(255,255,255,0.3)',
 borderRadius:20, padding:'1.2rem 1.8rem', textAlign:'center',
 boxShadow:'0 8px 32px rgba(0,0,0,0.1)',
 }}>
 <div style={{ fontSize:36, marginBottom:4 }}>🔥</div>
 <div style={{ color:'#fff', fontSize:28, fontWeight:900, lineHeight:1 }}>7</div>
 <div style={{ color:'rgba(255,255,255,0.85)', fontSize:11, fontWeight:700, letterSpacing:1, marginTop:4 }}>DAY STREAK</div>
 </div>
 </div>
 </div>

 {/* ── STATS ── */}
 <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:'1.4rem' }}>
 <StatCard icon="📚" label="Enrolled" value="4" sub="+1 this month" color="#6c47ff" delay={0.05} />
 <StatCard icon="✅" label="Lessons" value="23" sub="of 80 completed" color="#10b981" delay={0.1} />
 <StatCard icon="⚡" label="XP Points" value="450" sub="Top 15% this week" color="#f59e0b" delay={0.15} />
 <StatCard icon="🏅" label="Badges" value="3" sub="3 more to unlock" color="#a855f7" delay={0.2} />
 </div>

 {/* ── MID ROW ── */}
 <div style={{ display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:14, marginBottom:'1.4rem' }}>

 {/* Progress */}
 <div style={{ background:'#fff', borderRadius:18, padding:'1.5rem', border:'1px solid #f0edff', boxShadow:'0 2px 10px rgba(108,71,255,0.06)', animation:'fadeUp 0.5s ease 0.25s both' }}>
 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
 <div>
 <h3 style={{ color:'#0f0a2e', fontWeight:800, fontSize:15, margin:'0 0 2px' }}>📈 Course Progress</h3>
 <p style={{ color:'#9ca3af', fontSize:12, margin:0 }}>Your learning journey</p>
 </div>
 <span style={{ background:'#ede9fe', color:'#6c47ff', border:'1px solid #ddd6fe', borderRadius:100, padding:'3px 12px', fontSize:11, fontWeight:700 }}>4 Active</span>
 </div>
 {courses.map((c,i) => (
 <div key={c.name} style={{ marginBottom: i < courses.length-1 ? 18 : 0 }}>
 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
 <span style={{ color:'#374151', fontSize:13, fontWeight:600 }}>{c.name}</span>
 <span style={{ color:c.color, fontSize:13, fontWeight:800 }}>{c.pct}%</span>
 </div>
 <div style={{ background:'#f5f3ff', borderRadius:99, height:8, overflow:'hidden' }}>
 <div style={{
 width: go ? `${c.pct}%` : '0%', height:'100%',
 background:`linear-gradient(90deg, ${c.color}, ${c.color}99)`,
 borderRadius:99,
 transition:`width 1.2s cubic-bezier(0.34,1.56,0.64,1) ${i*0.15}s`,
 boxShadow:`0 2px 8px ${c.color}50`,
 }} />
 </div>
 </div>
 ))}
 </div>

 {/* Badges */}
 <div style={{ background:'#fff', borderRadius:18, padding:'1.5rem', border:'1px solid #f0edff', boxShadow:'0 2px 10px rgba(108,71,255,0.06)', animation:'fadeUp 0.5s ease 0.3s both' }}>
 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
 <div>
 <h3 style={{ color:'#0f0a2e', fontWeight:800, fontSize:15, margin:'0 0 2px' }}>🏅 Achievements</h3>
 <p style={{ color:'#9ca3af', fontSize:12, margin:0 }}>3 of 6 earned</p>
 </div>
 <span style={{ background:'#f0fdf4', color:'#10b981', border:'1px solid #bbf7d0', borderRadius:100, padding:'3px 12px', fontSize:11, fontWeight:700 }}>50%</span>
 </div>
 <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
 {badges.map(b => (
 <div key={b.label} className="badge-item" style={{
 textAlign:'center', padding:'14px 8px',
 background: b.earned ? b.color+'10' : '#f9f8ff',
 border:`1.5px solid ${b.earned ? b.color+'30' : '#ede9fe'}`,
 borderRadius:14,
 opacity: b.earned ? 1 : 0.4,
 filter: b.earned ? 'none' : 'grayscale(0.8)',
 position:'relative',
 }}>
 {b.earned && <div style={{ position:'absolute', top:6, right:6, width:7, height:7, borderRadius:'50%', background:b.color, boxShadow:`0 0 6px ${b.color}` }} />}
 <div style={{ fontSize:26, marginBottom:5 }}>{b.icon}</div>
 <div style={{ color: b.earned ? b.color : '#9ca3af', fontSize:10, fontWeight:800 }}>{b.label}</div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* ── BOTTOM ROW ── */}
 <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:14 }}>

 {/* Activity */}
 <div style={{ background:'#fff', borderRadius:18, padding:'1.5rem', border:'1px solid #f0edff', boxShadow:'0 2px 10px rgba(108,71,255,0.06)', animation:'fadeUp 0.5s ease 0.35s both' }}>
 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
 <h3 style={{ color:'#0f0a2e', fontWeight:800, fontSize:15, margin:0 }}>📋 Recent Activity</h3>
 <span style={{ color:'#6c47ff', fontSize:12, fontWeight:700, cursor:'pointer' }}>View all →</span>
 </div>
 {activity.map((a,i) => (
 <div key={i} className="act-row" style={{ display:'flex', gap:12, alignItems:'center', borderBottom: i<activity.length-1 ? '1px solid #f9f8ff' : 'none', marginBottom: i<activity.length-1 ? 2 : 0 }}>
 <div style={{ width:38, height:38, borderRadius:12, flexShrink:0, background:`linear-gradient(135deg,${a.color}18,${a.color}08)`, border:`1px solid ${a.color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>{a.icon}</div>
 <div style={{ flex:1 }}>
 <p style={{ color:'#1e293b', fontSize:13, fontWeight:600, margin:'0 0 2px' }}>{a.text}</p>
 <p style={{ color:'#9ca3af', fontSize:11, margin:0 }}>{a.time}</p>
 </div>
 <div style={{ width:6, height:6, borderRadius:'50%', background:a.color, flexShrink:0 }} />
 </div>
 ))}
 </div>

 {/* Quick Actions */}
 <div style={{ background:'#fff', borderRadius:18, padding:'1.5rem', border:'1px solid #f0edff', boxShadow:'0 2px 10px rgba(108,71,255,0.06)', animation:'fadeUp 0.5s ease 0.4s both' }}>
 <h3 style={{ color:'#0f0a2e', fontWeight:800, fontSize:15, margin:'0 0 14px' }}>⚡ Quick Actions</h3>
 {quickActions.map(a => (
 <div key={a.label} className="qaction" onClick={() => navigate(a.path)}>
 <div style={{ width:38, height:38, borderRadius:12, flexShrink:0, background:`linear-gradient(135deg,${a.color}20,${a.color}08)`, border:`1.5px solid ${a.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{a.icon}</div>
 <div style={{ flex:1 }}>
 <p style={{ color:'#0f0a2e', fontSize:13, fontWeight:700, margin:'0 0 1px' }}>{a.label}</p>
 <p style={{ color:'#9ca3af', fontSize:11, margin:0 }}>{a.sub}</p>
 </div>
 <span style={{ color:'#c4b5fd', fontSize:18 }}>›</span>
 </div>
 ))}

 {/* XP bar */}
 <div style={{ marginTop:10, padding:'14px', background:'linear-gradient(135deg,#f5f3ff,#fdf4ff)', border:'1.5px solid #ede9fe', borderRadius:14 }}>
 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
 <span style={{ color:'#0f0a2e', fontSize:12, fontWeight:700 }}>⚡ Level 5 — Pro</span>
 <span style={{ color:'#6c47ff', fontSize:12, fontWeight:800 }}>450 / 600</span>
 </div>
 <div style={{ background:'#ede9fe', borderRadius:99, height:7 }}>
 <div style={{ width: go ? '75%' : '0%', height:'100%', background:'linear-gradient(90deg,#6c47ff,#a855f7)', borderRadius:99, transition:'width 1.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s', boxShadow:'0 2px 8px rgba(108,71,255,0.4)' }} />
 </div>
 <p style={{ color:'#9ca3af', fontSize:11, margin:'6px 0 0', textAlign:'right' }}>150 XP to next level</p>
 </div>
 </div>
 </div>
 </div>
 )
}