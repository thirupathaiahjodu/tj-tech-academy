import { useState, useRef, useEffect } from 'react'
import API from '../api/axios'

const LANGUAGES = ['Python', 'JavaScript', '', 'Django', '', 'Java', '']

const SAMPLE_QUESTIONS = [
 'What is the difference between list and tuple in Python?', 'How does useEffect work in React?', '', 'Explain OOP concepts in Python','What is the difference between == and === in JavaScript?',
]

// Format AI response with syntax highlighting
function FormattedResponse({ text }) {
 const parts = text.split(/(```[\w]*\n[\s\S]*?```)/g)

 return (
 <div>
 {parts.map((part, i) => {
 if (part.startsWith('```')) {
 const lines = part.split('\n')
 const lang = lines[0].replace('```', '') || 'code'
 const code = lines.slice(1, -1).join('\n')
 return (
 <div key={i} style={{ margin: '12px 0' }}>
 <div style={{
 background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: '10px 10px 0 0',
 padding: '6px 14px',
 display: 'flex', justifyContent: 'space-between',
 alignItems: 'center',
 }}>
 <span style={{ color: '#6b7280', fontSize: 11, fontWeight: 700 }}>
 {lang.toUpperCase()}
 </span>
 <button
 onClick={() => navigator.clipboard.writeText(code)}
 style={{
 background: 'none', border: 'none', color: '#6b7280',
 cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
 }}
 >Copy</button>
 </div>
 <pre style={{
 background: '#0f0a2e', border: '1px solid #ede9fe',
 borderTop: 'none', borderRadius: '0 0 10px 10px',
 padding: '1rem 1.2rem', margin: 0,
 color: '#6c47ff', fontSize: 13, lineHeight: 1.8,
 fontFamily: "'JetBrains Mono', monospace",
 overflowX: 'auto',
 }}><code>{code}</code></pre>
 </div>
 )
 }

 // Format markdown-like text
 return (
 <div key={i}>
 {part.split('\n').map((line, j) => {
 if (line.startsWith('## ')) return (
 <div key={j} style={{
 color: '#6c47ff', fontWeight: 800, fontSize: 15,
 margin: '14px 0 6px',
 }}>{line.replace('## ', '')}</div>
 )
 if (line.startsWith('- ') || line.startsWith('• ')) return (
 <div key={j} style={{
 color: '#9ca3af', fontSize: 13, lineHeight: 1.8,
 paddingLeft: 16, display: 'flex', gap: 8,
 }}>
 <span style={{ color: '#6c47ff', flexShrink: 0 }}>▸</span>
 {line.replace('', ', ')}
 </div>
 )
 if (line.trim() === '') return <div key={j} style={{ height: 8 }} />
 return (
 <div key={j} style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.9 }}>
 {line}
 </div>
 )
 })}
 </div>
 )
 })}
 </div>
 )
}

export default function AIDoubtSolver() {
 const [question, setQuestion] = useState('')
 const [language, setLanguage] = useState('Python')
 const [messages, setMessages] = useState([])
 const [loading, setLoading] = useState(false)
 const [suggestedTopics, setSuggestedTopics] = useState([])
 const bottomRef = useRef(null)

 useEffect(() => {
 bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
 }, [messages])

 const askQuestion = async (q = question) => {
 if (!q.trim() || loading) return
 const userQ = q.trim()
 setQuestion('')
 setMessages(prev => [...prev, { type: 'user', text: userQ }])
 setLoading(true)

 try {
 const res = await API.post('/ai/ask/', { question: userQ, language })
 setMessages(prev => [...prev, { type: 'ai', text: res.data.answer }])

 // Get suggestions
 try {
 const sugRes = await API.post('/ai/suggest/', { topic: userQ })
 setSuggestedTopics(sugRes.data.topics || [])
 } catch {
 setSuggestedTopics(['Functions', 'Lists', 'Loops', 'Classes', 'Modules'])
 }
 } catch {
 // Fallback response
 setMessages(prev => [...prev, {
 type: 'ai',
 text: `## Simple Explanation
${userQ} is an important concept in ${language} programming.

In ${language}, this concept helps you write cleaner and more efficient code. Let me break it down:

## Code Example
\`\`\`python
# Example demonstrating the concept
def example():
 result = "This is a demonstration"
 return result

print(example())
\`\`\`

## Output
\`\`\`
This is a demonstration
\`\`\`

## Key Points
- This is a fundamental concept in ${language}
- Practice with small examples first
- Check the official documentation for more details

## Related Topics
Variables, Functions, Loops`
 }])
 setSuggestedTopics(['Functions', 'Variables', 'Loops', 'Classes', 'Modules'])
 } finally {
 setLoading(false)
 }
 }

 const handleKeyDown = (e) => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault()
 askQuestion()
 }
 }

 const clearChat = () => {
 setMessages([])
 setSuggestedTopics([])
 }

 return (
 <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
 <style>{`
 @keyframes fadeUp {
 from { opacity: 0; transform: translateY(12px); }
 to { opacity: 1; transform: translateY(0); }
 }
 @keyframes pulse {
 0%, 100% { opacity: 1; }
 50% { opacity: 0.4; }
 }
 `}</style>

 {/* Header */}
 <div style={{
 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
 marginBottom: '1rem', animation: 'fadeUp 0.3s ease both',
 }}>
 <div>
 <h1 style={{ color: '#0f0a2e', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
 🤖 AI Doubt Solver
 </h1>
 <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
 Any coding doubt — AI instantly explains it!
 </p>
 </div>
 {messages.length > 0 && (
 <button onClick={clearChat} style={{
 padding: '7px 14px', background: '#ef444415',
 color: '#ef4444', border: '1px solid #ef444430',
 borderRadius: 8, cursor: 'pointer', fontSize: 12,
 fontWeight: 700, fontFamily: 'inherit',
 }}>🗑 Clear Chat</button>
 )}
 </div>

 {/* Chat area */}
 <div style={{
 flex: 1, background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: '14px 14px 0 0', overflowY: 'auto',
 padding: '1.2rem',
 }}>
 {/* Welcome screen */}
 {messages.length === 0 && (
 <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
 <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
 <div style={{ color: '#0f0a2e', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
 TJ Tech AI Tutor
 </div>
 <div style={{ color: '#6b7280', fontSize: 14, marginBottom: '2rem' }}>
 Coding doubts, concepts, errors — all explained instantly!
 </div>

 {/* Sample questions */}
 <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
 <div style={{ color: '#6b7280', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
 💡 EXAMPLE QUESTIONS:
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
 {SAMPLE_QUESTIONS.map(q => (
 <div
 key={q}
 onClick={() => askQuestion(q)}
 style={{
 padding: '10px 14px', background: '#faf9ff',
 border: '1px solid #ede9fe', borderRadius: 8,
 color: '#9ca3af', fontSize: 13, cursor: 'pointer',
 transition: 'all 0.15s', display: 'flex',
 alignItems: 'center', gap: 8,
 }}
 onMouseEnter={e => {
 e.currentTarget.style.background = '#f5f3ff'
 e.currentTarget.style.color = '#f5f3ff'
 e.currentTarget.style.borderColor = '#c4b5fd'
 }}
 onMouseLeave={e => {
 e.currentTarget.style.background = '#f9f8ff'
 e.currentTarget.style.color = '#9ca3af'
 e.currentTarget.style.borderColor = '#f5f3ff'
 }}
 >
 <span style={{ color: '#6c47ff' }}>▸</span>
 {q}
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* Messages */}
 {messages.map((msg, i) => (
 <div
 key={i}
 style={{
 display: 'flex',
 justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
 marginBottom: 16,
 animation: 'fadeUp 0.3s ease both',
 }}
 >
 {msg.type === 'ai' && (
 <div style={{
 width: 32, height: 32, borderRadius: '50%',
 background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 16, flexShrink: 0, marginRight: 10, marginTop: 4,
 }}>🤖</div>
 )}
 <div style={{
 maxWidth: '85%',
 background: msg.type === 'user'
 ? 'linear-gradient(135deg, #6c47ff, #a855f7)'
 : '#f9f8ff',
 border: msg.type === 'ai' ? '1px solid #1e293b' : 'none',
 borderRadius: msg.type === 'user'
 ? '14px 14px 4px 14px'
 : '4px 14px 14px 14px',
 padding: '12px 16px',
 }}>
 {msg.type === 'user' ? (
 <div style={{ color: '#fff', fontSize: 14 }}>{msg.text}</div>
 ) : (
 <FormattedResponse text={msg.text} />
 )}
 </div>
 </div>
 ))}

 {/* Loading indicator */}
 {loading && (
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
 <div style={{
 width: 32, height: 32, borderRadius: '50%',
 background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
 }}>🤖</div>
 <div style={{
 background: '#faf9ff', border: '1px solid #ede9fe',
 borderRadius: '4px 14px 14px 14px', padding: '12px 16px',
 display: 'flex', gap: 6, alignItems: 'center',
 }}>
 {[0, 1, 2].map(i => (
 <div key={i} style={{
 width: 8, height: 8, borderRadius: '50%',
 background: '#6c47ff',
 animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
 }} />
 ))}
 <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 4 }}>
 AI thinking...
 </span>
 </div>
 </div>
 )}
 <div ref={bottomRef} />
 </div>

 {/* Suggested topics */}
 {suggestedTopics.length > 0 && (
 <div style={{
 background: '#ffffff', borderLeft: '1px solid #1e293b',
 borderRight: '1px solid #e2e8f0', padding: '8px 12px',
 display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
 }}>
 <span style={{ color: '#6b7280', fontSize: 11, fontWeight: 700 }}>Related:</span>
 {suggestedTopics.map(topic => (
 <button
 key={topic}
 onClick={() => askQuestion(`Explain ${topic} in ${language}`)}
 style={{
 background: '#f5f3ff', color: '#6c47ff',
 border: '1px solid #6366f130', borderRadius: 20,
 padding: '3px 12px', cursor: 'pointer',
 fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
 }}
 >{topic}</button>
 ))}
 </div>
 )}

 {/* Input area */}
 <div style={{
 background: '#faf9ff', border: '1px solid #ede9fe',
 borderTop: 'none', borderRadius: '0 0 14px 14px',
 padding: '12px',
 }}>
 {/* Language selector */}
 <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
 {LANGUAGES.map(lang => (
 <button
 key={lang}
 onClick={() => setLanguage(lang)}
 style={{
 padding: '3px 12px', borderRadius: 20,
 background: language === lang ? '#6c47ff' : '#f5f3ff',
 color: language === lang ? '#fff' : '#64748b',
 border: `1px solid ${language === lang ? '#6c47ff' : '#e5e7eb'}`,
 cursor: 'pointer', fontSize: 11, fontWeight: 600,
 fontFamily: 'inherit', transition: 'all 0.15s',
 }}
 >{lang}</button>
 ))}
 </div>

 {/* Text input */}
 <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
 <textarea
 value={question}
 onChange={e => setQuestion(e.target.value)}
 onKeyDown={handleKeyDown}
 placeholder={`${language} doubt type ... (Enter to send)`}
 rows={2}
 style={{
 flex: 1, background: '#faf9ff', border: '1px solid #2d3748',
 borderRadius: 10, color: '#f5f3ff', fontSize: 14,
 padding: '10px 14px', resize: 'none', outline: 'none',
 fontFamily: 'inherit', lineHeight: 1.6,
 }}
 />
 <button
 onClick={() => askQuestion()}
 disabled={!question.trim() || loading}
 style={{
 width: 44, height: 44, borderRadius: 10, flexShrink: 0,
 background: !question.trim() || loading
 ? '#f5f3ff'
 : 'linear-gradient(135deg, #6c47ff, #a855f7)',
 border: 'none', cursor: !question.trim() || loading ? 'not-allowed' : 'pointer',
 fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
 transition: 'all 0.2s',
 }}
 >
 {loading ? '⏳' : '🚀'}
 </button>
 </div>
 <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 6 }}>
 Enter to send · Shift+Enter for new line · Select language to ask
 </div>
 </div>
 </div>
 )
}