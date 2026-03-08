import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import useAuthStore from '../store/authStore'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
 const [form, setForm] = useState({ email: '', password: ', ' })
 const [loading, setLoading] = useState(false)
 const { login } = useAuthStore()
 const navigate = useNavigate()

 const handleSubmit = async (e) => {
 e.preventDefault()
 setLoading(true)
 try {
 const res = await API.post('/auth/login/', form)
 const { access, refresh } = res.data
 localStorage.setItem('access_token', access)
 localStorage.setItem('refresh_token', refresh)
 const me = await API.get('/auth/me/')
 login(me.data, access, refresh)
 toast.success('Welcome back! 🎉')
 navigate('/dashboard')
 } catch (err) {
 toast.error(err.response?.data?.detail || 'Login failed!')
 } finally {
 setLoading(false)
 }
 }

 return (
 <div style={{
 minHeight: '100vh',
 background: 'linear-gradient(135deg, #eeeeff 0%, #f0e8ff 40%, #e8eeff 100%)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 padding: '1rem',
 fontFamily: "'Inter', sans-serif",
 position: 'relative', overflow: 'hidden',
 }}>
 <style>{`
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
 @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
 @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
 input:focus { outline: none; border-color: #6c47ff!important; box-shadow: 0 0 0 3px rgba(108,71,255,0.12)!important; }
 `}</style>

 {/* BG blobs */}
 <div style={{ position:'fixed', top:-120, right:-80, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)', pointerEvents:'none' }} />
 <div style={{ position:'fixed', bottom:-100, left:-60, width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(108,71,255,0.15), transparent 70%)', pointerEvents:'none' }} />
 <div style={{ position:'fixed', top:'40%', left:'15%', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)', pointerEvents:'none', animation:'float 6s ease-in-out infinite' }} />

 <Toaster toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: 13 } }} />

 <div style={{
 background: 'rgba(255,255,255,0.75)',
 backdropFilter: 'blur(20px)',
 WebkitBackdropFilter: 'blur(20px)',
 borderRadius: 24,
 padding: '2.5rem 2rem',
 width: '100%', maxWidth: 420,
 boxShadow: '0 20px 60px rgba(108,71,255,0.15), 0 4px 20px rgba(0,0,0,0.06)',
 border: '1px solid rgba(255,255,255,0.8)',
 animation: 'fadeUp 0.4s ease both',
 }}>

 {/* Logo */}
 <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
 <div style={{
 width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
 background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 26, boxShadow: '0 8px 24px rgba(108,71,255,0.4)',
 }}>🎓</div>
 <h1 style={{ color: '#000000', fontSize: 22, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
 TJ Tech Academy
 </h1>
 <p style={{ color: '#111827', fontSize: 13, margin: 0 }}>Learn • Build • Grow</p>
 </div>

 {/* Badge */}
 <div style={{
 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
 background: 'linear-gradient(135deg, #ede9fe, #fdf4ff)',
 border: '1px solid #ddd6fe', borderRadius: 100,
 padding: '5px 14px', marginBottom: '1.5rem',
 }}>
 <span style={{ fontSize: 12 }}>⭐</span>
 <span style={{
 fontSize: 12, fontWeight: 700,
 background: 'linear-gradient(90deg, #6c47ff, #a855f7)',
 WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
 }}>#1 Learning Platform for Telugu Students</span>
 </div>

 <h2 style={{ color: '#000000', fontSize: 18, fontWeight: 800, margin: '0 0 6px' }}>Welcome back 👋</h2>
 <p style={{ color: '#111827', fontSize: 13, margin: '0 0 1.5rem' }}>Sign in to continue your journey</p>

 <form onSubmit={handleSubmit}>
 <div style={{ marginBottom: 12 }}>
 <label style={{ color: '#111827', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
 <input
 type="email" placeholder="you@email.com"
 value={form.email}
 onChange={e => setForm({...form, email: e.target.value })}
 required
 style={{
 width: '100%', padding: '11px 14px', boxSizing: 'border-box',
 background: '#f9f8ff', border: '1.5px solid #ede9fe',
 borderRadius: 12, color: '#000000', fontSize: 14,
 fontFamily: 'inherit', transition: 'all 0.15s',
 }}
 />
 </div>

 <div style={{ marginBottom: '1.5rem' }}>
 <label style={{ color: '#111827', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
 <input
 type="password" placeholder="••••••••"
 value={form.password}
 onChange={e => setForm({...form, password: e.target.value })}
 required
 style={{
 width: '100%', padding: '11px 14px', boxSizing: 'border-box',
 background: '#f9f8ff', border: '1.5px solid #ede9fe',
 borderRadius: 12, color: '#000000', fontSize: 14,
 fontFamily: 'inherit', transition: 'all 0.15s',
 }}
 />
 </div>

 <button type="submit" disabled={loading} style={{
 width: '100%', padding: '13px',
 background: loading ? '#c4b5fd' : 'linear-gradient(135deg, #6c47ff, #a855f7)',
 color: '#fff', border: 'none', borderRadius: 12,
 fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
 fontFamily: 'inherit',
 boxShadow: loading ? 'none' : '0 4px 20px rgba(108,71,255,0.4)',
 transition: 'all 0.2s',
 }}
 onMouseEnter={e =>!loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
 onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
 >
 {loading ? '⏳ Signing in...' : 'Sign In →'}
 </button>
 </form>

 {/* Stats */}
 <div style={{
 display: 'flex', justifyContent: 'center', gap: 20,
 marginTop: '1.5rem', paddingTop: '1.2rem',
 borderTop: '1px solid #f0edff',
 }}>
 {[['👥', '10,000+', ''], ['📚', '40+', ''], ['🎓', 'Free', '']].map(([icon, val, label]) => (
 <div key={label} style={{ textAlign: 'center' }}>
 <div style={{ fontSize: 14, marginBottom: 2 }}>{icon}</div>
 <div style={{ color: '#6c47ff', fontSize: 13, fontWeight: 800 }}>{val}</div>
 <div style={{ color: '#111827', fontSize: 10 }}>{label}</div>
 </div>
 ))}
 </div>

 <p style={{ color: '#111827', textAlign: 'center', marginTop: '1.2rem', fontSize: 13 }}>
 Account ?{''}
 <Link to="/register" style={{ color: '#6c47ff', textDecoration: 'none', fontWeight: 700 }}>
 Register 
 </Link>
 </p>
 </div>
 </div>
 )
}