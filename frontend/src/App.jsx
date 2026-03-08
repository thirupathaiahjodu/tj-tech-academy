import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'   // ← ADD
import LessonPage from './pages/LessonPage'       // ← ADD
import AIDoubtSolver from './pages/AIDoubtSolver'
import Playground from './pages/Playground'
import Leaderboard from './pages/Leaderboard'
import InterviewPrep from './pages/InterviewPrep'
import ResumeBuilder from './pages/ResumeBuilder'
import Pricing from './pages/Pricing'
import Notifications from './pages/Notifications'
import Certificate from './pages/Certificate'
import AdminDashboard from './pages/AdminDashboard'



import MainLayout from "./layouts/MainLayout"
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

const ComingSoon = ({ title }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: '60vh', gap: 12,
  }}>
    <div style={{ fontSize: 48 }}>🚧</div>
    <div style={{ color: '#e2e8f0', fontSize: 20, fontWeight: 800 }}>{title}</div>
    <div style={{ color: '#64748b', fontSize: 14 }}>Coming soon — next step lo build chestamu!</div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid #1e293b',
          },
        }}
      />
      <Routes>

        {/* ← ADD: Lesson page — full screen, no sidebar */}
        <Route path="/courses/:slug/lessons/:lessonId" element={
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        } />

        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with sidebar layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="playground" element={<Playground />} />
          <Route path="courses/:slug" element={<CourseDetail />} />  {/* ← ADD */}
          <Route path="ai-solver" element={<AIDoubtSolver />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="interview" element={<InterviewPrep />} />
          <Route path="resume" element={<ResumeBuilder />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="certificate" element={<Certificate />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="playground" element={<ComingSoon title="Code Playground" />} />
          <Route path="ai-solver" element={<ComingSoon title="AI Doubt Solver" />} />
          <Route path="leaderboard" element={<ComingSoon title="Leaderboard" />} />
          <Route path="interview" element={<ComingSoon title="Interview Prep" />} />
          <Route path="resume" element={<ComingSoon title="Resume Builder" />} />
          <Route path="live" element={<ComingSoon title="Live Classes" />} />
          <Route path="pricing" element={<ComingSoon title="Pricing" />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}