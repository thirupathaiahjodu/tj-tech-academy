import { useState } from 'react'
import API from '../api/axios'

const CATEGORIES = [
 { id: 'all', label: 'All', icon: '📚' },
 { id: 'python', label: 'Python', icon: '🐍' },
 { id: 'javascript', label: 'JavaScript', icon: '🟨' },
 { id: 'react', label: 'React', icon: '⚛️' },
 { id: 'django', label: 'Django', icon: '🎸' },
 { id: 'sql', label: 'SQL', icon: '🗄️' },
 { id: 'dsa', label: 'DSA', icon: '🧩' },
 { id: 'hr', label: 'HR Round', icon: '🤝' },
]

const DIFFICULTY = ['All', 'Easy', 'Hard']

const QUESTIONS = [
 // Python
 { id: 1, category: 'python', difficulty: 'Easy', question: 'Python list vs tuple ?', answer: 'List mutable (), Tuple immutable (). List [], Tuple (). Tuple faster & memory efficient.' },
 { id: 2, category: 'python', difficulty: 'Easy', question: 'Python *args **kwargs ?', answer: '*args — variable number of positional arguments (tuple ). **kwargs — variable number of keyword arguments (dict ).' },
 { id: 3, category: 'python', difficulty: 'Medium', question: 'Python decorators explain.', answer: 'Decorator function modify function. @symbol use. Example: @login_required, @staticmethod.' },
 { id: 4, category: 'python', difficulty: 'Medium', question: 'Generator vs Iterator ?', answer: 'Iterator — __iter__ __next__ implement object. Generator — yield values lazily produce , memory efficient.' },
 { id: 5, category: 'python', difficulty: 'Hard', question: 'Python GIL (Global Interpreter Lock) ?', answer: 'GIL CPython lock — thread Python bytecode execute. Multi-threading limitation multiprocessing bypass.' },

 // JavaScript
 { id: 6, category: 'javascript', difficulty: 'Easy', question: 'var, let, const.', answer: 'var — function scoped, hoisted. let — block scoped, reassignable. const — block scoped, reassign. Modern JS var avoid.' },
 { id: 7, category: 'javascript', difficulty: 'Easy', question: '== vs === ?', answer: '== — type coercion (5 == "5" → true). === — strict equality, type check (5 === "5" → false). Always ===.' },
 { id: 8, category: 'javascript', difficulty: 'Medium', question: 'Event Loop ? Explain.', answer: 'JS single threaded. Event loop — call stack, Web APIs, callback queue manage. Async operations complete callbacks queue , stack empty execute.' },
 { id: 9, category: 'javascript', difficulty: 'Medium', question: 'Closure ? Example.', answer: 'Closure — inner function outer function variables access , outer function execute. Counter, private variables useful.' },
 { id: 10, category: 'javascript', difficulty: 'Hard', question: 'Promise vs async/await explain.', answer: 'Promise —.then().catch() chain. async/await — syntactic sugar over promises, code cleaner. Error handling try/catch.' },

 // React
 { id: 11, category: 'react', difficulty: 'Easy', question: 'useState useEffect hooks explain.', answer: 'useState — component state manage. useEffect — side effects (API calls, subscriptions) handle. Dependency array when to run control.' },
 { id: 12, category: 'react', difficulty: 'Easy', question: 'Props vs State ?', answer: 'Props — parent child pass , read-only. State — component internal data, mutable, setState update.' },
 { id: 13, category: 'react', difficulty: 'Medium', question: 'React Virtual DOM ?', answer: 'Virtual DOM — real DOM lightweight copy. State change new virtual DOM create , diff algorithm changes find real DOM efficiently update.' },
 { id: 14, category: 'react', difficulty: 'Medium', question: 'useCallback vs useMemo ?', answer: 'useCallback — function memoize (re-render same function reference). useMemo — value memoize (expensive calculations avoid ).' },
 { id: 15, category: 'react', difficulty: 'Hard', question: 'React Reconciliation process explain.', answer: 'Reconciliation — React virtual DOM trees compare process. Key prop list items efficiently update. Fiber architecture incremental rendering possible.' },

 // Django
 { id: 16, category: 'django', difficulty: 'Easy', question: 'Django MTV architecture explain.', answer: 'Model — database layer. Template — presentation layer. View — business logic layer. Django "View" MVC "Controller"' },
 { id: 17, category: 'django', difficulty: 'Medium', question: 'Django ORM ? Advantages.', answer: 'ORM — Object Relational Mapper. SQL Python objects database queries. Database agnostic, SQL injection prevent.' },
 { id: 18, category: 'django', difficulty: 'Medium', question: 'Django middleware ?', answer: 'Middleware — request/response cycle process hooks. Authentication, CSRF protection, session management etc. settings.py MIDDLEWARE list define.' },

 // SQL
 { id: 19, category: 'sql', difficulty: 'Easy', question: 'INNER JOIN vs LEFT JOIN ?', answer: 'INNER JOIN — tables match rows. LEFT JOIN — left table rows + right table match (match NULL).' },
 { id: 20, category: 'sql', difficulty: 'Medium', question: 'SQL indexes ? ?', answer: 'Index — quick data retrieval. WHERE, JOIN, ORDER BY columns create. Write operations slow Read operations fast.' },

 // DSA
 { id: 21, category: 'dsa', difficulty: 'Easy', question: 'Array vs Linked List ?', answer: 'Array — contiguous memory, random access O(1), insert/delete O(n). Linked List — non-contiguous, traversal O(n), insert/delete O(1) at known position.' },
 { id: 22, category: 'dsa', difficulty: 'Medium', question: 'Binary Search explain. Time complexity.', answer: 'Sorted array middle element compare search space half. Time: O(log n), Space: O(1). Array sorted.' },
 { id: 23, category: 'dsa', difficulty: 'Hard', question: 'Dynamic Programming ? Memoization vs Tabulation?', answer: 'DP — overlapping subproblems solve results store. Memoization — top-down (recursion + cache). Tabulation — bottom-up (iterative). Fibonacci, Knapsack classic examples.' },

 // HR
 { id: 24, category: 'hr', difficulty: 'Easy', question: ' (Tell me about yourself)', answer: 'Structure: Present → Past → Future. Present: current skills/role. Past: relevant experience/education. Future: goals aligned with company. 2 minutes concise.' },
 { id: 25, category: 'hr', difficulty: 'Easy', question: ' strengths and weaknesses ?', answer: 'Strength: genuine, job-relevant. Weakness: real weakness improvement. Example: "Time management improve — Pomodoro technique."' },
 { id: 26, category: 'hr', difficulty: 'Medium', question: ' company join ?', answer: 'Company research — products, culture, growth. skills match , company mission inspire. Genuine.' },
]

export default function InterviewPrep() {
 const [selectedCategory, setSelectedCategory] = useState('all')
 const [selectedDifficulty, setSelectedDifficulty] = useState('All')
 const [searchQuery, setSearchQuery] = useState('')
 const [expandedId, setExpandedId] = useState(null)
 const [bookmarked, setBookmarked] = useState(new Set())
 const [aiLoading, setAiLoading] = useState(null)
 const [aiAnswers, setAiAnswers] = useState({})
 const [activeTab, setActiveTab] = useState('questions') // questions | mock

 // Mock interview state
 const [mockStep, setMockStep] = useState(0)
 const [mockAnswers, setMockAnswers] = useState({})
 const [mockFeedback, setMockFeedback] = useState({})
 const [feedbackLoading, setFeedbackLoading] = useState(false)
 const [mockDone, setMockDone] = useState(false)

 const MOCK_QUESTIONS = QUESTIONS.filter(q => q.category!== 'hr').slice(0, 5)

 // Filter questions
 const filtered = QUESTIONS.filter(q => {
 const catMatch = selectedCategory === 'all' || q.category === selectedCategory
 const diffMatch = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty
 const searchMatch =!searchQuery || q.question.toLowerCase().includes(searchQuery.toLowerCase())
 return catMatch && diffMatch && searchMatch
 })

 const toggleBookmark = (id) => {
 setBookmarked(prev => {
 const next = new Set(prev)
 next.has(id) ? next.delete(id) : next.add(id)
 return next
 })
 }

 const getAIAnswer = async (q) => {
 setAiLoading(q.id)
 try {
 const res = await API.post('/ai/ask/', {
 question: q.question,
 language: q.category,
 })
 setAiAnswers(prev => ({...prev, [q.id]: res.data.answer }))
 } catch {
 setAiAnswers(prev => ({
...prev,
 [q.id]: q.answer + '\n\n💡 (Backend AI connect detailed answer )',
 }))
 } finally {
 setAiLoading(null)
 }
 }

 const submitMockAnswer = async (qId, answer) => {
 if (!answer.trim()) return
 setFeedbackLoading(true)
 try {
 const q = MOCK_QUESTIONS[mockStep]
 const res = await API.post('/ai/ask/', {
 question: `Interview question: "${q.question}"\n\nCandidate answer: "${answer}"\n\nEvaluate this answer and give: 1) Score out of 10, 2) What was good, 3) What to improve. Keep it brief.`,
 language: q.category,
 })
 setMockFeedback(prev => ({...prev, [qId]: res.data.answer }))
 } catch {
 setMockFeedback(prev => ({
...prev,
 [qId]: `✅ Answer received!\n\nModel answer: ${MOCK_QUESTIONS[mockStep].answer}`,
 }))
 } finally {
 setFeedbackLoading(false)
 }
 }

 const difficultyColor = (d) => ({
 Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444'
 })[d] || '#64748b'

 const categoryColor = (c) => ({
 python: '#3b82f6', javascript: '#eab308', react: '#06b6d4',
 django: '#10b981', sql: '#a855f7', dsa: '#6c47ff', hr: '#ec4899',
 })[c] || '#6c47ff'

 return (
 <div style={{ maxWidth: 960, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
 <style>{`
 @keyframes fadeUp {
 from { opacity: 0; transform: translateY(12px); }
 to { opacity: 1; transform: translateY(0); }
 }
 @keyframes slideDown {
 from { opacity: 0; max-height: 0; }
 to { opacity: 1; max-height: 600px; }
 }
 `}</style>

 {/* ── HEADER ── */}
 <div style={{ marginBottom: '1.5rem', animation: 'fadeUp 0.3s ease both' }}>
 <h1 style={{ color: '#0f0a2e', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
 🎯 Interview Prep
 </h1>
 <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
 Top interview questions + AI answers + Mock interview practice!
 </p>
 </div>

 {/* ── STATS ROW ── */}
 <div style={{
 display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
 gap: 10, marginBottom: '1.5rem',
 animation: 'fadeUp 0.3s ease 0.05s both',
 }}>
 {[
 { label: 'Total Questions', value: QUESTIONS.length, icon: '📚', color: '#6c47ff' },
 { label: 'Categories', value: CATEGORIES.length - 1, icon: '🗂️', color: '#10b981' },
 { label: 'Bookmarked', value: bookmarked.size, icon: '🔖', color: '#f59e0b' },
 { label: 'Mock Questions', value: MOCK_QUESTIONS.length, icon: '🎤', color: '#ec4899' },
 ].map(s => (
 <div key={s.label} style={{
 background: '#ffffff', border: `1px solid ${s.color}30`,
 borderRadius: 12, padding: '1rem', textAlign: 'center',
 }}>
 <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
 <div style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value}</div>
 <div style={{ color: '#6b7280', fontSize: 11 }}>{s.label}</div>
 </div>
 ))}
 </div>

 {/* ── MAIN TABS ── */}
 <div style={{
 display: 'flex', gap: 6, marginBottom: '1rem',
 animation: 'fadeUp 0.3s ease 0.1s both',
 }}>
 {[
 { id: 'questions', label: '📚 Questions Bank' },
 { id: 'mock', label: '🎤 Mock Interview' },
 { id: 'bookmarks', label: `🔖 Saved (${bookmarked.size})` },
 ].map(tab => (
 <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
 padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
 background: activeTab === tab.id ? '#6c47ff' : '#f9f8ff',
 color: activeTab === tab.id ? '#fff' : '#64748b',
 border: `1px solid ${activeTab === tab.id ? '#6c47ff' : '#f5f3ff'}`,
 fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
 }}>{tab.label}</button>
 ))}
 </div>

 {/* ── QUESTIONS BANK TAB ── */}
 {activeTab === 'questions' && (
 <div style={{ animation: 'fadeUp 0.2s ease both' }}>
 {/* Search */}
 <input
 value={searchQuery}
 onChange={e => setSearchQuery(e.target.value)}
 placeholder="🔍 Question search..."
 style={{
 width: '100%', padding: '10px 14px', marginBottom: 12,
 background: '#faf9ff', border: '1px solid #ede9fe',
 borderRadius: 10, color: '#0f0a2e', fontSize: 14,
 outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
 }}
 />

 {/* Category tabs */}
 <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
 {CATEGORIES.map(cat => (
 <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{
 padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
 background: selectedCategory === cat.id ? '#6c47ff' : '#f9f8ff',
 color: selectedCategory === cat.id ? '#fff' : '#64748b',
 border: `1px solid ${selectedCategory === cat.id ? '#6c47ff' : '#f5f3ff'}`,
 fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
 }}>{cat.icon} {cat.label}</button>
 ))}
 </div>

 {/* Difficulty filter */}
 <div style={{ display: 'flex', gap: 6, marginBottom: '1rem' }}>
 {DIFFICULTY.map(d => (
 <button key={d} onClick={() => setSelectedDifficulty(d)} style={{
 padding: '5px 14px', borderRadius: 20, cursor: 'pointer',
 background: selectedDifficulty === d
 ? (d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : d === 'Hard' ? '#ef4444' : '#6c47ff')
 : '#f9f8ff',
 color: selectedDifficulty === d ? '#fff' : '#64748b',
 border: `1px solid ${selectedDifficulty === d ? 'transparent' : '#f5f3ff'}`,
 fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
 }}>{d}</button>
 ))}
 <span style={{ color: '#6b7280', fontSize: 12, alignSelf: 'center', marginLeft: 4 }}>
 {filtered.length} questions
 </span>
 </div>

 {/* Questions list */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
 {filtered.map((q, idx) => (
 <div key={q.id} style={{
 background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: 12, overflow: 'hidden',
 animation: `fadeUp 0.2s ease ${idx * 0.03}s both`,
 }}>
 {/* Question row */}
 <div
 onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
 style={{
 display: 'flex', alignItems: 'center', gap: 12,
 padding: '14px 16px', cursor: 'pointer',
 }}
 >
 {/* Category badge */}
 <span style={{
 background: categoryColor(q.category) + '20',
 color: categoryColor(q.category),
 border: `1px solid ${categoryColor(q.category)}40`,
 borderRadius: 6, padding: '2px 8px',
 fontSize: 11, fontWeight: 700, flexShrink: 0,
 }}>
 {CATEGORIES.find(c => c.id === q.category)?.icon} {q.category}
 </span>

 {/* Difficulty */}
 <span style={{
 color: difficultyColor(q.difficulty),
 fontSize: 11, fontWeight: 700, flexShrink: 0,
 }}>● {q.difficulty}</span>

 {/* Question text */}
 <span style={{
 color: '#0f0a2e', fontSize: 14, flex: 1, lineHeight: 1.4,
 }}>{q.question}</span>

 {/* Bookmark + expand */}
 <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
 <button
 onClick={e => { e.stopPropagation(); toggleBookmark(q.id) }}
 style={{
 background: 'none', border: 'none', cursor: 'pointer',
 fontSize: 16, padding: 0,
 opacity: bookmarked.has(q.id) ? 1 : 0.3,
 }}
 >🔖</button>
 <span style={{ color: '#6b7280', fontSize: 16 }}>
 {expandedId === q.id ? '▲' : '▼'}
 </span>
 </div>
 </div>

 {/* Answer panel */}
 {expandedId === q.id && (
 <div style={{
 borderTop: '1px solid #e2e8f0',
 padding: '16px', background: '#ffffff',
 animation: 'slideDown 0.2s ease both',
 }}>
 {/* Default answer */}
 <div style={{
 color: '#9ca3af', fontSize: 14, lineHeight: 1.8,
 marginBottom: 12,
 }}>
 <div style={{
 color: '#10b981', fontSize: 11, fontWeight: 700,
 marginBottom: 8,
 }}>✅ ANSWER</div>
 {aiAnswers[q.id] ? (
 <pre style={{
 whiteSpace: 'pre-wrap', fontFamily: 'inherit',
 margin: 0, color: '#9ca3af', lineHeight: 1.8,
 }}>{aiAnswers[q.id]}</pre>
 ) : (
 q.answer
 )}
 </div>

 {/* AI Answer button */}
 {!aiAnswers[q.id] && (
 <button
 onClick={() => getAIAnswer(q)}
 disabled={aiLoading === q.id}
 style={{
 padding: '7px 16px',
 background: aiLoading === q.id ? '#f5f3ff' : '#f5f3ff',
 color: aiLoading === q.id ? '#4b5563' : '#6c47ff',
 border: '1px solid #6366f140',
 borderRadius: 8, cursor: aiLoading === q.id ? 'not-allowed' : 'pointer',
 fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
 }}
 >
 {aiLoading === q.id ? '⏳ AI thinking...' : '🤖 Get AI Detailed Answer'}
 </button>
 )}
 </div>
 )}
 </div>
 ))}

 {filtered.length === 0 && (
 <div style={{
 textAlign: 'center', padding: '3rem',
 color: '#9ca3af', background: '#ffffff',
 borderRadius: 12, border: '1px solid #ede9fe',
 }}>
 <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
 <div>Questions — filter change </div>
 </div>
 )}
 </div>
 </div>
 )}

 {/* ── MOCK INTERVIEW TAB ── */}
 {activeTab === 'mock' && (
 <div style={{
 background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: 14, padding: '1.5rem',
 animation: 'fadeUp 0.2s ease both',
 }}>
 {!mockDone ? (
 <>
 {/* Progress */}
 <div style={{ marginBottom: '1.5rem' }}>
 <div style={{
 display: 'flex', justifyContent: 'space-between',
 marginBottom: 6, color: '#6b7280', fontSize: 12,
 }}>
 <span>Question {mockStep + 1} of {MOCK_QUESTIONS.length}</span>
 <span>{Math.round(((mockStep) / MOCK_QUESTIONS.length) * 100)}% complete</span>
 </div>
 <div style={{
 height: 6, background: '#faf9ff', borderRadius: 3, overflow: 'hidden',
 }}>
 <div style={{
 height: '100%', borderRadius: 3,
 background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
 width: `${(mockStep / MOCK_QUESTIONS.length) * 100}%`,
 transition: 'width 0.3s ease',
 }} />
 </div>
 </div>

 {/* Current question */}
 {(() => {
 const q = MOCK_QUESTIONS[mockStep]
 const answered = mockAnswers[q.id]
 const feedback = mockFeedback[q.id]

 return (
 <div>
 <div style={{
 display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center',
 }}>
 <span style={{
 background: categoryColor(q.category) + '20',
 color: categoryColor(q.category),
 border: `1px solid ${categoryColor(q.category)}40`,
 borderRadius: 6, padding: '2px 8px',
 fontSize: 11, fontWeight: 700,
 }}>
 {CATEGORIES.find(c => c.id === q.category)?.icon} {q.category}
 </span>
 <span style={{
 color: difficultyColor(q.difficulty), fontSize: 11, fontWeight: 700,
 }}>● {q.difficulty}</span>
 </div>

 <div style={{
 color: '#0f0a2e', fontSize: 16, fontWeight: 600,
 marginBottom: '1.5rem', lineHeight: 1.5,
 }}>
 🎤 {q.question}
 </div>

 {/* Answer textarea */}
 {!feedback && (
 <>
 <textarea
 value={mockAnswers[q.id] || ''}
 onChange={e => setMockAnswers(prev => ({...prev, [q.id]: e.target.value }))}
 placeholder=" answer type... (2-3 sentences minimum)"
 rows={5}
 style={{
 width: '100%', padding: '12px',
 background: '#faf9ff', border: '1px solid #ede9fe',
 borderRadius: 10, color: '#0f0a2e', fontSize: 14,
 outline: 'none', fontFamily: 'inherit',
 resize: 'vertical', boxSizing: 'border-box',
 lineHeight: 1.6,
 }}
 />
 <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
 <button
 onClick={() => submitMockAnswer(q.id, mockAnswers[q.id] || '')}
 disabled={feedbackLoading ||!mockAnswers[q.id]?.trim()}
 style={{
 padding: '10px 24px',
 background: feedbackLoading ? '#f5f3ff'
 : 'linear-gradient(135deg, #6c47ff, #a855f7)',
 color: feedbackLoading ? '#4b5563' : '#fff',
 border: 'none', borderRadius: 8,
 cursor: feedbackLoading ? 'not-allowed' : 'pointer',
 fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
 }}
 >
 {feedbackLoading ? '⏳ Evaluating...' : '✅ Submit Answer'}
 </button>
 <button
 onClick={() => {
 setMockAnswers(prev => ({...prev, [q.id]: '' }))
 setMockFeedback(prev => ({...prev, [q.id]: q.answer }))
 }}
 style={{
 padding: '10px 18px', background: '#faf9ff',
 color: '#6b7280', border: '1px solid #ede9fe',
 borderRadius: 8, cursor: 'pointer',
 fontSize: 13, fontFamily: 'inherit',
 }}
 >💡 Skip (Show Answer)</button>
 </div>
 </>
 )}

 {/* Feedback */}
 {feedback && (
 <div style={{
 background: '#faf9ff', border: '1px solid #10b98140',
 borderRadius: 10, padding: '1rem', marginTop: 10,
 }}>
 <div style={{
 color: '#10b981', fontSize: 12, fontWeight: 700, marginBottom: 8,
 }}>🤖 AI FEEDBACK</div>
 <pre style={{
 color: '#9ca3af', fontSize: 13, lineHeight: 1.8,
 whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0,
 }}>{feedback}</pre>

 <button
 onClick={() => {
 if (mockStep < MOCK_QUESTIONS.length - 1) {
 setMockStep(s => s + 1)
 } else {
 setMockDone(true)
 }
 }}
 style={{
 marginTop: 12, padding: '9px 20px',
 background: 'linear-gradient(135deg, #10b981, #059669)',
 color: '#fff', border: 'none', borderRadius: 8,
 cursor: 'pointer', fontSize: 13, fontWeight: 700,
 fontFamily: 'inherit',
 }}
 >
 {mockStep < MOCK_QUESTIONS.length - 1 ? 'Next Question →' : '🎉 Finish Mock Interview'}
 </button>
 </div>
 )}
 </div>
 )
 })()}
 </>
 ) : (
 // Mock complete screen
 <div style={{ textAlign: 'center', padding: '2rem' }}>
 <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
 <h2 style={{ color: '#0f0a2e', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
 Mock Interview Complete!
 </h2>
 <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
 {MOCK_QUESTIONS.length} questions answer — Great job!
 </p>
 <button
 onClick={() => {
 setMockStep(0)
 setMockAnswers({})
 setMockFeedback({})
 setMockDone(false)
 }}
 style={{
 padding: '12px 28px',
 background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
 color: '#fff', border: 'none', borderRadius: 10,
 cursor: 'pointer', fontSize: 15, fontWeight: 700,
 fontFamily: 'inherit',
 }}
 >🔄 Restart Mock Interview</button>
 </div>
 )}
 </div>
 )}

 {/* ── BOOKMARKS TAB ── */}
 {activeTab === 'bookmarks' && (
 <div style={{ animation: 'fadeUp 0.2s ease both' }}>
 {bookmarked.size === 0 ? (
 <div style={{
 textAlign: 'center', padding: '3rem',
 background: '#ffffff', borderRadius: 14,
 border: '1px solid #ede9fe', color: '#9ca3af',
 }}>
 <div style={{ fontSize: 40, marginBottom: 10 }}>🔖</div>
 <div style={{ fontSize: 14 }}>No bookmarks yet!</div>
 <div style={{ fontSize: 12, marginTop: 4, color: '#0f0a2e' }}>
 Questions 🔖 click save 
 </div>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
 {QUESTIONS.filter(q => bookmarked.has(q.id)).map(q => (
 <div key={q.id} style={{
 background: '#ffffff', border: '1px solid #f59e0b30',
 borderRadius: 12, padding: '14px 16px',
 display: 'flex', alignItems: 'center', gap: 12,
 }}>
 <span style={{
 background: categoryColor(q.category) + '20',
 color: categoryColor(q.category),
 borderRadius: 6, padding: '2px 8px',
 fontSize: 11, fontWeight: 700, flexShrink: 0,
 }}>
 {CATEGORIES.find(c => c.id === q.category)?.icon} {q.category}
 </span>
 <span style={{ color: '#0f0a2e', fontSize: 14, flex: 1 }}>
 {q.question}
 </span>
 <button
 onClick={() => toggleBookmark(q.id)}
 style={{
 background: '#ef444420', color: '#ef4444',
 border: '1px solid #ef444430', borderRadius: 6,
 padding: '3px 10px', cursor: 'pointer',
 fontSize: 11, fontFamily: 'inherit',
 }}
 >Remove</button>
 </div>
 ))}
 </div>
 )}
 </div>
 )}
 </div>
 )
}