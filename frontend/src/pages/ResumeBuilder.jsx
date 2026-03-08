import { useState, useRef } from 'react'

const EMPTY_RESUME = {
  personal: {
    name: '', email: '', phone: '',
    location: '', linkedin: '', github: '', portfolio: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: { languages: '', frameworks: '', tools: '' },
  projects: [],
  certifications: [],
}

const TEMPLATES = [
  { id: 'modern',       label: '🎨 Modern',       color: '#6c47ff' },
  { id: 'minimal',      label: '⬜ Minimal',       color: '#111827' },
  { id: 'professional', label: '💼 Professional',  color: '#0ea5e9' },
]

const TABS = [
  { id: 'personal',       label: '👤 Personal'      },
  { id: 'experience',     label: '💼 Experience'    },
  { id: 'education',      label: '🎓 Education'     },
  { id: 'skills',         label: '⚡ Skills'        },
  { id: 'projects',       label: '🚀 Projects'      },
  { id: 'certifications', label: '🏅 Certifications'},
]

function InputField({ label, value, onChange, placeholder, multiline, required }) {
  const style = {
    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
    background: '#faf9ff', border: '1.5px solid #ede9fe',
    borderRadius: 8, color: '#000000', fontSize: 13,
    outline: 'none', fontFamily: 'inherit', resize: 'vertical',
    transition: 'border 0.15s',
  }
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ color: '#000000', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 5 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {multiline
        ? <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder} style={style}
            onFocus={e => e.target.style.borderColor = '#6c47ff'}
            onBlur={e => e.target.style.borderColor = '#ede9fe'} />
        : <input value={value} onChange={onChange} placeholder={placeholder} style={style}
            onFocus={e => e.target.style.borderColor = '#6c47ff'}
            onBlur={e => e.target.style.borderColor = '#ede9fe'} />
      }
    </div>
  )
}

// ── RESUME PREVIEW ──────────────────────────────────────────────
function ResumePreview({ data, template }) {
  const accent = TEMPLATES.find(t => t.id === template)?.color || '#6c47ff'
  const p = data.personal

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        borderBottom: `2px solid ${accent}`,
        paddingBottom: 3, marginBottom: 8,
      }}>
        <span style={{ color: accent, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )

  return (
    <div style={{
      background: '#fff', color: '#1a1a1a',
      padding: '28px 32px', fontSize: 12,
      fontFamily: "'Arial', sans-serif",
      minHeight: 600, lineHeight: 1.6,
    }}>
      {/* ── HEADER ── */}
      <div style={{ marginBottom: 16, borderBottom: `3px solid ${accent}`, paddingBottom: 12 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#000000', marginBottom: 4 }}>
          {p.name || 'Your Name'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', color: '#374151', fontSize: 11 }}>
          {p.email    && <span>✉ {p.email}</span>}
          {p.phone    && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.github   && <span>💻 {p.github}</span>}
          {p.portfolio && <span>🌐 {p.portfolio}</span>}
        </div>
      </div>

      {/* ── SUMMARY ── */}
      {p.summary && (
        <Section title="Summary">
          <p style={{ color: '#000000', margin: 0, fontSize: 12 }}>{p.summary}</p>
        </Section>
      )}

      {/* ── EXPERIENCE ── */}
      {data.experience?.length > 0 && (
        <Section title="Experience">
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700, color: '#000000', fontSize: 13 }}>{exp.title || 'Job Title'}</div>
                <div style={{ color: '#374151', fontSize: 11 }}>{exp.period}</div>
              </div>
              <div style={{ color: accent, fontSize: 12, fontWeight: 600 }}>{exp.company}</div>
              {exp.description && <p style={{ color: '#374151', margin: '4px 0 0', fontSize: 11 }}>{exp.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* ── EDUCATION ── */}
      {data.education?.length > 0 && (
        <Section title="Education">
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700, color: '#000000', fontSize: 13 }}>{edu.degree}</div>
                <div style={{ color: '#374151', fontSize: 11 }}>{edu.year}</div>
              </div>
              <div style={{ color: accent, fontSize: 12 }}>{edu.institution}</div>
              {edu.grade && <div style={{ color: '#374151', fontSize: 11 }}>Grade: {edu.grade}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* ── SKILLS ── */}
      {Object.values(data.skills || {}).some(Boolean) && (
        <Section title="Skills">
          {data.skills.languages  && <div style={{ marginBottom: 5 }}><strong style={{ color: '#000' }}>Languages: </strong><span style={{ color: '#374151' }}>{data.skills.languages}</span></div>}
          {data.skills.frameworks && <div style={{ marginBottom: 5 }}><strong style={{ color: '#000' }}>Frameworks: </strong><span style={{ color: '#374151' }}>{data.skills.frameworks}</span></div>}
          {data.skills.tools      && <div style={{ marginBottom: 5 }}><strong style={{ color: '#000' }}>Tools: </strong><span style={{ color: '#374151' }}>{data.skills.tools}</span></div>}
        </Section>
      )}

      {/* ── PROJECTS ── */}
      {data.projects?.length > 0 && (
        <Section title="Projects">
          {data.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, color: '#000000', fontSize: 13 }}>{proj.name}</div>
              {proj.tech && <div style={{ color: accent, fontSize: 11, marginBottom: 3 }}>Tech: {proj.tech}</div>}
              {proj.description && <p style={{ color: '#374151', margin: 0, fontSize: 11 }}>{proj.description}</p>}
              {proj.link && <div style={{ color: accent, fontSize: 11 }}>🔗 {proj.link}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {data.certifications?.length > 0 && (
        <Section title="Certifications">
          {data.certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, color: '#000000', fontSize: 12 }}>{cert.name}</div>
              <div style={{ color: '#374151', fontSize: 11 }}>{cert.year}</div>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────────────
export default function ResumeBuilder() {
  const [resume, setResume]   = useState(EMPTY_RESUME)
  const [template, setTemplate] = useState('modern')
  const [activeTab, setActiveTab] = useState('personal')
  const previewRef = useRef(null)

  const accent = TEMPLATES.find(t => t.id === template)?.color || '#6c47ff'

  const updatePersonal = (field, val) =>
    setResume(r => ({ ...r, personal: { ...r.personal, [field]: val } }))

  const updateSkills = (field, val) =>
    setResume(r => ({ ...r, skills: { ...r.skills, [field]: val } }))

  const addExperience = () => setResume(r => ({
    ...r, experience: [...r.experience, { title: '', company: '', period: '', description: '' }]
  }))
  const updateExperience = (i, field, val) => setResume(r => ({
    ...r, experience: r.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
  }))
  const removeExperience = (i) => setResume(r => ({
    ...r, experience: r.experience.filter((_, idx) => idx !== i)
  }))

  const addEducation = () => setResume(r => ({
    ...r, education: [...r.education, { degree: '', institution: '', year: '', grade: '' }]
  }))
  const updateEducation = (i, field, val) => setResume(r => ({
    ...r, education: r.education.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
  }))
  const removeEducation = (i) => setResume(r => ({
    ...r, education: r.education.filter((_, idx) => idx !== i)
  }))

  const addProject = () => setResume(r => ({
    ...r, projects: [...r.projects, { name: '', tech: '', description: '', link: '' }]
  }))
  const updateProject = (i, field, val) => setResume(r => ({
    ...r, projects: r.projects.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
  }))
  const removeProject = (i) => setResume(r => ({
    ...r, projects: r.projects.filter((_, idx) => idx !== i)
  }))

  const addCert = () => setResume(r => ({
    ...r, certifications: [...r.certifications, { name: '', year: '' }]
  }))
  const updateCert = (i, field, val) => setResume(r => ({
    ...r, certifications: r.certifications.map((c, idx) => idx === i ? { ...c, [field]: val } : c)
  }))
  const removeCert = (i) => setResume(r => ({
    ...r, certifications: r.certifications.filter((_, idx) => idx !== i)
  }))

  const handlePrint = () => {
    const el = previewRef.current
    if (!el) return
    const w = window.open('', '_blank')
    w.document.write(`<html><head><title>Resume</title>
      <style>body{margin:0;padding:0;font-family:Arial,sans-serif;}</style>
      </head><body>${el.innerHTML}</body></html>`)
    w.document.close()
    w.print()
  }

  const btnStyle = (active) => ({
    padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
    fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
    background: active ? `linear-gradient(135deg, #6c47ff, #a855f7)` : '#f5f3ff',
    color: active ? '#fff' : '#6c47ff',
    border: active ? 'none' : '1px solid #ddd6fe',
    transition: 'all 0.15s',
  })

  const addBtn = (onClick, label) => (
    <button onClick={onClick} style={{
      width: '100%', padding: '9px', marginTop: 8,
      background: '#f5f3ff', border: '1.5px dashed #c4b5fd',
      borderRadius: 10, color: '#6c47ff', fontSize: 13,
      fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
    }}>{label}</button>
  )

  const removeBtn = (onClick) => (
    <button onClick={onClick} style={{
      padding: '4px 10px', background: '#fef2f2', color: '#ef4444',
      border: '1px solid #fecaca', borderRadius: 6,
      fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
    }}>Remove</button>
  )

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1200 }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Template selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.2rem', animation: 'fadeUp 0.3s ease both' }}>
        <span style={{ color: '#000000', fontSize: 13, fontWeight: 700 }}>Template:</span>
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => setTemplate(t.id)} style={{
            padding: '7px 16px', borderRadius: 20, cursor: 'pointer',
            fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            background: template === t.id ? `linear-gradient(135deg, #6c47ff, #a855f7)` : '#ffffff',
            color: template === t.id ? '#fff' : '#374151',
            border: template === t.id ? 'none' : '1.5px solid #ede9fe',
            boxShadow: template === t.id ? '0 2px 10px rgba(108,71,255,0.3)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16, animation: 'fadeUp 0.3s ease 0.05s both' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          background: '#ffffff', borderRadius: 18,
          border: '1px solid #ede9fe',
          boxShadow: '0 2px 12px rgba(108,71,255,0.08)',
          overflow: 'hidden',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            borderBottom: '1px solid #ede9fe',
          }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '10px 4px', border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                background: activeTab === tab.id ? '#f5f3ff' : '#fff',
                color: activeTab === tab.id ? '#6c47ff' : '#374151',
                borderBottom: activeTab === tab.id ? `2px solid #6c47ff` : '2px solid transparent',
                transition: 'all 0.15s',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '1.2rem', maxHeight: 520, overflowY: 'auto' }}>

            {/* PERSONAL */}
            {activeTab === 'personal' && (
              <div>
                <InputField label="Full Name" required value={resume.personal.name} onChange={e => updatePersonal('name', e.target.value)} placeholder="Rahul Kumar" />
                <InputField label="Email" required value={resume.personal.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="rahul@email.com" />
                <InputField label="Phone" value={resume.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="+91 9876543210" />
                <InputField label="Location" value={resume.personal.location} onChange={e => updatePersonal('location', e.target.value)} placeholder="Hyderabad, Telangana" />
                <InputField label="LinkedIn" value={resume.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/username" />
                <InputField label="GitHub" value={resume.personal.github} onChange={e => updatePersonal('github', e.target.value)} placeholder="github.com/username" />
                <InputField label="Portfolio" value={resume.personal.portfolio} onChange={e => updatePersonal('portfolio', e.target.value)} placeholder="yourwebsite.com" />
                <InputField label="Professional Summary" multiline value={resume.personal.summary} onChange={e => updatePersonal('summary', e.target.value)} placeholder="2-3 sentences about your skills and experience..." />
              </div>
            )}

            {/* EXPERIENCE */}
            {activeTab === 'experience' && (
              <div>
                {resume.experience.map((exp, i) => (
                  <div key={i} style={{ background: '#faf9ff', border: '1px solid #ede9fe', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#6c47ff', fontSize: 12, fontWeight: 800 }}>Experience #{i + 1}</span>
                      {removeBtn(() => removeExperience(i))}
                    </div>
                    <InputField label="Job Title" value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} placeholder="Software Engineer" />
                    <InputField label="Company" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Google" />
                    <InputField label="Period" value={exp.period} onChange={e => updateExperience(i, 'period', e.target.value)} placeholder="Jan 2023 - Present" />
                    <InputField label="Description" multiline value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} placeholder="Key responsibilities and achievements..." />
                  </div>
                ))}
                {addBtn(addExperience, '+ Add Experience')}
              </div>
            )}

            {/* EDUCATION */}
            {activeTab === 'education' && (
              <div>
                {resume.education.map((edu, i) => (
                  <div key={i} style={{ background: '#faf9ff', border: '1px solid #ede9fe', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#6c47ff', fontSize: 12, fontWeight: 800 }}>Education #{i + 1}</span>
                      {removeBtn(() => removeEducation(i))}
                    </div>
                    <InputField label="Degree" value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="B.Tech Computer Science" />
                    <InputField label="Institution" value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="JNTU Hyderabad" />
                    <InputField label="Year" value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} placeholder="2020 - 2024" />
                    <InputField label="Grade/CGPA" value={edu.grade} onChange={e => updateEducation(i, 'grade', e.target.value)} placeholder="8.5 CGPA" />
                  </div>
                ))}
                {addBtn(addEducation, '+ Add Education')}
              </div>
            )}

            {/* SKILLS */}
            {activeTab === 'skills' && (
              <div>
                <InputField label="Programming Languages" value={resume.skills.languages} onChange={e => updateSkills('languages', e.target.value)} placeholder="Python, JavaScript, Java, C++" />
                <InputField label="Frameworks & Libraries" value={resume.skills.frameworks} onChange={e => updateSkills('frameworks', e.target.value)} placeholder="React, Django, Node.js, FastAPI" />
                <InputField label="Tools & Technologies" value={resume.skills.tools} onChange={e => updateSkills('tools', e.target.value)} placeholder="Git, Docker, AWS, MySQL, VS Code" />
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div>
                {resume.projects.map((proj, i) => (
                  <div key={i} style={{ background: '#faf9ff', border: '1px solid #ede9fe', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#6c47ff', fontSize: 12, fontWeight: 800 }}>Project #{i + 1}</span>
                      {removeBtn(() => removeProject(i))}
                    </div>
                    <InputField label="Project Name" value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} placeholder="E-Commerce Platform" />
                    <InputField label="Tech Stack" value={proj.tech} onChange={e => updateProject(i, 'tech', e.target.value)} placeholder="React, Django, MySQL" />
                    <InputField label="Description" multiline value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} placeholder="Brief description of the project..." />
                    <InputField label="Live Link / GitHub" value={proj.link} onChange={e => updateProject(i, 'link', e.target.value)} placeholder="github.com/username/project" />
                  </div>
                ))}
                {addBtn(addProject, '+ Add Project')}
              </div>
            )}

            {/* CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div>
                {resume.certifications.map((cert, i) => (
                  <div key={i} style={{ background: '#faf9ff', border: '1px solid #ede9fe', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#6c47ff', fontSize: 12, fontWeight: 800 }}>Cert #{i + 1}</span>
                      {removeBtn(() => removeCert(i))}
                    </div>
                    <InputField label="Certification Name" value={cert.name} onChange={e => updateCert(i, 'name', e.target.value)} placeholder="AWS Certified Developer" />
                    <InputField label="Year" value={cert.year} onChange={e => updateCert(i, 'year', e.target.value)} placeholder="2024" />
                  </div>
                ))}
                {addBtn(addCert, '+ Add Certification')}
              </div>
            )}
          </div>

          {/* Download Button */}
          <div style={{ padding: '1rem', borderTop: '1px solid #ede9fe' }}>
            <button onClick={handlePrint} style={{
              width: '100%', padding: '11px',
              background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
              color: '#fff', border: 'none', borderRadius: 12,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(108,71,255,0.35)',
            }}>🖨️ Download / Print PDF</button>
          </div>
        </div>

        {/* ── RIGHT PREVIEW ── */}
        <div style={{
          background: '#ffffff', borderRadius: 18,
          border: '1px solid #ede9fe',
          boxShadow: '0 2px 12px rgba(108,71,255,0.08)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid #ede9fe',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#faf9ff',
          }}>
            <span style={{ color: '#6c47ff', fontSize: 13, fontWeight: 800 }}>👁 LIVE PREVIEW</span>
            <span style={{ color: '#374151', fontSize: 11 }}>Real-time update</span>
          </div>
          <div ref={previewRef} style={{ overflow: 'auto', maxHeight: 620 }}>
            <ResumePreview data={resume} template={template} />
          </div>
        </div>
      </div>
    </div>
  )
}