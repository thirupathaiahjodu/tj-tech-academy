import { useState, useEffect } from 'react'
import API from '../api/axios'

// ── Sample data — backend connect అయినప్పుడు replace అవుతుంది
const SAMPLE = {
  stats: {
    total_users:    1247,
    active_today:    89,
    total_courses:   24,
    total_revenue:  48500,
    new_users_week:  143,
    certificates:    312,
    avg_completion:  67,
    premium_users:   289,
  },
  weekly_signups: [32, 45, 28, 67, 54, 89, 143],
  weekly_revenue: [4200, 6800, 3900, 8100, 7200, 9400, 8900],
  top_courses: [
    { name: 'Python Fundamentals',      enrolled: 423, completion: 78, revenue: 12600 },
    { name: 'JavaScript Essentials',    enrolled: 389, completion: 71, revenue: 11200 },
    { name: 'React Development',        enrolled: 298, completion: 65, revenue: 9800  },
    { name: 'Django REST Framework',    enrolled: 201, completion: 58, revenue: 7400  },
    { name: 'Full Stack Development',   enrolled: 176, completion: 52, revenue: 6500  },
  ],
  recent_users: [
    { name: 'Rahul Sharma',   email: 'rahul@gmail.com',  plan: 'premium', joined: '2 hrs ago',  courses: 4 },
    { name: 'Priya Reddy',    email: 'priya@gmail.com',  plan: 'free',    joined: '5 hrs ago',  courses: 2 },
    { name: 'Arjun Kumar',    email: 'arjun@gmail.com',  plan: 'pro',     joined: '8 hrs ago',  courses: 7 },
    { name: 'Sneha Patel',    email: 'sneha@gmail.com',  plan: 'premium', joined: '1 day ago',  courses: 3 },
    { name: 'Kiran Babu',     email: 'kiran@gmail.com',  plan: 'free',    joined: '1 day ago',  courses: 1 },
  ],
  plan_distribution: { free: 68, premium: 23, pro: 9 },
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const PLAN_COLORS = {
  free:    { bg: '#10b98120', text: '#10b981', border: '#10b98140' },
  premium: { bg: '#f59e0b20', text: '#f59e0b', border: '#f59e0b40' },
  pro:     { bg: '#f5f3ff', text: '#6c47ff', border: '#c4b5fd' },
}

function MiniBarChart({ data, color, height = 60 }) {
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{
            width: '100%',
            height: `${(val / max) * (height - 16)}px`,
            background: color,
            borderRadius: '3px 3px 0 0',
            opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.5,
            transition: 'height 0.4s ease',
          }} />
          <span style={{ color: '#9ca3af', fontSize: 9 }}>{DAYS[i]}</span>
        </div>
      ))}
    </div>
  )
}

function StatCard({ icon, label, value, sub, color, chart, chartColor }) {
  return (
    <div style={{
      background: '#ffffff', border: `1px solid ${color}30`,
      borderRadius: 14, padding: '1.1rem',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: color + '15', filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: color + '20', border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>{icon}</div>
        {sub && (
          <span style={{
            background: '#10b98115', color: '#10b981',
            border: '1px solid #10b98130', borderRadius: 20,
            padding: '2px 8px', fontSize: 11, fontWeight: 700,
          }}>{sub}</span>
        )}
      </div>

      <div>
        <div style={{ color: '#f5f3ff', fontSize: 26, fontWeight: 800, lineHeight: 1 }}>
          {typeof value === 'number' && value > 999
            ? value.toLocaleString('en-IN')
            : value}
        </div>
        <div style={{ color: '#6b7280', fontSize: 12, marginTop: 3 }}>{label}</div>
      </div>

      {chart && (
        <MiniBarChart data={chart} color={chartColor || color} height={55} />
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData]       = useState(SAMPLE)
  const [tab, setTab]         = useState('overview')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await API.get('/admin/analytics/')
        setData(res.data)
      } catch {
        // sample data use చెయ్యి
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const { stats, weekly_signups, weekly_revenue, top_courses, recent_users, plan_distribution } = data

  return (
    <div style={{ maxWidth: 1100, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem',
        animation: 'fadeUp 0.3s ease both',
      }}>
        <div>
          <h1 style={{ color: '#f5f3ff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
            📊 Admin Analytics
          </h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
            TJ Tech Academy — Platform Overview
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading && (
            <span style={{
              color: '#6c47ff', fontSize: 12,
              animation: 'pulse 1s infinite',
            }}>⏳ Loading...</span>
          )}
          <div style={{
            background: '#10b98115', border: '1px solid #10b98130',
            color: '#10b981', borderRadius: 20, padding: '4px 12px',
            fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#10b981', animation: 'pulse 2s infinite',
            }} />
            Live Data
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: '1.2rem',
        animation: 'fadeUp 0.3s ease 0.05s both',
      }}>
        {[
          { id: 'overview', label: '📈 Overview' },
          { id: 'users',    label: '👥 Users' },
          { id: 'courses',  label: '📚 Courses' },
          { id: 'revenue',  label: '💰 Revenue' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '7px 16px', borderRadius: 20, cursor: 'pointer',
            background: tab === t.id ? '#6c47ff' : '#f9f8ff',
            color: tab === t.id ? '#fff' : '#64748b',
            border: `1px solid ${tab === t.id ? '#6c47ff' : '#f5f3ff'}`,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ══════════════ OVERVIEW TAB ══════════════ */}
      {tab === 'overview' && (
        <div style={{ animation: 'fadeUp 0.25s ease both' }}>

          {/* Stats Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12, marginBottom: 14,
          }}>
            <StatCard icon="👥" label="Total Users"     value={stats.total_users}    color="#6c47ff" sub={`+${stats.new_users_week} this week`} chart={weekly_signups} chartColor="#6c47ff" />
            <StatCard icon="💰" label="Total Revenue"   value={`₹${(stats.total_revenue/1000).toFixed(1)}K`} color="#10b981" sub="↑ 18% MoM"  chart={weekly_revenue}  chartColor="#10b981" />
            <StatCard icon="📚" label="Total Courses"   value={stats.total_courses}  color="#f59e0b" />
            <StatCard icon="🎓" label="Certificates"    value={stats.certificates}   color="#ec4899" sub="Issued" />
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12, marginBottom: 14,
          }}>
            <StatCard icon="🟢" label="Active Today"    value={stats.active_today}   color="#10b981" />
            <StatCard icon="⭐" label="Premium Users"   value={stats.premium_users}  color="#f59e0b" sub={`${Math.round(stats.premium_users/stats.total_users*100)}% of total`} />
            <StatCard icon="📈" label="Avg Completion"  value={`${stats.avg_completion}%`} color="#a855f7" />
            <StatCard icon="🔥" label="New This Week"   value={stats.new_users_week} color="#ef4444" sub="Users" />
          </div>

          {/* Plan Distribution */}
          <div style={{
            background: '#ffffff', border: '1px solid #ede9fe',
            borderRadius: 14, padding: '1.2rem', marginBottom: 14,
          }}>
            <div style={{ color: '#6c47ff', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
              💎 Plan Distribution
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              {Object.entries(plan_distribution).map(([plan, pct]) => (
                <div key={plan} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    fontSize: 24, fontWeight: 800,
                    color: PLAN_COLORS[plan]?.text,
                  }}>{pct}%</div>
                  <div style={{ color: '#6b7280', fontSize: 12, textTransform: 'capitalize' }}>
                    {plan}
                  </div>
                </div>
              ))}
            </div>
            {/* Stacked bar */}
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 12 }}>
              <div style={{ width: `${plan_distribution.free}%`,    background: '#10b981' }} />
              <div style={{ width: `${plan_distribution.premium}%`, background: '#f59e0b' }} />
              <div style={{ width: `${plan_distribution.pro}%`,     background: '#6c47ff' }} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              {[['#10b981','Free'],['#f59e0b','Premium'],['#6c47ff','Pro']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                  <span style={{ color: '#6b7280', fontSize: 11 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly signups chart */}
          <div style={{
            background: '#ffffff', border: '1px solid #ede9fe',
            borderRadius: 14, padding: '1.2rem',
          }}>
            <div style={{ color: '#6c47ff', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
              📅 Weekly New Signups
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
              {weekly_signups.map((val, i) => {
                const max = Math.max(...weekly_signups)
                const h = Math.round((val / max) * 80)
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#6b7280', fontSize: 10 }}>{val}</span>
                    <div style={{
                      width: '100%', height: h,
                      background: i === 6
                        ? 'linear-gradient(180deg, #6366f1, #8b5cf6)'
                        : '#ddd6fe',
                      border: i === 6 ? 'none' : '1px solid #6366f130',
                      borderRadius: '4px 4px 0 0',
                    }} />
                    <span style={{ color: '#9ca3af', fontSize: 10 }}>{DAYS[i]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ USERS TAB ══════════════ */}
      {tab === 'users' && (
        <div style={{ animation: 'fadeUp 0.25s ease both' }}>
          <div style={{
            background: '#ffffff', border: '1px solid #ede9fe',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{
              padding: '1rem 1.2rem', borderBottom: '1px solid #e2e8f0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: '#6c47ff', fontSize: 13, fontWeight: 700 }}>
                👥 Recent Users
              </span>
              <span style={{ color: '#6b7280', fontSize: 12 }}>
                Total: {stats.total_users.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
              padding: '8px 16px', background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
            }}>
              {['Name', 'Email', 'Plan', 'Courses', 'Joined'].map(h => (
                <span key={h} style={{ color: '#9ca3af', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
                  {h.toUpperCase()}
                </span>
              ))}
            </div>

            {recent_users.map((u, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                padding: '12px 16px',
                borderBottom: i < recent_users.length - 1 ? '1px solid #0f172a' : 'none',
                alignItems: 'center',
                animation: `fadeUp 0.2s ease ${i * 0.04}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0,
                  }}>
                    {u.name[0]}
                  </div>
                  <span style={{ color: '#f5f3ff', fontSize: 13, fontWeight: 600 }}>{u.name}</span>
                </div>
                <span style={{ color: '#6b7280', fontSize: 12 }}>{u.email}</span>
                <span style={{
                  display: 'inline-flex', padding: '2px 8px', borderRadius: 10,
                  background: PLAN_COLORS[u.plan]?.bg,
                  color: PLAN_COLORS[u.plan]?.text,
                  border: `1px solid ${PLAN_COLORS[u.plan]?.border}`,
                  fontSize: 11, fontWeight: 700, textTransform: 'capitalize',
                  width: 'fit-content',
                }}>{u.plan}</span>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>{u.courses}</span>
                <span style={{ color: '#6b7280', fontSize: 12 }}>{u.joined}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════ COURSES TAB ══════════════ */}
      {tab === 'courses' && (
        <div style={{ animation: 'fadeUp 0.25s ease both' }}>
          <div style={{
            background: '#ffffff', border: '1px solid #ede9fe',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{
              padding: '1rem 1.2rem', borderBottom: '1px solid #e2e8f0',
            }}>
              <span style={{ color: '#6c47ff', fontSize: 13, fontWeight: 700 }}>
                📚 Top Performing Courses
              </span>
            </div>

            {top_courses.map((course, i) => (
              <div key={i} style={{
                padding: '14px 16px',
                borderBottom: i < top_courses.length - 1 ? '1px solid #0f172a' : 'none',
                animation: `fadeUp 0.2s ease ${i * 0.05}s both`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: '#f5f3ff', color: '#6c47ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, border: '1px solid #6366f130',
                    }}>#{i + 1}</span>
                    <span style={{ color: '#f5f3ff', fontSize: 14, fontWeight: 700 }}>
                      {course.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ color: '#10b981', fontSize: 13, fontWeight: 700 }}>
                      ₹{course.revenue.toLocaleString('en-IN')}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>
                      {course.enrolled} enrolled
                    </span>
                  </div>
                </div>

                {/* Completion bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    flex: 1, height: 6, background: '#faf9ff',
                    borderRadius: 3, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${course.completion}%`,
                      height: '100%',
                      background: course.completion > 70
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : course.completion > 55
                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                        : 'linear-gradient(90deg, #6366f1, #818cf8)',
                      borderRadius: 3,
                    }} />
                  </div>
                  <span style={{ color: '#6b7280', fontSize: 11, width: 36 }}>
                    {course.completion}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════ REVENUE TAB ══════════════ */}
      {tab === 'revenue' && (
        <div style={{ animation: 'fadeUp 0.25s ease both' }}>
          {/* Revenue stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12, marginBottom: 14,
          }}>
            <StatCard icon="💰" label="Total Revenue"    value={`₹${(stats.total_revenue/1000).toFixed(1)}K`} color="#10b981" />
            <StatCard icon="⭐" label="Premium Revenue"  value={`₹${Math.round(stats.total_revenue * 0.65 / 1000)}K`}  color="#f59e0b" />
            <StatCard icon="💎" label="Pro Revenue"      value={`₹${Math.round(stats.total_revenue * 0.35 / 1000)}K`}  color="#6c47ff" />
          </div>

          {/* Weekly revenue bar chart */}
          <div style={{
            background: '#ffffff', border: '1px solid #ede9fe',
            borderRadius: 14, padding: '1.2rem',
          }}>
            <div style={{ color: '#6c47ff', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
              💹 Weekly Revenue (₹)
            </div>
            <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 14 }}>
              This week total: ₹{weekly_revenue[6].toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {weekly_revenue.map((val, i) => {
                const max = Math.max(...weekly_revenue)
                const h = Math.round((val / max) * 95)
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#6b7280', fontSize: 9 }}>
                      ₹{(val / 1000).toFixed(1)}K
                    </span>
                    <div style={{
                      width: '100%', height: h,
                      background: i === 6
                        ? 'linear-gradient(180deg, #10b981, #34d399)'
                        : '#10b98130',
                      border: i === 6 ? 'none' : '1px solid #10b98130',
                      borderRadius: '4px 4px 0 0',
                    }} />
                    <span style={{ color: '#9ca3af', fontSize: 10 }}>{DAYS[i]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}