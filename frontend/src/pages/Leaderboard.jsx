import { useState, useEffect } from 'react'
import API from '../api/axios'

const RANK_COLORS = {
 1: { bg: '#fbbf2420', border: '#fbbf24', text: '#fbbf24', icon: '🥇' },
 2: { bg: '#94a3b820', border: '#9ca3af', text: '#9ca3af', icon: '🥈' },
 3: { bg: '#f97316 20', border: '#6c47ff', text: '#6c47ff', icon: '🥉' },
}

const SAMPLE_DATA = {
 leaderboard: [
 { rank: 1, name: 'Sneha Reddy', total_points: 2850, streak_days: 21, lessons_completed: 48, badges_count: 8, is_me: false },
 { rank: 2, name: 'Rahul Kumar', total_points: 2340, streak_days: 14, lessons_completed: 39, badges_count: 6, is_me: false },
 { rank: 3, name: 'Arjun Patel', total_points: 1980, streak_days: 9, lessons_completed: 31, badges_count: 5, is_me: false },
 { rank: 4, name: 'Priya Singh', total_points: 1650, streak_days: 7, lessons_completed: 28, badges_count: 4, is_me: true },
 { rank: 5, name: 'Vikram Nair', total_points: 1420, streak_days: 5, lessons_completed: 22, badges_count: 3, is_me: false },
 { rank: 6, name: 'Divya Sharma', total_points: 1200, streak_days: 3, lessons_completed: 18, badges_count: 2, is_me: false },
 { rank: 7, name: 'Kiran Reddy', total_points: 980, streak_days: 2, lessons_completed: 15, badges_count: 2, is_me: false },
 { rank: 8, name: 'Meera Iyer', total_points: 750, streak_days: 1, lessons_completed: 12, badges_count: 1, is_me: false },
 ],
 my_rank: 4,
 my_points: 1650,
}

const BADGES_LIST = [
 { icon: '🔥', name: 'First Lesson', desc: 'First lesson complete ' },
 { icon: '⚡', name: 'Quiz Master', desc: '5 quizzes pass ' },
 { icon: '🌟', name: '7-Day Streak', desc: '7 days continuous learning' },
 { icon: '🚀', name: 'Fast Learner', desc: '10 lessons complete ' },
 { icon: '💎', name: 'Top Student', desc: '1000 points collect ' },
 { icon: '🏆', name: 'Course Hero', desc: 'First course complete ' },
]

export default function Leaderboard() {
 const [data, setData] = useState(SAMPLE_DATA)
 const [loading, setLoading] = useState(true)
 const [activeTab, setActiveTab] = useState('leaderboard')

 useEffect(() => {
 const fetchData = async () => {
 try {
 const [lbRes, statsRes] = await Promise.all([
 API.get('/gamification/leaderboard/'),
 API.get('/gamification/stats/'),
 ])
 setData({
 leaderboard: lbRes.data.leaderboard,
 my_rank: lbRes.data.my_rank,
 my_points: lbRes.data.my_points,
 stats: statsRes.data,
 })
 } catch {
 // fallback to sample data
 } finally {
 setLoading(false)
 }
 }
 fetchData()
 }, [])

 const myEntry = data.leaderboard?.find(u => u.is_me)
 const top3 = data.leaderboard?.slice(0, 3) || []
 const rest = data.leaderboard?.slice(3) || []

 return (
 <div style={{ maxWidth: 900, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
 <style>{`
 @keyframes fadeUp {
 from { opacity: 0; transform: translateY(14px); }
 to { opacity: 1; transform: translateY(0); }
 }
 @keyframes glow {
 0%, 100% { box-shadow: 0 0 8px #fbbf2440; }
 50% { box-shadow: 0 0 20px #fbbf2480; }
 }
 `}</style>

 {/* ── HEADER ── */}
 <div style={{ marginBottom: '1.5rem', animation: 'fadeUp 0.3s ease both' }}>
 <h1 style={{ color: '#0f0a2e', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
 🏆 Leaderboard
 </h1>
 <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
 Top learners —!
 </p>
 </div>

 {/* ── MY RANK BANNER ── */}
 <div style={{
 background: 'linear-gradient(135deg, #f5f3ff, #ffffff)',
 border: '1px solid #6366f140',
 borderRadius: 14, padding: '1rem 1.5rem',
 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
 marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12,
 animation: 'fadeUp 0.3s ease 0.05s both',
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
 <div style={{
 width: 48, height: 48, borderRadius: '50%',
 background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 20, fontWeight: 800, color: '#fff',
 }}>
 {data.my_rank}
 </div>
 <div>
 <div style={{ color: '#0f0a2e', fontWeight: 700, fontSize: 15 }}>
 Your Rank
 </div>
 <div style={{ color: '#6b7280', fontSize: 12 }}>
 {data.my_points?.toLocaleString()} total points
 </div>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 20 }}>
 {[
 { label: 'Points', value: data.my_points?.toLocaleString() || '0', icon: '⭐' },
 { label: 'Streak', value: `${myEntry?.streak_days || 0} days`, icon: '🔥' },
 { label: 'Lessons', value: myEntry?.lessons_completed || 0, icon: '📚' },
 { label: 'Badges', value: myEntry?.badges_count || 0, icon: '🏅' },
 ].map(s => (
 <div key={s.label} style={{ textAlign: 'center' }}>
 <div style={{ fontSize: 18 }}>{s.icon}</div>
 <div style={{ color: '#0f0a2e', fontSize: 14, fontWeight: 700 }}>{s.value}</div>
 <div style={{ color: '#6b7280', fontSize: 11 }}>{s.label}</div>
 </div>
 ))}
 </div>
 </div>

 {/* ── TABS ── */}
 <div style={{
 display: 'flex', gap: 6, marginBottom: '1rem',
 animation: 'fadeUp 0.3s ease 0.1s both',
 }}>
 {[
 { id: 'leaderboard', label: '🏆 Leaderboard' },
 { id: 'badges', label: '🏅 Badges' },
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 style={{
 padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
 background: activeTab === tab.id ? '#6c47ff' : '#f9f8ff',
 color: activeTab === tab.id ? '#fff' : '#64748b',
 border: `1px solid ${activeTab === tab.id ? '#6c47ff' : '#f5f3ff'}`,
 fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
 }}
 >{tab.label}</button>
 ))}
 </div>

 {/* ── LEADERBOARD TAB ── */}
 {activeTab === 'leaderboard' && (
 <div style={{ animation: 'fadeUp 0.3s ease both' }}>

 {/* TOP 3 PODIUM */}
 <div style={{
 display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
 gap: 12, marginBottom: '1.5rem',
 }}>
 {[top3[1], top3[0], top3[2]].map((user, i) => {
 if (!user) return <div key={i} />
 const realRank = i === 0 ? 2 : i === 1 ? 1 : 3
 const rc = RANK_COLORS[realRank]
 const heights = { 1: 130, 2: 110, 3: 90 }
 return (
 <div key={user.rank} style={{
 background: rc.bg,
 border: `1px solid ${rc.border}40`,
 borderRadius: 14, padding: '1rem',
 textAlign: 'center',
 animation: realRank === 1 ? 'glow 2s ease infinite' : 'none',
 paddingTop: `${heights[realRank] / 10}px`,
 }}>
 <div style={{ fontSize: 32, marginBottom: 6 }}>{rc.icon}</div>
 <div style={{
 width: 48, height: 48, borderRadius: '50%',
 background: `linear-gradient(135deg, ${rc.border}40, ${rc.border}20)`,
 border: `2px solid ${rc.border}`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 18, fontWeight: 800, color: rc.text,
 margin: '0 auto 8px',
 }}>
 {user.name[0]}
 </div>
 <div style={{ color: '#0f0a2e', fontWeight: 700, fontSize: 13 }}>
 {user.name}
 </div>
 <div style={{ color: rc.text, fontSize: 15, fontWeight: 800, marginTop: 4 }}>
 {user.total_points.toLocaleString()} pts
 </div>
 <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>
 🔥 {user.streak_days} day streak
 </div>
 </div>
 )
 })}
 </div>

 {/* REST OF LEADERBOARD */}
 <div style={{
 background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: 14, overflow: 'hidden',
 }}>
 {/* Header row */}
 <div style={{
 display: 'grid',
 gridTemplateColumns: '50px 1fr 120px 100px 80px',
 padding: '10px 16px',
 background: '#ffffff', borderBottom: '1px solid #e2e8f0',
 color: '#6b7280', fontSize: 11, fontWeight: 700,
 }}>
 <span>RANK</span>
 <span>STUDENT</span>
 <span style={{ textAlign: 'center' }}>POINTS</span>
 <span style={{ textAlign: 'center' }}>STREAK</span>
 <span style={{ textAlign: 'center' }}>BADGES</span>
 </div>

 {/* All users */}
 {data.leaderboard?.map((user, idx) => (
 <div
 key={user.rank}
 style={{
 display: 'grid',
 gridTemplateColumns: '50px 1fr 120px 100px 80px',
 padding: '12px 16px', alignItems: 'center',
 borderBottom: idx < data.leaderboard.length - 1
 ? '1px solid #0f172a' : 'none',
 background: user.is_me
 ? 'linear-gradient(90deg, #6366f110, transparent)'
 : 'transparent',
 transition: 'background 0.15s',
 }}
 >
 {/* Rank */}
 <div style={{
 color: user.rank <= 3 ? RANK_COLORS[user.rank]?.text : '#4b5563',
 fontWeight: 800, fontSize: 14,
 }}>
 {user.rank <= 3 ? RANK_COLORS[user.rank].icon : `#${user.rank}`}
 </div>

 {/* Name + avatar */}
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <div style={{
 width: 34, height: 34, borderRadius: '50%',
 background: user.is_me
 ? 'linear-gradient(135deg, #6c47ff, #a855f7)'
 : 'linear-gradient(135deg, #1e293b, #0f172a)',
 border: user.is_me ? '2px solid #6366f1' : '1px solid #1e293b',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 14, fontWeight: 700,
 color: user.is_me ? '#fff' : '#4b5563',
 flexShrink: 0,
 }}>
 {user.name[0]}
 </div>
 <div>
 <div style={{
 color: user.is_me ? '#6c47ff' : '#f5f3ff',
 fontSize: 13, fontWeight: user.is_me ? 700 : 500,
 }}>
 {user.name}
 {user.is_me && (
 <span style={{
 marginLeft: 6, fontSize: 10, color: '#6c47ff',
 background: '#f5f3ff', padding: '1px 6px',
 borderRadius: 4, fontWeight: 700,
 }}>YOU</span>
 )}
 </div>
 <div style={{ color: '#6b7280', fontSize: 11 }}>
 {user.lessons_completed} lessons
 </div>
 </div>
 </div>

 {/* Points */}
 <div style={{ textAlign: 'center', color: '#fbbf24', fontWeight: 700, fontSize: 14 }}>
 ⭐ {user.total_points.toLocaleString()}
 </div>

 {/* Streak */}
 <div style={{ textAlign: 'center', color: '#6c47ff', fontSize: 13 }}>
 🔥 {user.streak_days}d
 </div>

 {/* Badges */}
 <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
 🏅 {user.badges_count}
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* ── BADGES TAB ── */}
 {activeTab === 'badges' && (
 <div style={{
 display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
 gap: 12, animation: 'fadeUp 0.3s ease both',
 }}>
 {BADGES_LIST.map((badge, i) => (
 <div key={i} style={{
 background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: 14, padding: '1.25rem',
 display: 'flex', alignItems: 'center', gap: 14,
 }}>
 <div style={{
 width: 52, height: 52, borderRadius: 12,
 background: '#faf9ff', border: '1px solid #334155',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 26, flexShrink: 0,
 }}>
 {badge.icon}
 </div>
 <div>
 <div style={{ color: '#0f0a2e', fontWeight: 700, fontSize: 14 }}>
 {badge.name}
 </div>
 <div style={{ color: '#6b7280', fontSize: 12, marginTop: 3 }}>
 {badge.desc}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )
}