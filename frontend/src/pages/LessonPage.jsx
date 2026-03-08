import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

// ── Sample lesson data ─────────────────────────────────────
const SAMPLE_LESSONS = {
  1: {
    id: 1, title: 'What is Python?', duration_mins: 5, is_premium: false,
    content: `What is Python?

Python is a high-level, beginner-friendly programming language created by Guido van Rossum in 1991. It is one of the most popular programming languages in the world, used by companies like Google, Netflix, Instagram, and NASA.

Why Learn Python?

Python is easy to read and write — its syntax is similar to plain English. It is versatile, used in web development, data science, AI, and automation. It has a huge community of millions of developers worldwide, and it is completely free and open source.

Where is Python Used?

1. Web Development — Django, Flask frameworks
2. Data Science & AI — NumPy, Pandas, TensorFlow
3. Automation — automate repetitive tasks
4. Game Development — Pygame library
5. Cybersecurity — ethical hacking tools

Python's Philosophy

Python follows the principle: "Simple is better than complex." Code should be readable and straightforward. This is why Python is the #1 recommended language for beginners worldwide.`,
    code_example: `# Your first Python program
print("Hello, World!")
print("Welcome to DevPath Pro!")

# Python is simple!
name = "Student"
print(f"Hello, {name}! Let's start coding.")`,
    expected_output: `Hello, World!
Welcome to DevPath Pro!
Hello, Student! Let's start coding.`,
  },
  2: {
    id: 2, title: 'Variables & Data Types', duration_mins: 10, is_premium: false,
    content: `Variables & Data Types

A variable is a container that stores data. In Python, you do not need to declare the type — Python figures it out automatically.

Python has 4 main basic data types:

Integer (int) — whole numbers like 1, 100, -5
Float (float) — decimal numbers like 3.14, 9.8
String (str) — text like "Hello", 'Python'
Boolean (bool) — only True or False

Rules for Variable Names

Must start with a letter or underscore. Cannot start with a number. No spaces — use underscore instead (my_name not my name). Variable names are case sensitive (name and Name are different).

Type Checking

Use the type() function to find out what type a variable is.

Type Conversion

You can convert between types using int(), str(), float() functions.`,
    code_example: `# Integer
age = 20
print("Age:", age)
print("Type:", type(age))

# Float
gpa = 8.75
print("GPA:", gpa)

# String
name = "Rahul"
course = "Python Fundamentals"
print("Name:", name)

# Boolean
is_enrolled = True
print("Enrolled:", is_enrolled)

# Multiple assignment
x, y, z = 10, 20, 30
print(x, y, z)

# Type conversion
marks = "95"
marks_int = int(marks)
print("Marks + 5 =", marks_int + 5)`,
    expected_output: `Age: 20
Type: <class 'int'>
GPA: 8.75
Name: Rahul
Enrolled: True
10 20 30
Marks + 5 = 100`,
  },
}

const SAMPLE_SIDEBAR = {
  courseTitle: 'Python Fundamentals',
  slug: 'python-fundamentals',
  modules: [
    {
      id: 1, title: 'Getting Started', lessons: [
        { id: 1, title: 'What is Python?', duration_mins: 5 },
        { id: 2, title: 'Variables & Data Types', duration_mins: 10 },
        { id: 3, title: 'Installing Python & VS Code', duration_mins: 8 },
      ]
    },
    {
      id: 2, title: 'Control Flow', lessons: [
        { id: 4, title: 'If, Elif, Else', duration_mins: 10 },
        { id: 5, title: 'Loops — for and while', duration_mins: 12 },
      ]
    },
    {
      id: 3, title: 'Functions', lessons: [
        { id: 6, title: 'Defining Functions', duration_mins: 15 },
        { id: 7, title: 'Lambda Functions', duration_mins: 12 },
      ]
    },
  ]
}

// ── Code Block component ───────────────────────────────────
function CodeBlock({ code, output }) {
  const [copied, setCopied] = useState(false)
  const [showOutput, setShowOutput] = useState(false)

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{
        background: '#ffffff', border: '1px solid #1e293b',
        borderRadius: '12px 12px 0 0', overflow: 'hidden',
      }}>
        {/* Code header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 16px', borderBottom: '1px solid #ede9fe',
          background: '#ffffff',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
          </div>
          <span style={{ color: '#4b5563', fontSize: 12 }}>Python</span>
          <button
            onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            style={{
              background: copied ? '#10b98120' : '#f0edff',
              color: copied ? '#10b981' : '#64748b',
              border: 'none', borderRadius: 6,
              padding: '3px 10px', cursor: 'pointer',
              fontSize: 11, fontFamily: 'inherit',
            }}
          >{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
        {/* Code */}
        <pre style={{
          margin: 0, padding: '1.2rem 1.4rem',
          color: '#0f0a2e', fontSize: 13.5, lineHeight: 1.8,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          overflowX: 'auto',
        }}><code>{code}</code></pre>
      </div>

      {/* Run button */}
      {output && (
        <>
          <button
            onClick={() => setShowOutput(!showOutput)}
            style={{
              width: '100%', padding: '10px',
              background: showOutput ? '#10b98120' : 'linear-gradient(90deg, #10b981, #059669)',
              color: showOutput ? '#10b981' : '#fff',
              border: `1px solid ${showOutput ? '#10b98140' : 'transparent'}`,
              borderTop: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 700,
              fontFamily: 'inherit',
              borderRadius: showOutput ? 0 : '0 0 12px 12px',
              transition: 'all 0.2s',
            }}
          >
            {showOutput ? '▼ Hide Output' : '▶ Run Code — See Output'}
          </button>

          {showOutput && (
            <div style={{
              background: 'transparent', border: '1px solid #10b98130',
              borderTop: 'none', borderRadius: '0 0 12px 12px',
              padding: '1rem 1.4rem',
            }}>
              <div style={{ color: '#10b981', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                OUTPUT:
              </div>
              <pre style={{
                margin: 0, color: '#6b7280', fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8,
              }}>{output}</pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Notes panel ────────────────────────────────────────────
function NotesPanel({ lessonId, open, onClose }) {
  const [note, setNote] = useState(localStorage.getItem(`note_${lessonId}`) || '')

  const save = () => {
    localStorage.setItem(`note_${lessonId}`, note)
    alert('Notes saved!')
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0, width: 320,
      background: '#ffffff', borderLeft: '1px solid #1e293b',
      padding: '1.4rem', zIndex: 50, display: 'flex', flexDirection: 'column',
      boxShadow: '-8px 0 30px #00000060',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ color: '#0f0a2e', fontWeight: 800, fontSize: 15 }}>📝 My Notes</div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#64748b',
          cursor: 'pointer', fontSize: 18, fontFamily: 'inherit',
        }}>✕</button>
      </div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Lesson notes ikkada raayandi..."
        style={{
          flex: 1, background: '#f5f3ff', border: '1px solid #1e293b',
          borderRadius: 8, color: '#0f0a2e', fontSize: 13,
          padding: '12px', resize: 'none', outline: 'none',
          fontFamily: 'inherit', lineHeight: 1.7,
        }}
      />
      <button onClick={save} style={{
        marginTop: 12, padding: '10px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: '#fff', border: 'none', borderRadius: 8,
        cursor: 'pointer', fontSize: 14, fontWeight: 700,
        fontFamily: 'inherit',
      }}>💾 Save Notes</button>
    </div>
  )
}

// ── Main Lesson Page ───────────────────────────────────────
export default function LessonPage() {
  const { slug, lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [sidebarData, setSidebarData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notesOpen, setNotesOpen] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [expandedModules, setExpandedModules] = useState([1, 2, 3])
  const contentRef = useRef(null)

  useEffect(() => {
    fetchData()
    setCompleted(localStorage.getItem(`completed_${lessonId}`) === 'true')
  }, [lessonId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [lessonRes, courseRes] = await Promise.all([
        API.get(`/courses/lessons/${lessonId}/`),
        API.get(`/courses/${slug}/`),
      ])
      setLesson(lessonRes.data)
      setSidebarData({
        courseTitle: courseRes.data.title,
        slug,
        modules: courseRes.data.modules,
      })
    } catch {
      setLesson(SAMPLE_LESSONS[parseInt(lessonId)] || SAMPLE_LESSONS[1])
      setSidebarData(SAMPLE_SIDEBAR)
    } finally {
      setLoading(false)
    }
  }

  const markComplete = () => {
    localStorage.setItem(`completed_${lessonId}`, 'true')
    setCompleted(true)
  }

  const allLessons = sidebarData?.modules?.flatMap(m => m.lessons) || []
  const currentIdx = allLessons.findIndex(l => l.id === parseInt(lessonId))
  const prevLesson = allLessons[currentIdx - 1]
  const nextLesson = allLessons[currentIdx + 1]

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#64748b' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        Loading lesson...
      </div>
    </div>
  )

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'transparent',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* ── LEFT SIDEBAR ───────────────────────────── */}
      <aside style={{
        width: 280, background: '#ffffff',
        borderRight: '1px solid #1e293b',
        height: '100vh', position: 'sticky', top: 0,
        overflowY: 'auto', flexShrink: 0,
      }}>
        {/* Course title */}
        <div style={{ padding: '1rem 1rem 0.8rem', borderBottom: '1px solid #ede9fe' }}>
          <Link to={`/courses/${slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ color: '#6c47ff', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
              ← BACK TO COURSE
            </div>
          </Link>
          <div style={{ color: '#0f0a2e', fontWeight: 800, fontSize: 14 }}>
            {sidebarData?.courseTitle}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '10px 1rem', borderBottom: '1px solid #ede9fe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ color: '#64748b', fontSize: 11 }}>Progress</span>
            <span style={{ color: '#6c47ff', fontSize: 11, fontWeight: 700 }}>
              {currentIdx + 1}/{allLessons.length}
            </span>
          </div>
          <div style={{ background: '#f0edff', borderRadius: 99, height: 4, overflow: 'hidden' }}>
            <div style={{
              width: `${((currentIdx + 1) / allLessons.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              borderRadius: 99, transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Modules + Lessons */}
        <nav style={{ padding: '0.6rem 0' }}>
          {sidebarData?.modules?.map((mod) => (
            <div key={mod.id}>
              <div
                onClick={() => setExpandedModules(prev =>
                  prev.includes(mod.id) ? prev.filter(x => x !== mod.id) : [...prev, mod.id]
                )}
                style={{
                  padding: '8px 1rem', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <span style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>{mod.title}</span>
                <span style={{ color: '#374151', fontSize: 11 }}>
                  {expandedModules.includes(mod.id) ? '▲' : '▼'}
                </span>
              </div>
              {expandedModules.includes(mod.id) && mod.lessons?.map(l => {
                const isActive = l.id === parseInt(lessonId)
                const isDone = localStorage.getItem(`completed_${l.id}`) === 'true'
                return (
                  <div
                    key={l.id}
                    onClick={() => navigate(`/courses/${slug}/lessons/${l.id}`)}
                    style={{
                      padding: '8px 1rem 8px 1.4rem',
                      cursor: 'pointer',
                      background: isActive ? '#6366f118' : 'transparent',
                      borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                      display: 'flex', alignItems: 'center', gap: 8,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#1e293b30' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontSize: 13, flexShrink: 0 }}>
                      {isDone ? '✅' : isActive ? '▶' : '○'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        color: isActive ? '#a5b4fc' : '#64748b',
                        fontSize: 12, fontWeight: isActive ? 700 : 500,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{l.title}</div>
                      <div style={{ color: '#374151', fontSize: 10 }}>{l.duration_mins} min</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────── */}
      <main ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem', maxWidth: 800 }}>

        {/* Lesson header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '1.5rem',
          flexWrap: 'wrap', gap: 10,
        }}>
          <div>
            <div style={{ color: '#6c47ff', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
              LESSON {currentIdx + 1} OF {allLessons.length}
            </div>
            <h1 style={{ color: '#0f0a2e', fontSize: 26, fontWeight: 800, margin: 0 }}>
              {lesson?.title}
            </h1>
            <div style={{ color: '#4b5563', fontSize: 13, marginTop: 6 }}>
              ⏱ {lesson?.duration_mins} min read
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setNotesOpen(true)}
              style={{
                padding: '8px 14px', background: '#f5f3ff',
                border: '1px solid #1e293b', borderRadius: 8,
                color: '#6b7280', cursor: 'pointer', fontSize: 13,
                fontFamily: 'inherit',
              }}
            >📝 Notes</button>
            {!completed && (
              <button
                onClick={markComplete}
                style={{
                  padding: '8px 14px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none', borderRadius: 8,
                  color: '#fff', cursor: 'pointer', fontSize: 13,
                  fontWeight: 700, fontFamily: 'inherit',
                }}
              >✓ Mark Complete</button>
            )}
            {completed && (
              <div style={{
                padding: '8px 14px', background: '#10b98120',
                border: '1px solid #10b98140', borderRadius: 8,
                color: '#10b981', fontSize: 13, fontWeight: 700,
              }}>✅ Completed</div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#f0edff', marginBottom: '1.5rem' }} />

        {/* Lesson Content */}
        <div style={{ color: '#6b7280', fontSize: 15, lineHeight: 2, marginBottom: '1.5rem' }}>
          {lesson?.content?.split('\n\n').map((para, i) => {
            const isHeading = para.length < 60 && !para.includes('.') && para === para.trim()
            return isHeading ? (
              <h2 key={i} style={{
                color: '#0f0a2e', fontSize: 18, fontWeight: 800,
                margin: '1.8rem 0 0.8rem',
              }}>{para}</h2>
            ) : (
              <p key={i} style={{ margin: '0 0 1rem' }}>{para}</p>
            )
          })}
        </div>

        {/* Code Example */}
        {lesson?.code_example && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ color: '#0f0a2e', fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
              💻 Code Example
            </div>
            <CodeBlock code={lesson.code_example} output={lesson.expected_output} />
          </div>
        )}

        {/* Key Takeaways */}
        <div style={{
          background: '#f5f3ff', border: '1px solid #6366f130',
          borderLeft: '4px solid #6366f1',
          borderRadius: '0 10px 10px 0', padding: '1.2rem 1.4rem',
          marginBottom: '2rem',
        }}>
          <div style={{ color: '#6c47ff', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
            💡 Key Takeaways
          </div>
          <ul style={{ color: '#64748b', fontSize: 13, lineHeight: 2.2, paddingLeft: '1.2rem', margin: 0 }}>
            <li>Understand the concept clearly before moving to next lesson</li>
            <li>Run the code example yourself — modify and experiment</li>
            <li>Use the Notes button to save important points</li>
            <li>Complete the quiz at the end to test your understanding</li>
          </ul>
        </div>

        {/* Prev / Next Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          gap: 12, marginBottom: '2rem',
        }}>
          {prevLesson ? (
            <button
              onClick={() => navigate(`/courses/${slug}/lessons/${prevLesson.id}`)}
              style={{
                flex: 1, padding: '12px 16px', textAlign: 'left',
                background: '#f5f3ff', border: '1px solid #1e293b',
                borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{ color: '#4b5563', fontSize: 11, marginBottom: 4 }}>← PREVIOUS</div>
              <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 700 }}>{prevLesson.title}</div>
            </button>
          ) : <div style={{ flex: 1 }} />}

          {nextLesson ? (
            <button
              onClick={() => { markComplete(); navigate(`/courses/${slug}/lessons/${nextLesson.id}`) }}
              style={{
                flex: 1, padding: '12px 16px', textAlign: 'right',
                background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
                border: '1px solid #6366f140',
                borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{ color: '#6c47ff', fontSize: 11, marginBottom: 4 }}>NEXT →</div>
              <div style={{ color: '#6c47ff', fontSize: 13, fontWeight: 700 }}>{nextLesson.title}</div>
            </button>
          ) : (
            <button style={{
              flex: 1, padding: '12px 16px', textAlign: 'right',
              background: '#10b98120', border: '1px solid #10b98140',
              borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <div style={{ color: '#10b981', fontSize: 13, fontWeight: 700 }}>🎉 Course Complete!</div>
              <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>Certificate download cheyyi</div>
            </button>
          )}
        </div>
      </main>

      {/* Notes Panel */}
      <NotesPanel lessonId={lessonId} open={notesOpen} onClose={() => setNotesOpen(false)} />
    </div>
  )
}