import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

const difficultyColor = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

const categoryIcons = {
  python: '🐍', web: '🌐', react: '⚛️',
  django: '🦄', database: '🗄️', dsa: '🧠',
}

// Sample fallback
const SAMPLE = {
  id: 1, title: 'Python Fundamentals', slug: 'python-fundamentals',
  description: 'Master Python from absolute zero. Variables, loops, functions, OOP — everything covered with real code examples and quizzes.',
  difficulty: 'beginner', category: 'python', is_premium: false,
  total_duration_hrs: 12, instructor_name: 'DevPath Team',
  modules: [
    {
      id: 1, title: 'Getting Started with Python', order: 1,
      lesson_count: 3,
      lessons: [
        { id: 1, title: 'What is Python?', duration_mins: 5, is_premium: false, order: 1 },
        { id: 2, title: 'Installing Python & VS Code', duration_mins: 8, is_premium: false, order: 2 },
        { id: 3, title: 'Variables & Data Types', duration_mins: 10, is_premium: false, order: 3 },
      ]
    },
    {
      id: 2, title: 'Control Flow', order: 2, lesson_count: 2,
      lessons: [
        { id: 4, title: 'If, Elif, Else Statements', duration_mins: 10, is_premium: false, order: 1 },
        { id: 5, title: 'Loops — for and while', duration_mins: 12, is_premium: false, order: 2 },
      ]
    },
    {
      id: 3, title: 'Functions', order: 3, lesson_count: 2,
      lessons: [
        { id: 6, title: 'Defining & Calling Functions', duration_mins: 15, is_premium: false, order: 1 },
        { id: 7, title: 'Lambda & Higher Order Functions', duration_mins: 12, is_premium: true, order: 2 },
      ]
    },
  ]
}

export default function CourseDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState([1])

  useEffect(() => {
    fetchCourse()
  }, [slug])

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/courses/${slug}/`)
      setCourse(res.data)
    } catch {
      setCourse(SAMPLE)
    } finally {
      setLoading(false)
    }
  }

  const toggleModule = (id) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const totalLessons = course?.modules?.reduce((a, m) => a + (m.lesson_count || m.lessons?.length || 0), 0) || 0

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#64748b' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        Loading course...
      </div>
    </div>
  )

  if (!course) return null
  const dc = difficultyColor[course.difficulty] || '#6366f1'
  const icon = categoryIcons[course.category] || '📚'

  return (
    <div style={{ maxWidth: 1000 }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Back button */}
      <button
        onClick={() => navigate('/courses')}
        style={{
          background: 'none', border: 'none', color: '#64748b',
          cursor: 'pointer', fontSize: 14, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'inherit', padding: 0,
        }}
      >← Back to Courses</button>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #6c47ff 0%, #8b5cf6 50%, #a855f7 100%)',
        border: '1px solid #312e81', borderRadius: 16,
        padding: '2rem', marginBottom: '1.5rem',
        animation: 'fadeUp 0.4s ease both',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -60, top: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: '#6366f108',
        }} />
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: dc + '20', border: `1px solid ${dc}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, flexShrink: 0,
          }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{
                background: dc + '20', color: dc, border: `1px solid ${dc}40`,
                borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 800,
                textTransform: 'capitalize',
              }}>{course.difficulty}</span>
              {course.is_premium && (
                <span style={{
                  background: '#eab30820', color: '#eab308', border: '1px solid #eab30840',
                  borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 800,
                }}>⭐ PREMIUM</span>
              )}
            </div>
            <h1 style={{ color: '#0f0a2e', fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>
              {course.title}
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 16px', lineHeight: 1.7 }}>
              {course.description}
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { icon: '📦', val: `${course.modules?.length || 0} Modules` },
                { icon: '📖', val: `${totalLessons} Lessons` },
                { icon: '⏱️', val: `${course.total_duration_hrs}h Total` },
                { icon: '👤', val: course.instructor_name },
              ].map(s => (
                <div key={s.val} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13 }}>
                  <span>{s.icon}</span> {s.val}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enroll button */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: 10 }}>
          <button
            onClick={() => {
              const firstLesson = course.modules?.[0]?.lessons?.[0]
              if (firstLesson) navigate(`/courses/${slug}/lessons/${firstLesson.id}`)
            }}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 20px #6366f140',
            }}
          >
            {course.is_premium && user?.subscription_plan !== 'premium'
              ? '🔒 Unlock Premium'
              : '▶ Start Learning'}
          </button>
          <button style={{
            padding: '12px 20px',
            background: '#f5f3ff', color: '#6b7280',
            border: '1px solid #1e293b', borderRadius: 10,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>🔖 Bookmark</button>
        </div>
      </div>

      {/* Curriculum */}
      <div style={{
        background: '#f5f3ff', border: '1px solid #1e293b',
        borderRadius: 14, padding: '1.4rem',
        animation: 'fadeUp 0.4s ease 0.1s both',
      }}>
        <div style={{ color: '#0f0a2e', fontWeight: 800, fontSize: 16, marginBottom: 16 }}>
          📋 Course Curriculum
        </div>

        {course.modules?.map((mod, mi) => (
          <div key={mod.id} style={{ marginBottom: 8 }}>
            {/* Module header */}
            <div
              onClick={() => toggleModule(mod.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 10,
                background: expandedModules.includes(mod.id) ? '#f0edff' : '#ffffff',
                border: '1px solid #1e293b', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: '#6366f120', color: '#6c47ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800,
                }}>{mi + 1}</span>
                <span style={{ color: '#0f0a2e', fontWeight: 700, fontSize: 14 }}>{mod.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#4b5563', fontSize: 12 }}>
                  {mod.lessons?.length || mod.lesson_count} lessons
                </span>
                <span style={{ color: '#4b5563', fontSize: 12 }}>
                  {expandedModules.includes(mod.id) ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Lessons */}
            {expandedModules.includes(mod.id) && (
              <div style={{ borderLeft: '2px solid #1e293b', marginLeft: 16, marginTop: 2 }}>
                {mod.lessons?.map((lesson, li) => (
                  <div
                    key={lesson.id}
                    onClick={() => navigate(`/courses/${slug}/lessons/${lesson.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 16px', cursor: 'pointer',
                      borderBottom: li < mod.lessons.length - 1 ? '1px solid #0f172a' : 'none',
                      transition: 'background 0.15s',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e293b30'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14 }}>
                        {lesson.is_premium && user?.subscription_plan !== 'premium' ? '🔒' : '▶'}
                      </span>
                      <span style={{ color: lesson.is_premium && user?.subscription_plan !== 'premium' ? '#4b5563' : '#6b7280', fontSize: 13 }}>
                        {lesson.title}
                      </span>
                    </div>
                    <span style={{ color: '#374151', fontSize: 12 }}>{lesson.duration_mins} min</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}