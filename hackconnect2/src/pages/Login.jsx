import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import Scene3D from '../components/Scene3D'
import TiltCard from '../components/TiltCard'
import MatchPreviewCard from '../components/MatchPreviewCard'
import { useAuth } from '../context/AuthContext'

const PERKS = ['Skill-based matching', 'Hackathon discovery', 'Team management', 'Student community']

export default function Login() {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password, role)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed, check your credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080B12] flex">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 overflow-hidden border-r border-[#252D3D]">
        <div className="absolute inset-0">
          <Scene3D />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <span className="text-2xl font-bold mb-8 block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Hack<span className="bg-gradient-to-r from-[#818CF8] to-[#38BDF8] bg-clip-text text-transparent">Connect</span>
          </span>
          <h1 className="text-3xl font-bold text-white mb-4 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Build better teams.<br />Build better projects.
          </h1>
          <p className="text-gray-400 mb-8 max-w-sm">
            Find students who complement your skills and interests.
          </p>
          <ul className="space-y-3 mb-10">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-gray-300">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" /> {p}
              </li>
            ))}
          </ul>
          <TiltCard className="w-full max-w-sm">
            <MatchPreviewCard />
          </TiltCard>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to HackConnect
          </Link>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome back
          </h2>
          <p className="text-gray-400 mb-8 text-sm">Continue building with your team.</p>

          <div className="flex bg-[#0F1420] border border-[#252D3D] rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                role === 'student' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                role === 'admin' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              Organizer
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F1420] border border-[#252D3D] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="you@srmist.edu.in"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F1420] border border-[#252D3D] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : `Continue as ${role === 'admin' ? 'Organizer' : 'Student'}`}
            </button>
          </form>

          {role === 'student' && (
            <p className="text-center text-gray-400 text-sm mt-6">
              New here?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}