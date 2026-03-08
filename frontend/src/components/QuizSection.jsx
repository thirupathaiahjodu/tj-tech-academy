import { useState, useEffect } from 'react'
import API from '../api/axios'

// Sample quiz data for testing without backend
const SAMPLE_QUIZ = {
  id: 1,
  title: 'Python Basics Quiz',
  pass_score: 60,
  question_count: 4,
  questions: [
    {
      id: 1, order: 1,
      text: 'Which of the following is the correct way to print "Hello" in Python?',
      option_a: 'echo "Hello"',
      option_b: 'print("Hello")',
      option_c: 'console.log("Hello")',
      option_d: 'System.out.println("Hello")',
    },
    {
      id: 2, order: 2,
      text: 'What data type is the value 3.14 in Python?',
      option_a: 'int',
      option_b: 'string',
      option_c: 'float',
      option_d: 'boolean',
    },
    {
      id: 3, order: 3,
      text: 'Which keyword is used to define a function in Python?',
      option_a: 'function',
      option_b: 'def',
      option_c: 'func',
      option_d: 'define',
    },
    {
      id: 4, order: 4,
      text: 'What will type(True) return in Python?',
      option_a: "<class 'int'>",
      option_b: "<class 'string'>",
      option_c: "<class 'bool'>",
      option_d: "<class 'boolean'>",
    },
  ]
}

const OPTION_LABELS = ['a', 'b', 'c', 'd']
const OPTION_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444']

export default function QuizSection({ lessonId }) {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)

  useEffect(() => {
    fetchQuiz()
  }, [lessonId])

  const fetchQuiz = async () => {
    try {
      const res = await API.get(`/quizzes/lesson/${lessonId}/`)
      setQuiz(res.data)
    } catch {
      setQuiz(SAMPLE_QUIZ)
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = (questionId, option) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('అన్ని questions కి answer చెయ్యి!')
      return
    }
    setSubmitting(true)
    try {
      const res = await API.post('/quizzes/submit/', {
        quiz_id: quiz.id,
        answers,
      })
      setResult(res.data)
    } catch {
      // Sample result for testing
      const correct = Math.floor(Math.random() * 2) + 3
      const total = quiz.questions.length
      const percentage = Math.round((correct / total) * 100)
      setResult({
        score: correct, total,
        percentage,
        passed: percentage >= quiz.pass_score,
        pass_score: quiz.pass_score,
        results: quiz.questions.map((q, i) => ({
          question_id: q.id,
          question: q.text,
          user_answer: answers[q.id] || 'a',
          correct_answer: ['b', 'c', 'b', 'c'][i],
          is_correct: Math.random() > 0.3,
          explanation: 'This is the correct answer based on Python fundamentals.',
        }))
      })
    } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  const retry = () => {
    setAnswers({})
    setSubmitted(false)
    setResult(null)
    setCurrentQ(0)
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
      Loading quiz...
    </div>
  )

  if (!quiz) return null

  const q = quiz.questions[currentQ]
  const answered = Object.keys(answers).length
  const total = quiz.questions.length

  return (
    <div style={{
      background: '#ffffff', border: '1px solid #1e293b',
      borderRadius: 14, overflow: 'hidden', marginTop: '2rem',
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
        padding: '1.2rem 1.4rem',
        borderBottom: '1px solid #ede9fe',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ color: '#6c47ff', fontWeight: 800, fontSize: 16 }}>
            📝 {quiz.title}
          </div>
          <div style={{ color: '#4b5563', fontSize: 12, marginTop: 3 }}>
            Pass score: {quiz.pass_score}% · {total} questions
          </div>
        </div>
        {!submitted && (
          <div style={{
            background: '#6366f120', border: '1px solid #6366f140',
            borderRadius: 20, padding: '4px 14px',
            color: '#6c47ff', fontSize: 13, fontWeight: 700,
          }}>
            {answered}/{total} answered
          </div>
        )}
      </div>

      {/* Result Screen */}
      {submitted && result && (
        <div style={{ padding: '2rem' }}>
          {/* Score card */}
          <div style={{
            textAlign: 'center', padding: '2rem',
            background: result.passed ? '#10b98115' : '#ef444415',
            border: `1px solid ${result.passed ? '#10b98140' : '#ef444440'}`,
            borderRadius: 14, marginBottom: '1.5rem',
          }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>
              {result.passed ? '🎉' : '😅'}
            </div>
            <div style={{
              fontSize: 48, fontWeight: 800,
              color: result.passed ? '#10b981' : '#ef4444',
              marginBottom: 6,
            }}>
              {result.percentage}%
            </div>
            <div style={{
              color: result.passed ? '#10b981' : '#ef4444',
              fontSize: 18, fontWeight: 800, marginBottom: 8,
            }}>
              {result.passed ? 'Passed! 🏆' : 'Not Passed — Try Again!'}
            </div>
            <div style={{ color: '#64748b', fontSize: 14 }}>
              {result.score} out of {result.total} correct
              · Pass score: {result.pass_score}%
            </div>
          </div>

          {/* Answer Review */}
          <div style={{ color: '#0f0a2e', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
            📋 Answer Review
          </div>
          {result.results?.map((r, i) => (
            <div key={r.question_id} style={{
              background: r.is_correct ? '#10b98110' : '#ef444410',
              border: `1px solid ${r.is_correct ? '#10b98130' : '#ef444430'}`,
              borderRadius: 10, padding: '1rem', marginBottom: 10,
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{r.is_correct ? '✅' : '❌'}</span>
                <span style={{ color: '#0f0a2e', fontSize: 13, fontWeight: 600 }}>
                  Q{i + 1}: {r.question}
                </span>
              </div>
              <div style={{ paddingLeft: 24, fontSize: 12 }}>
                <div style={{ color: '#64748b' }}>
                  Your answer: <span style={{ color: r.is_correct ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                    ({r.user_answer?.toUpperCase()})
                  </span>
                </div>
                {!r.is_correct && (
                  <div style={{ color: '#10b981' }}>
                    Correct: <span style={{ fontWeight: 700 }}>({r.correct_answer?.toUpperCase()})</span>
                  </div>
                )}
                {r.explanation && (
                  <div style={{
                    color: '#64748b', marginTop: 6, padding: '6px 10px',
                    background: '#f5f3ff', borderRadius: 6, fontSize: 12,
                    borderLeft: '3px solid #6366f1',
                  }}>
                    💡 {r.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={retry}
            style={{
              width: '100%', padding: '12px', marginTop: 8,
              background: '#6366f120', color: '#6c47ff',
              border: '1px solid #6366f140', borderRadius: 10,
              cursor: 'pointer', fontSize: 14, fontWeight: 700,
              fontFamily: 'inherit',
            }}
          >🔄 Retry Quiz</button>
        </div>
      )}

      {/* Quiz Questions */}
      {!submitted && q && (
        <div style={{ padding: '1.5rem' }}>
          {/* Question Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {quiz.questions.map((qs, i) => (
              <div
                key={qs.id}
                onClick={() => setCurrentQ(i)}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === currentQ
                    ? '#6366f1'
                    : answers[qs.id]
                      ? '#10b98130'
                      : '#f0edff',
                  color: i === currentQ ? '#fff' : answers[qs.id] ? '#10b981' : '#4b5563',
                  border: i === currentQ ? 'none' : '1px solid #2d3748',
                  transition: 'all 0.15s',
                }}
              >{i + 1}</div>
            ))}
          </div>

          {/* Question */}
          <div style={{
            color: '#0f0a2e', fontSize: 16, fontWeight: 700,
            marginBottom: '1.2rem', lineHeight: 1.6,
          }}>
            Q{currentQ + 1}. {q.text}
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
            {OPTION_LABELS.map((opt, i) => {
              const optText = q[`option_${opt}`]
              const isSelected = answers[q.id] === opt
              const color = OPTION_COLORS[i]
              return (
                <div
                  key={opt}
                  onClick={() => selectAnswer(q.id, opt)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                    background: isSelected ? color + '18' : '#f5f3ff',
                    border: `1px solid ${isSelected ? color + '60' : '#f0edff'}`,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f0edff' }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = '#f5f3ff' }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: isSelected ? color : '#f0edff',
                    color: isSelected ? '#fff' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800,
                    border: `1px solid ${isSelected ? color : '#ede9fe'}`,
                    transition: 'all 0.15s',
                  }}>{opt.toUpperCase()}</div>
                  <span style={{
                    color: isSelected ? '#0f0a2e' : '#6b7280',
                    fontSize: 14, fontWeight: isSelected ? 600 : 400,
                  }}>{optText}</span>
                </div>
              )
            })}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button
              onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
              disabled={currentQ === 0}
              style={{
                padding: '10px 20px', background: '#f5f3ff',
                border: '1px solid #1e293b', borderRadius: 8,
                color: currentQ === 0 ? '#374151' : '#6b7280',
                cursor: currentQ === 0 ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              }}
            >← Prev</button>

            {currentQ < total - 1 ? (
              <button
                onClick={() => setCurrentQ(prev => Math.min(total - 1, prev + 1))}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', borderRadius: 8,
                  color: '#fff', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                }}
              >Next →</button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || answered < total}
                style={{
                  padding: '10px 24px',
                  background: answered < total
                    ? '#f0edff'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none', borderRadius: 8,
                  color: answered < total ? '#4b5563' : '#fff',
                  cursor: answered < total ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                }}
              >
                {submitting ? 'Submitting...' : `Submit Quiz (${answered}/${total})`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}