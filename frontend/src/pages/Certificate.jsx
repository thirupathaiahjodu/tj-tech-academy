import { useState, useRef, useEffect, useCallback } from 'react'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

const COURSES = [
  'Python Fundamentals', 'JavaScript Essentials',
  'Django REST Framework', 'Data Structures & Algorithms',
  'React Complete Guide', 'Machine Learning Basics',
]

const TEMPLATES = [
  { id: 'gold',   label: '🥇 Gold',   bg: '#fffbeb', border: '#f59e0b', accent: '#b45309', text: '#78350f',  sub: '#92400e'  },
  { id: 'purple', label: '💜 Purple', bg: '#fdf4ff', border: '#a855f7', accent: '#7c3aed', text: '#3b0764',  sub: '#6b21a8'  },
  { id: 'blue',   label: '💙 Blue',   bg: '#eff6ff', border: '#3b82f6', accent: '#1d4ed8', text: '#1e3a8a',  sub: '#1e40af'  },
]

function draw(canvas, data, tplId) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = canvas.width   // 800
  const H = canvas.height  // 580
  const T = TEMPLATES.find(x => x.id === tplId) || TEMPLATES[0]

  // ── clear
  ctx.clearRect(0, 0, W, H)

  // ── background
  ctx.fillStyle = T.bg
  ctx.fillRect(0, 0, W, H)

  // ── outer border (thick)
  ctx.strokeStyle = T.border
  ctx.lineWidth = 7
  ctx.strokeRect(14, 14, W - 28, H - 28)

  // ── inner border (thin)
  ctx.strokeStyle = T.accent
  ctx.lineWidth = 1.5
  ctx.strokeRect(28, 28, W - 56, H - 56)

  // ── corner circles
  const corners = [[46, 46], [W-46, 46], [46, H-46], [W-46, H-46]]
  corners.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, 11, 0, Math.PI * 2)
    ctx.fillStyle = T.border
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
  })

  // ── top decorative line
  ctx.fillStyle = T.accent
  ctx.fillRect(W/2 - 90, 68, 180, 3)

  // ── academy name
  ctx.textAlign = 'center'
  ctx.font = 'bold 17px Arial'
  ctx.fillStyle = T.accent
  ctx.fillText('🎓  TJ Tech Academy', W/2, 98)

  // ── title
  ctx.font = 'bold 34px Georgia'
  ctx.fillStyle = T.text
  ctx.fillText('Certificate of Completion', W/2, 158)

  // ── divider
  ctx.fillStyle = T.border
  ctx.fillRect(W/2 - 220, 172, 440, 2)

  // ── certify text
  ctx.font = 'italic 16px Georgia'
  ctx.fillStyle = T.sub
  ctx.fillText('This is to certify that', W/2, 210)

  // ── student name
  const nameText = data.name || 'Student Name'
  ctx.font = 'bold 40px Georgia'
  ctx.fillStyle = T.accent
  ctx.fillText(nameText, W/2, 264)

  // ── name underline
  const nw = ctx.measureText(nameText).width
  ctx.fillStyle = T.border
  ctx.fillRect(W/2 - nw/2, 272, nw, 2)

  // ── completion text
  ctx.font = '16px Georgia'
  ctx.fillStyle = T.sub
  ctx.fillText('has successfully completed the course', W/2, 308)

  // ── course name
  ctx.font = 'bold 24px Georgia'
  ctx.fillStyle = T.text
  ctx.fillText(data.course || 'Course Name', W/2, 348)

  // ── score
  if (data.score) {
    ctx.font = '15px Arial'
    ctx.fillStyle = T.sub
    ctx.fillText(`with a score of ${data.score}%`, W/2, 378)
  }

  // ── horizontal rule
  ctx.fillStyle = T.border
  ctx.fillRect(W/2 - 260, 400, 520, 1)

  // ── date & cert id
  ctx.font = '13px Arial'
  ctx.fillStyle = T.text
  ctx.textAlign = 'left'
  ctx.fillText(`📅 Date: ${data.date}`, 100, 428)
  ctx.textAlign = 'right'
  ctx.fillText(`🆔 Cert ID: ${data.cert_id}`, W - 100, 428)

  // ── signature lines
  ctx.strokeStyle = T.border
  ctx.lineWidth = 1
  ctx.textAlign = 'center'

  ctx.beginPath(); ctx.moveTo(110, 500); ctx.lineTo(270, 500); ctx.stroke()
  ctx.font = '12px Arial'; ctx.fillStyle = T.sub
  ctx.fillText('Instructor', 190, 518)
  ctx.font = 'bold 13px Arial'; ctx.fillStyle = T.text
  ctx.fillText('TJ Tech Team', 190, 534)

  ctx.beginPath(); ctx.moveTo(W-270, 500); ctx.lineTo(W-110, 500); ctx.stroke()
  ctx.font = '12px Arial'; ctx.fillStyle = T.sub
  ctx.fillText('Platform', W-190, 518)
  ctx.font = 'bold 13px Arial'; ctx.fillStyle = T.text
  ctx.fillText('TJ Tech Academy', W-190, 534)

  // ── center seal
  ctx.beginPath()
  ctx.arc(W/2, 508, 26, 0, Math.PI * 2)
  ctx.strokeStyle = T.border
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = T.bg
  ctx.fill()
  ctx.font = '22px serif'
  ctx.textAlign = 'center'
  ctx.fillText('🏆', W/2, 516)

  // ── bottom line
  ctx.fillStyle = T.accent
  ctx.fillRect(W/2 - 90, H - 50, 180, 2)
  ctx.font = '11px Arial'
  ctx.fillStyle = T.sub
  ctx.textAlign = 'center'
  ctx.fillText('tjtechacademy.com  •  Verified Certificate', W/2, H - 30)
}

// ─────────────────────────────────────────────
export default function Certificate() {
  const { user } = useAuthStore()
  const canvasRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    course: COURSES[0],
    score: '95',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    cert_id: `TJTECH-${Date.now().toString(36).toUpperCase()}`,
  })
  const [template, setTemplate] = useState('gold')
  const [generating, setGenerating] = useState(false)
  const [myCerts, setMyCerts] = useState([])

  // set name when user loads
  useEffect(() => {
    if (user) {
      const n = user.first_name
        ? `${user.first_name} ${user.last_name || ''}`.trim()
        : user.username || ''
      if (n) setForm(f => ({ ...f, name: n }))
    }
  }, [user])

  // draw whenever form / template changes
  const redraw = useCallback(() => {
    draw(canvasRef.current, form, template)
  }, [form, template])

  useEffect(() => {
    // wait 1 frame so canvas is in DOM
    const id = requestAnimationFrame(redraw)
    return () => cancelAnimationFrame(id)
  }, [redraw])

  useEffect(() => {
    API.get('/certificates/').then(r => setMyCerts(r.data)).catch(() => {})
  }, [])

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const downloadPNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = `${form.name || 'Certificate'}_${form.course}.png`
    a.href = canvas.toDataURL('image/png', 1.0)
    a.click()
  }

  const saveCert = async () => {
    setGenerating(true)
    try {
      await API.post('/certificates/generate/', { course_name: form.course, score: form.score, template })
      alert('Certificate saved!')
    } catch { downloadPNG() }
    finally { setGenerating(false) }
  }

  const inp = {
    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
    background: '#faf9ff', border: '1.5px solid #ede9fe',
    borderRadius: 8, color: '#000', fontSize: 13,
    outline: 'none', fontFamily: 'inherit',
  }
  const lbl = { color: '#000', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 5 }

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", maxWidth: 1180 }}>
      <style>{`@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ marginBottom: '1rem', animation: 'fu .3s ease both' }}>
        <h1 style={{ color: '#000', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>🎓 Certificate Generator</h1>
        <p style={{ color: '#374151', fontSize: 13, margin: 0 }}>Complete your course and download your certificate!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, animation: 'fu .3s ease .05s both' }}>

        {/* ── LEFT FORM ── */}
        <div style={{ background: '#fff', border: '1px solid #ede9fe', borderRadius: 16, padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div style={{ color: '#6c47ff', fontSize: 13, fontWeight: 800 }}>✏️ Certificate Details</div>

          <div>
            <label style={lbl}>STUDENT NAME</label>
            <input placeholder="Your full name" value={form.name} onChange={e => update('name', e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>SCORE (%)</label>
            <input type="number" placeholder="95" value={form.score} onChange={e => update('score', e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>DATE</label>
            <input value={form.date} onChange={e => update('date', e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>COURSE NAME</label>
            <select value={form.course} onChange={e => update('course', e.target.value)} style={inp}>
              {COURSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={lbl}>TEMPLATE</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)} style={{
                  flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer',
                  background: template === t.id ? t.border + '22' : '#f9f8ff',
                  color: template === t.id ? t.accent : '#374151',
                  border: `1.5px solid ${template === t.id ? t.border : '#ede9fe'}`,
                  fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          <button onClick={() => update('cert_id', `TJTECH-${Date.now().toString(36).toUpperCase()}`)}
            style={{ padding: '8px', background: '#f5f3ff', color: '#6c47ff', border: '1px solid #ddd6fe', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>
            🔄 New Certificate ID
          </button>

          <button onClick={downloadPNG} style={{
            padding: '11px', background: 'linear-gradient(135deg,#6c47ff,#a855f7)',
            color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: '0 4px 14px rgba(108,71,255,.35)',
          }}>⬇️ Download PNG</button>

          <button onClick={saveCert} disabled={generating} style={{
            padding: '11px',
            background: generating ? '#f5f3ff' : '#f0fdf4',
            color: generating ? '#6b7280' : '#10b981',
            border: `1px solid ${generating ? '#ede9fe' : '#bbf7d0'}`,
            borderRadius: 10, cursor: generating ? 'not-allowed' : 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
          }}>{generating ? '⏳ Saving...' : '💾 Save Certificate'}</button>
        </div>

        {/* ── RIGHT PREVIEW ── */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #ede9fe', borderRadius: 16, padding: '1rem', marginBottom: 12 }}>
            <div style={{ color: '#6c47ff', fontSize: 11, fontWeight: 800, marginBottom: 10, textAlign: 'center', letterSpacing: 1 }}>
              LIVE PREVIEW — Real-time update
            </div>
            <canvas
              ref={canvasRef}
              width={800}
              height={580}
              style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block', boxShadow: '0 4px 16px rgba(108,71,255,.12)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { navigator.clipboard.writeText(`I completed ${form.course} on TJ Tech Academy! 🎓 #TJTechAcademy`); alert('Copied!') }}
              style={{ flex: 1, padding: '10px', background: '#f5f3ff', color: '#374151', border: '1px solid #ede9fe', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
              📋 Copy Share Text
            </button>
            <button onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=https://tjtechacademy.com', '_blank')}
              style={{ flex: 1, padding: '10px', background: '#eff6ff', color: '#0a66c2', border: '1px solid #bfdbfe', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>
              🔗 LinkedIn
            </button>
            <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I completed ${form.course} on TJ Tech Academy! 🎓 #TJTechAcademy`)}`, '_blank')}
              style={{ flex: 1, padding: '10px', background: '#f0f9ff', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>
              🐦 Twitter
            </button>
          </div>
        </div>
      </div>

      {myCerts.length > 0 && (
        <div style={{ marginTop: 20, background: '#fff', border: '1px solid #ede9fe', borderRadius: 16, padding: '1.2rem' }}>
          <div style={{ color: '#6c47ff', fontSize: 13, fontWeight: 800, marginBottom: 12 }}>🏆 My Certificates ({myCerts.length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {myCerts.map((cert, i) => (
              <div key={i} style={{ background: '#faf9ff', border: '1px solid #ede9fe', borderRadius: 10, padding: '12px' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🎓</div>
                <div style={{ color: '#000', fontSize: 13, fontWeight: 700 }}>{cert.course_name}</div>
                <div style={{ color: '#374151', fontSize: 11, marginTop: 3 }}>{cert.issued_date}</div>
                <div style={{ color: '#10b981', fontSize: 11, fontWeight: 700 }}>Score: {cert.score}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}