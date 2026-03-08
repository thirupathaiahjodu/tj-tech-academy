import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'

const LANGUAGES = [
 { id: 'python', label: 'Python', icon: '🐍', monaco: 'python' },
 { id: 'javascript', label: 'JavaScript', icon: '🟨', monaco: 'javascript' },
 { id: 'html', label: 'HTML', icon: '🌐', monaco: 'html' },
 { id: 'css', label: 'CSS', icon: '🎨', monaco: 'css' },
 { id: 'sql', label: 'SQL', icon: '🗄️', monaco: 'sql' },
]

const STARTER_CODE = {
 python: `# Python Playground — TJ Tech Academy Pro
# Code , Run!

def greet(name):
 return f"Hello, {name}! Welcome to TJ Tech Academy Pro 🚀"

# Example 1: Greeting
print(greet("Student"))

# Example 2: List operations
courses = ["Python", "React""Django", "MySQL"]
print("\\nAvailable courses:")
for i, course in enumerate(courses, 1):
 print(f" {i}. {course}")

# Example 3: Simple calculator
def calculator(a, b, op):
 if op == '+': return a + b
 if op == '': return a - b
 if op == '*': return a * b
 if op == '/': return a / b if b!= 0 else "Error: Division by zero"

print("\\nCalculator:")
print(f"10 + 5 = {calculator(10, 5, '+')}")
print(f"10 * 3 = {calculator(10, 3, '*')}")
`,
 javascript: `// JavaScript Playground — TJ Tech Academy Pro

// Example 1: Arrow functions
const greet = (name) => \`Hello, \${name}! Welcome to TJ Tech Academy Pro 🚀\`
console.log(greet("Student"))

// Example 2: Array methods
const courses = ["Python", "React""Django", "MySQL"]
console.log("\\nAvailable courses:")
courses.forEach((course, i) => console.log(\` \${i+1}. \${course}\`))

// Example 3: Object
const student = {
 name: "Rahul",
 age: 20,
 skills: ["Python", "React"],
 greet() {
 return \`Hi! I'm \${this.name}, I know \${this.skills.join(" and ")}\`
 }
}
console.log("\\n" + student.greet())
`,
 html: `<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <title>TJ Tech Academy Pro — HTML Playground</title>
 <style>
 body {
 font-family: 'Segoe UI', sans-serif;
 background: #020817;
 color: #e2e8f0;
 padding: 2rem;
 margin: 0;
 }
.card {
 background: #0f172a;
 border: 1px solid #1e293b;
 border-radius: 12px;
 padding: 1.5rem;
 max-width: 500px;
 }
 h1 { color: #a5b4fc; }
.btn {
 background: linear-gradient(135deg, #6c47ff, #a855f7);
 color: white;
 border: none;
 padding: 10px 20px;
 border-radius: 8px;
 cursor: pointer;
 font-size: 14px;
 }
 </style>
</head>
<body>
 <div class="card">
 <h1>🚀 TJ Tech Academy Pro</h1>
 <p>HTML Playground first webpage!</p>
 <button class="btn" onclick="alert('Hello from TJ Tech Academy! 👋')">
 Click Me!
 </button>
 </div>
</body>
</html>`,
 css: `/* CSS Playground — TJ Tech Academy Pro */

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
 font-family: 'Segoe UI', sans-serif;
 background: #020817;
 display: flex;
 justify-content: center;
 align-items: center;
 min-height: 100vh;
}

.card {
 background: linear-gradient(135deg, #f5f3ff, #ffffff);
 border: 1px solid #6366f140;
 border-radius: 16px;
 padding: 2rem;
 text-align: center;
 animation: fadeIn 0.5s ease;
 max-width: 400px;
}

@keyframes fadeIn {
 from { opacity: 0; transform: translateY(20px); }
 to { opacity: 1; transform: translateY(0); }
}

.title {
 color: #a5b4fc;
 font-size: 24px;
 font-weight: 800;
 margin-bottom: 1rem;
}`,
 sql: `-- SQL Playground — TJ Tech Academy Pro

-- Create students table
CREATE TABLE students (
 id INT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(100) UNIQUE,
 course VARCHAR(50),
 score INT,
 enrolled_at DATE
);

-- Insert sample data
INSERT INTO students (name, email, course, score, enrolled_at) VALUES
('Rahul Kumar', 'rahul@example.com', 92, '2024-01-15'),
('Priya Singh', 'priya@example.com', 88, '2024-01-20'),
('Arjun Patel', 'arjun@example.com', 75, '2024-02-01'),
('Sneha Reddy', 'sneha@example.com', 95, '2024-02-10');

-- Query 1: All students
SELECT * FROM students;

-- Query 2: Top scorers
SELECT name, course, score
FROM students
WHERE score >= 85
ORDER BY score DESC;`,
}

const SAVED_KEY = 'TJ Tech Academy_saved_snippets'

export default function Playground() {
 const [language, setLanguage] = useState('python')
 const [code, setCode] = useState(STARTER_CODE['python'])
 const [output, setOutput] = useState('')
 const [running, setRunning] = useState(false)
 const [activeTab, setActiveTab] = useState('output')
 const [snippetName, setSnippetName] = useState('')
 const [savedSnippets, setSavedSnippets] = useState(
 JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
 )
 const [theme, setTheme] = useState('vs-dark')
 const editorRef = useRef(null)

 const handleLanguageChange = (lang) => {
 setLanguage(lang)
 setCode(STARTER_CODE[lang])
 setOutput('')
 }

 // ── MAIN RUN FUNCTION ──────────────────────────────────────────
 const runCode = async () => {
 setRunning(true)
 setOutput('')
 setActiveTab('output')

 // HTML, CSS, SQL — browser directly run 
 if (['html', 'css'].includes(language)) {
 const msgs = {
 html: '🌐 HTML Preview — index.html save browser open!',
 css: '🎨 CSS — HTML file <style> tag paste!',
 sql: '🗄️ SQL — MySQL Workbench run!',
 }
 setOutput(msgs[language])
 setRunning(false)
 return
 }

 // ── JavaScript — browser instantly run! ──
 if (language === 'javascript') {
 try {
 const logs = []
 const fakeConsole = {
 log: (...args) => logs.push(
 args.map(a =>
 typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
 ).join('')
 ),
 error: (...args) => logs.push('❌ ' + args.map(String).join(', ')),
 warn: (...args) => logs.push('⚠️ ' + args.map(String).join(', ')),
 info: (...args) => logs.push('ℹ️ ' + args.map(String).join(', ')),
 }
 // eslint-disable-next-line no-new-func
 await new Function('console', `return (async () => { ${code} })()`)(fakeConsole)
 setOutput(logs.join('\n') || '(No output — console.log() )')
 } catch (err) {
 setOutput('❌ JavaScript Error:\n' + err.message)
 }
 setRunning(false)
 return
 }

 // ── Python — Pyodide browser run! ──
 if (language === 'python') {
 try {
 setOutput('⏳ Python environment loading...\n(First time 10-15 seconds...)')

 // Pyodide already loaded check
 if (!window.pyodide) {
 if (!window.loadPyodide) {
 await new Promise((resolve, reject) => {
 const script = document.createElement('script')
 script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
 script.onload = resolve
 script.onerror = () => reject(new Error('CDN load failed'))
 document.head.appendChild(script)
 })
 }
 window.pyodide = await window.loadPyodide({
 indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
 })
 }

 // Output capture
 let captured = ''
 window.pyodide.setStdout({
 batched: (text) => { captured += text + '\n' }
 })
 window.pyodide.setStderr({
 batched: (text) => { captured += '❌ ' + text + '\n' }
 })

 // Python code run
 await window.pyodide.runPythonAsync(code)
 setOutput(captured.trim() || '(No output — print() )')

 } catch (err) {
 if (err.message?.includes('CDN load failed')) {
 setOutput('❌ Internet connection check!\nPyodide CDN load.')
 } else {
 setOutput('❌ Python Error:\n' + err.message)
 }
 }
 setRunning(false)
 }
 }

 // ── SNIPPET FUNCTIONS ──────────────────────────────────────────
 const saveSnippet = () => {
 if (!snippetName.trim()) {
 alert('Snippet name enter!')
 return
 }
 const snippet = {
 id: Date.now(),
 name: snippetName,
 language,
 code,
 savedAt: new Date().toLocaleDateString(),
 }
 const updated = [snippet,...savedSnippets]
 setSavedSnippets(updated)
 localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
 setSnippetName('')
 setActiveTab('saved')
 alert('✅ Snippet saved!')
 }

 const loadSnippet = (snippet) => {
 setLanguage(snippet.language)
 setCode(snippet.code)
 setActiveTab('output')
 setOutput('')
 }

 const deleteSnippet = (id) => {
 const updated = savedSnippets.filter(s => s.id!== id)
 setSavedSnippets(updated)
 localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
 }

 const resetCode = () => {
 setCode(STARTER_CODE[language])
 setOutput('')
 }

 // ── RENDER ────────────────────────────────────────────────────
 return (
 <div style={{ maxWidth: 1200, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
 <style>{`
 @keyframes fadeUp {
 from { opacity: 0; transform: translateY(12px); }
 to { opacity: 1; transform: translateY(0); }
 }
 `}</style>

 {/* ── HEADER ── */}
 <div style={{
 display: 'flex', justifyContent: 'space-between',
 alignItems: 'center', marginBottom: '1rem',
 animation: 'fadeUp 0.3s ease both',
 flexWrap: 'wrap', gap: 10,
 }}>
 <div>
 <h1 style={{ color: '#0f0a2e', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
 💻 Code Playground
 </h1>
 <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
 Code , Run , Save — Experiment!
 </p>
 </div>
 <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
 <input
 value={snippetName}
 onChange={e => setSnippetName(e.target.value)}
 onKeyDown={e => e.key === 'Enter' && saveSnippet()}
 placeholder="Snippet name..."
 style={{
 padding: '7px 12px', background: '#faf9ff',
 border: '1px solid #ede9fe', borderRadius: 8,
 color: '#0f0a2e', fontSize: 13, outline: 'none',
 fontFamily: 'inherit', width: 160,
 }}
 />
 <button onClick={saveSnippet} style={{
 padding: '7px 14px', background: '#10b98120',
 color: '#10b981', border: '1px solid #10b98140',
 borderRadius: 8, cursor: 'pointer',
 fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
 }}>💾 Save</button>
 <button onClick={resetCode} style={{
 padding: '7px 14px', background: '#faf9ff',
 color: '#6b7280', border: '1px solid #ede9fe',
 borderRadius: 8, cursor: 'pointer',
 fontSize: 13, fontFamily: 'inherit',
 }}>↺ Reset</button>
 </div>
 </div>

 {/* ── LANGUAGE TABS ── */}
 <div style={{
 display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap',
 animation: 'fadeUp 0.3s ease 0.05s both',
 }}>
 {LANGUAGES.map(lang => (
 <button
 key={lang.id}
 onClick={() => handleLanguageChange(lang.id)}
 style={{
 padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
 background: language === lang.id ? '#6c47ff' : '#f9f8ff',
 color: language === lang.id ? '#fff' : '#64748b',
 border: `1px solid ${language === lang.id ? '#6c47ff' : '#f5f3ff'}`,
 fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
 transition: 'all 0.15s',
 }}
 >{lang.icon} {lang.label}</button>
 ))}
 </div>

 {/* ── MAIN GRID ── */}
 <div style={{
 display: 'grid', gridTemplateColumns: '1fr 400px',
 gap: 12, animation: 'fadeUp 0.3s ease 0.1s both',
 }}>

 {/* ── EDITOR PANEL ── */}
 <div style={{
 background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: 14, overflow: 'hidden',
 }}>
 {/* Editor top bar */}
 <div style={{
 display: 'flex', justifyContent: 'space-between',
 alignItems: 'center', padding: '10px 16px',
 background: '#ffffff', borderBottom: '1px solid #e2e8f0',
 }}>
 <div style={{ display: 'flex', gap: 6 }}>
 <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
 <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
 <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
 </div>
 <span style={{ color: '#6b7280', fontSize: 12 }}>
 {LANGUAGES.find(l => l.id === language)?.icon}{''}
 {language === 'javascript' ? 'script.js'
 : language === 'python' ? 'main.py'
 : language === 'html' ? 'index.html'
 : language === 'css' ? 'style.css'
 : 'query.sql'}
 </span>
 <div style={{ display: 'flex', gap: 6 }}>
 <button
 onClick={() => setTheme(t => t === 'vs-dark' ? 'light' : 'vs-dark')}
 style={{
 background: '#faf9ff', border: 'none', borderRadius: 6,
 color: '#6b7280', cursor: 'pointer', padding: '3px 8px',
 fontSize: 11, fontFamily: 'inherit',
 }}
 >{theme === 'vs-dark' ? '☀️ Light' : '🌙 Dark'}</button>
 <button
 onClick={() => navigator.clipboard.writeText(code)}
 style={{
 background: '#faf9ff', border: 'none', borderRadius: 6,
 color: '#6b7280', cursor: 'pointer', padding: '3px 8px',
 fontSize: 11, fontFamily: 'inherit',
 }}
 >📋 Copy</button>
 </div>
 </div>

 {/* Monaco Editor */}
 <Editor
 height="460px"
 language={LANGUAGES.find(l => l.id === language)?.monaco}
 value={code}
 theme={theme}
 onChange={(val) => setCode(val || '')}
 onMount={(editor) => { editorRef.current = editor }}
 options={{
 fontSize: 14,
 fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
 minimap: { enabled: false },
 scrollBeyondLastLine: false,
 lineNumbers: 'on',
 roundedSelection: true,
 padding: { top: 16 },
 cursorStyle: 'line',
 automaticLayout: true,
 tabSize: 4,
 wordWrap: 'on',
 }}
 />

 {/* Run Button */}
 <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
 <button
 onClick={runCode}
 disabled={running}
 style={{
 width: '100%', padding: '12px',
 background: running
 ? '#f5f3ff'
 : 'linear-gradient(135deg, #10b981, #059669)',
 color: running ? '#4b5563' : '#fff',
 border: 'none', borderRadius: 10,
 fontSize: 15, fontWeight: 800,
 cursor: running ? 'not-allowed' : 'pointer',
 fontFamily: 'inherit', transition: 'all 0.2s',
 display: 'flex', alignItems: 'center',
 justifyContent: 'center', gap: 8,
 }}
 >
 {running ? <><span>⏳</span> Running...</> : <><span>▶</span> Run Code</>}
 </button>
 </div>
 </div>

 {/* ── OUTPUT + SAVED PANEL ── */}
 <div style={{
 background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: 14, overflow: 'hidden',
 display: 'flex', flexDirection: 'column',
 }}>
 {/* Tabs */}
 <div style={{
 display: 'flex', borderBottom: '1px solid #e2e8f0',
 background: '#ffffff', flexShrink: 0,
 }}>
 {[
 { id: 'output', label: '▶ Output' },
 { id: 'saved', label: `💾 Saved (${savedSnippets.length})` },
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 style={{
 flex: 1, padding: '10px',
 background: activeTab === tab.id ? '#ffffff' : 'transparent',
 color: activeTab === tab.id ? '#6c47ff' : '#4b5563',
 border: 'none',
 borderBottom: activeTab === tab.id
 ? '2px solid #6366f1' : '2px solid transparent',
 cursor: 'pointer', fontSize: 13, fontWeight: 600,
 fontFamily: 'inherit',
 }}
 >{tab.label}</button>
 ))}
 </div>

 {/* Output Tab */}
 {activeTab === 'output' && (
 <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
 <div style={{
 padding: '8px 14px', borderBottom: '1px solid #e2e8f0',
 display: 'flex', justifyContent: 'space-between',
 alignItems: 'center', flexShrink: 0,
 }}>
 <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700 }}>
 OUTPUT CONSOLE
 </span>
 {output && (
 <button onClick={() => setOutput('')} style={{
 background: 'none', border: 'none', color: '#6b7280',
 cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
 }}>🗑 Clear</button>
 )}
 </div>
 <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', minHeight: 400 }}>
 {!output &&!running && (
 <div style={{ textAlign: 'center', paddingTop: '4rem', color: '#9ca3af' }}>
 <div style={{ fontSize: 40, marginBottom: 12 }}>▶</div>
 <div style={{ fontSize: 13 }}>Run — output </div>
 <div style={{ fontSize: 11, marginTop: 6, color: '#0f0a2e' }}>
 Python & JavaScript supported ✅
 </div>
 </div>
 )}
 {running && (
 <div style={{ textAlign: 'center', paddingTop: '4rem', color: '#6b7280' }}>
 <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
 <div style={{ fontSize: 13 }}>Executing...</div>
 {language === 'python' && (
 <div style={{ fontSize: 11, marginTop: 6, color: '#6b7280' }}>
 First time time 
 </div>
 )}
 </div>
 )}
 {output &&!running && (
 <pre style={{
 color: output.startsWith('❌') ? '#ef4444' : '#9ca3af',
 fontSize: 13, lineHeight: 1.9, margin: 0,
 fontFamily: "'JetBrains Mono', monospace",
 whiteSpace: 'pre-wrap', wordBreak: 'break-word',
 }}>{output}</pre>
 )}
 </div>
 </div>
 )}

 {/* Saved Tab */}
 {activeTab === 'saved' && (
 <div style={{ flex: 1, overflowY: 'auto', padding: '0.8rem' }}>
 {savedSnippets.length === 0 ? (
 <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#9ca3af' }}>
 <div style={{ fontSize: 36, marginBottom: 10 }}>💾</div>
 <div style={{ fontSize: 13 }}>No saved snippets yet</div>
 <div style={{ fontSize: 11, marginTop: 4, color: '#0f0a2e' }}>
 Code name Save!
 </div>
 </div>
 ) : (
 savedSnippets.map(s => (
 <div key={s.id} style={{
 background: '#faf9ff', border: '1px solid #ede9fe',
 borderRadius: 8, padding: '10px 12px', marginBottom: 8,
 }}>
 <div style={{
 display: 'flex', justifyContent: 'space-between',
 alignItems: 'center', marginBottom: 6,
 }}>
 <div style={{
 color: '#0f0a2e', fontSize: 13, fontWeight: 700,
 overflow: 'hidden', textOverflow: 'ellipsis',
 whiteSpace: 'nowrap', maxWidth: 160,
 }}>{s.name}</div>
 <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
 <button onClick={() => loadSnippet(s)} style={{
 background: '#f5f3ff', color: '#6c47ff',
 border: '1px solid #6366f130', borderRadius: 4,
 padding: '2px 8px', cursor: 'pointer',
 fontSize: 11, fontFamily: 'inherit',
 }}>▶ Load</button>
 <button onClick={() => deleteSnippet(s.id)} style={{
 background: '#ef444415', color: '#ef4444',
 border: '1px solid #ef444430', borderRadius: 4,
 padding: '2px 8px', cursor: 'pointer',
 fontSize: 11, fontFamily: 'inherit',
 }}>🗑</button>
 </div>
 </div>
 <div style={{ color: '#6b7280', fontSize: 11 }}>
 {LANGUAGES.find(l => l.id === s.language)?.icon} {s.language} · {s.savedAt}
 </div>
 </div>
 ))
 )}
 </div>
 )}
 </div>
 </div>

 {/* ── BOTTOM TIPS ── */}
 <div style={{
 marginTop: 12, padding: '10px 16px',
 background: '#faf9ff', border: '1px solid #ede9fe',
 borderRadius: 10, fontSize: 12, color: '#6b7280',
 display: 'flex', gap: 20, flexWrap: 'wrap',
 animation: 'fadeUp 0.3s ease 0.2s both',
 }}>
 <span>🐍 <strong style={{ color: '#6b7280' }}>Python:</strong> Browser run (Pyodide)</span>
 <span>🟨 <strong style={{ color: '#6b7280' }}>JavaScript:</strong> Instant execution</span>
 <span>💾 <strong style={{ color: '#6b7280' }}>Save:</strong> Name type Save click </span>
 <span>↺ <strong style={{ color: '#6b7280' }}>Reset:</strong> Original code </span>
 </div>
 </div>
 )
}