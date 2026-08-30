import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { useAuth } from '../context/AuthContext'

function Particles() {
  const ref = useRef()
  const count = 800
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.01
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a855f7" transparent opacity={0.7} />
    </points>
  )
}

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
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Particles />
        </Canvas>
      </div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500/30 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            HackConnect
          </h1>
          <p className="text-gray-400 mt-2 text-sm">find your team, ship something wild</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex bg-white/5 rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                role === 'student' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              Admin
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : `Login as ${role === 'admin' ? 'Admin' : 'Student'}`}
            </button>
          </form>

          {role === 'student' && (
            <p className="text-center text-gray-400 text-sm mt-6">
              New here?{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}