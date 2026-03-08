import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

const difficultyColor = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

const categoryIcons = {
  python: '🐍',
  web: '🌐',
  react: '⚛️',
  django: '🦄',
  database: '🗄️',
  dsa: '🧠',
}

// ── Sample fallback data (backend ready olmadan da test cheyyadaniki) ──
const SAMPLE_COURSES = [
  {
    id: 1, title: 'Python Fundamentals', slug: 'python-fundamentals',
    description: 'Complete Python course from scratch. Variables, loops, functions, OOP anni cover avutundi.',
    difficulty: 'beginner', category: 'python', is_premium: false,
    total_duration_hrs: 12, module_count: 6, total_lessons: 42,
    instructor_name: 'DevPath Team',
  },
  {
    id: 2, title: 'React for Beginners', slug: 'react-beginners',
    description: 'Modern React with hooks, state management, routing — real projects tho learn cheyyi.',
    difficulty: 'intermediate', category: 'react', is_premium: false,
    total_duration_hrs: 18, module_count: 8, total_lessons: 56,
    instructor_name: 'DevPath Team',
  },
  {
    id: 3, title: 'Django REST API', slug: 'django-rest-api',
    description: 'Build production-ready APIs with Django, DRF, JWT authentication.',
    difficulty: 'intermediate', category: 'django', is_premium: true,
    total_duration_hrs: 15, module_count: 7, total_lessons: 48,
    instructor_name: 'DevPath Team',
  },
  {
    id: 4, title: 'MySQL Mastery', slug: 'mysql-mastery',
    description: 'Database design, queries, joins, indexing — everything you need for backend development.',
    difficulty: 'beginner', category: 'database', is_premium: false,
    total_duration_hrs: 10, module_count: 5, total_lessons: 35,
    instructor_name: 'DevPath Team',
  },
  {
    id: 5, title: 'DSA with Python', slug: 'dsa-python',
    description: 'Data Structures & Algorithms — arrays, trees, graphs, dynamic programming.',
    difficulty: 'advanced', category: 'dsa', is_premium: true,
    total_duration_hrs: 25, module_count: 10, total_lessons: 72,
    instructor_name: 'DevPath Team',
  },
  {
    id: 6, title: 'Full Stack Web Dev', slug: 'fullstack-web',
    description: 'HTML, CSS, JavaScript — responsive websites build cheyyadam nerchukundaam.',
    difficulty: 'beginner', category: 'web', is_premium: false,
    total_duration_hrs: 20, module_count: 9, total_lessons: 60,
    instructor_name: 'DevPath Team',
  },
]

const CATEGORIES = [
  { value: '', label: 'All', icon: '🔍' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'react', label: 'React', icon: '⚛️' },
  { value: 'django', label: 'Django', icon: '🦄' },
  { value: 'web', label: 'Web', icon: '🌐' },
  { value: 'database', label: 'MySQL', icon: '🗄️' },
  { value: 'dsa', label: 'DSA', icon: '🧠' },
]

const DIFFICULTIES = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

function CourseCard({ course, onClick }) {
  const [hovered, setHovered] = useState(false)
  const dc = difficultyColor[course.difficulty] || '#6366f1'
  const icon = categoryIcons[course.category] || '📚'

  return (
    <div
      onClick={() => onClick(course.slug)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#f5f3ff',
        border: `1px solid ${hovered ? '#6366f150' : '#f0edff'}`,
        borderRadius: 14,
        padding: '1.4rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 8px 30px #6366f120' : 'none',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      {/* Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: dc + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}>{icon}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {course.is_premium && (
            <span style={{
              background: '#eab30818', color: '#eab308',
              border: '1px solid #eab30830',
              borderRadius: 20, padding: '2px 10px', fontSize: 10, fontWeight: 800,
            }}>⭐ PREMIUM</span>
          )}
          <span style={{
            background: dc + '18', color: dc,
            border: `1px solid ${dc}30`,
            borderRadius: 20, padding: '2px 10px', fontSize: 10, fontWeight: 800,
            textTransform: 'capitalize',
          }}>{course.difficulty}</span>
        </div>
      </div>

      {/* Title + desc */}
      <div>
        <div style={{ color: '#0f0a2e', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
          {course.title}
        </div>
        <div style={{
          color: '#64748b', fontSize: 13, lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.description}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', gap: 14,
        paddingTop: 10, borderTop: '1px solid #ede9fe',
      }}>
        {[
          { icon: '📦', val: `${course.module_count} modules` },
          { icon: '📖', val: `${course.total_lessons} lessons` },
          { icon: '⏱️', val: `${course.total_duration_hrs}h` },
        ].map(s => (
          <div key={s.val} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#4b5563', fontSize: 12,
          }}>
            <span>{s.icon}</span> {s.val}
          </div>
        ))}
      </div>

      {/* Instructor + CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#4b5563', fontSize: 12 }}>
          👤 {course.instructor_name}
        </div>
        <div style={{
          background: '#6366f1', color: '#fff',
          borderRadius: 8, padding: '5px 14px',
          fontSize: 12, fontWeight: 700,
        }}>
          {course.is_premium ? '🔒 Unlock' : '▶ Start'}
        </div>
      </div>
    </div>
  )
}

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [showFree, setShowFree] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [category, difficulty, showFree])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = {}
      if (category) params.category = category
      if (difficulty) params.difficulty = difficulty
      if (showFree) params.is_premium = false
      const res = await API.get('/courses/', { params })
      setCourses(res.data.length ? res.data : SAMPLE_COURSES)
    } catch {
      // Backend not connected yet — show sample data
      setCourses(SAMPLE_COURSES)
    } finally {
      setLoading(false)
    }
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 1100 }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem', animation: 'fadeUp 0.4s ease both' }}>
        <h1 style={{ color: '#0f0a2e', fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>
          📚 Explore Courses
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
          {filtered.length} courses available — Mee level ki match ayye course select cheyyi
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1rem', animation: 'fadeUp 0.4s ease 0.05s both' }}>
        <input
          placeholder="🔍  Course search cheyyi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px',
            background: '#f5f3ff', border: '1px solid #1e293b',
            borderRadius: 10, color: '#0f0a2e', fontSize: 14,
            outline: 'none', boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap',
        marginBottom: '1rem', animation: 'fadeUp 0.4s ease 0.1s both',
      }}>
        {CATEGORIES.map(c => (
          <button key={c.value}
            onClick={() => setCategory(c.value)}
            style={{
              padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
              background: category === c.value ? '#6366f1' : '#f5f3ff',
              color: category === c.value ? '#fff' : '#64748b',
              border: `1px solid ${category === c.value ? '#6366f1' : '#f0edff'}`,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >{c.icon} {c.label}</button>
        ))}
      </div>

      {/* Filters row */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'center',
        marginBottom: '1.5rem', animation: 'fadeUp 0.4s ease 0.15s both',
        flexWrap: 'wrap',
      }}>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          style={{
            padding: '7px 14px', background: '#f5f3ff',
            border: '1px solid #1e293b', borderRadius: 8,
            color: '#6b7280', fontSize: 13, cursor: 'pointer',
            fontFamily: 'inherit', outline: 'none',
          }}
        >
          {DIFFICULTIES.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFree(!showFree)}
          style={{
            padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
            background: showFree ? '#10b98120' : '#f5f3ff',
            color: showFree ? '#10b981' : '#64748b',
            border: `1px solid ${showFree ? '#10b98140' : '#f0edff'}`,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          🆓 Free Only
        </button>

        {(category || difficulty || showFree || search) && (
          <button
            onClick={() => { setCategory(''); setDifficulty(''); setShowFree(false); setSearch('') }}
            style={{
              padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
              background: '#ef444415', color: '#ef4444',
              border: '1px solid #ef444430',
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            }}
          >✕ Clear Filters</button>
        )}

        <span style={{ color: '#374151', fontSize: 13, marginLeft: 'auto' }}>
          {filtered.length} results
        </span>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
          Loading courses...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>😕</div>
          No courses found. Filters clear cheyyi.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {filtered.map((course, i) => (
            <div key={course.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
              <CourseCard course={course} onClick={(slug) => navigate(`/courses/${slug}`)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}