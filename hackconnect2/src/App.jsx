import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import TeamMatching from './pages/TeamMatching'
import Hackathons from './pages/Hackathons'
import HackathonDetail from './pages/HackathonDetail'
import MyTeam from './pages/MyTeam'
import TeamRequests from './pages/TeamRequests'
import RegisteredHackathons from './pages/RegisteredHackathons'
import Profile from './pages/Profile'
import PersonProfile from './pages/PersonProfile'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="student"><Dashboard /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute requiredRole="student"><TeamMatching /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute requiredRole="student"><TeamRequests /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute requiredRole="student"><MyTeam /></ProtectedRoute>} />
            <Route path="/registered" element={<ProtectedRoute requiredRole="student"><RegisteredHackathons /></ProtectedRoute>} />
            <Route path="/hackathons" element={<ProtectedRoute requiredRole="student"><Hackathons /></ProtectedRoute>} />
            <Route path="/hackathons/:id" element={<ProtectedRoute requiredRole="student"><HackathonDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute requiredRole="student"><Profile /></ProtectedRoute>} />
            <Route path="/students/:id" element={<ProtectedRoute><PersonProfile /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App