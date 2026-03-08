import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/auth/register/', form)
      toast.success('Registration successful! Please login.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const errors = err.response?.data
      const msg = errors ? Object.values(errors).flat().join(', ') : 'Registration failed!'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eeeeff 0%, #f0e8ff 40%, #e8eeff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <Toaster position="top-center" />

      {/* Blob decorations */}
      <div style={{
        position: 'absolute', width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, #c4b5fd55, transparent)',
        top: -80, left: -80, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, #a5b4fc44, transparent)',
        bottom: -60, right: -60, pointerEvents: 'none',
      }} />

      <div style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid #ede9fe',
        borderRadius: 24,
        padding: '2.5rem',
        width: '100%', maxWidth: 420,
        boxShadow: '0 8px 40px rgba(108,71,255,0.12)',
        position: 'relative', zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, boxShadow: '0 4px 14px rgba(108,71,255,0.35)',
          }}>🎓</div>
          <h2 style={{ color: '#000000', fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>
            Create Account 🚀
          </h2>
          <p style={{ color: '#374151', fontSize: 13, margin: 0 }}>
            TJ Tech Academy తో learning start చేయండి
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Username', key: 'username', type: 'text',     placeholder: 'yourname'     },
            { label: 'Email',    key: 'email',    type: 'email',    placeholder: 'you@email.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••'     },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 16 }}>
              <label style={{
                color: '#000000', fontSize: 12, fontWeight: 700,
                display: 'block', marginBottom: 6,
              }}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                required
                style={{
                  width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                  background: '#faf9ff', border: '1.5px solid #ede9fe',
                  borderRadius: 10, color: '#000000', fontSize: 14,
                  outline: 'none', fontFamily: 'inherit', transition: 'border 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#6c47ff'}
                onBlur={e => e.target.style.borderColor = '#ede9fe'}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', marginTop: 8,
              background: loading
                ? '#ede9fe'
                : 'linear-gradient(135deg, #6c47ff, #a855f7)',
              color: loading ? '#6b7280' : '#fff',
              border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(108,71,255,0.35)',
              transition: 'all 0.15s',
            }}
          >
            {loading ? '⏳ Creating account...' : 'Register →'}
          </button>
        </form>

        <p style={{ color: '#374151', textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          Already account ఉందా?{' '}
          <Link to="/login" style={{ color: '#6c47ff', textDecoration: 'none', fontWeight: 700 }}>
            Login చేయి
          </Link>
        </p>
      </div>
    </div>
  )
}