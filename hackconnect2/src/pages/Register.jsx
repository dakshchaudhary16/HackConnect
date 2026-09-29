import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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
    <div className="relative min-h-screen bg-[#080B12] flex items-center justify-center px-4 py-12">
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to HackConnect
        </Link>
      </div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-[#818CF8] to-[#38BDF8] bg-clip-text text-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Join HackConnect
          </h1>
          <p className="text-gray-400 mt-2 text-sm">build your profile, get matched, ship it</p>
        </div>

        <div className="backdrop-blur-xl bg-[#0F1420] border border-[#252D3D] rounded-3xl p-8 shadow-2xl">
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
                  className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Daksh Chaudhary"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="1" className="bg-[#080B12]">1st Year</option>
                  <option value="2" className="bg-[#080B12]">2nd Year</option>
                  <option value="3" className="bg-[#080B12]">3rd Year</option>
                  <option value="4" className="bg-[#080B12]">4th Year</option>
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
                className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
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
                className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
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
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 border-transparent text-white'
                        : 'border-[#252D3D] text-gray-400 hover:border-indigo-500/50'
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
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}