import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SKILL_OPTIONS = [
  'React', 'Node.js', 'Python', 'Java', 'C++', 'UI/UX Design',
  'Machine Learning', 'Data Science', 'Flutter', 'DevOps',
  'Blockchain', 'Cloud/AWS', 'Figma', 'MongoDB', 'SQL',
]

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [year, setYear] = useState('1')
  const [skills, setSkills] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const toggleSkill = (skill) => {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (skills.length === 0) {
      setError('Pick at least one skill so we can match you with a team')
      return
    }
    setLoading(true)
    try {
      await register({ name, email, password, year, skills, role: 'student' })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Join HackConnect
          </h1>
          <p className="text-gray-400 mt-2 text-sm">build your profile, get matched, ship it</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Daksh Chaudhary"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="1" className="bg-[#0a0a0f]">1st Year</option>
                  <option value="2" className="bg-[#0a0a0f]">2nd Year</option>
                  <option value="3" className="bg-[#0a0a0f]">3rd Year</option>
                  <option value="4" className="bg-[#0a0a0f]">4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">Your Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      skills.includes(skill)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white'
                        : 'border-white/10 text-gray-400 hover:border-purple-500/50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}