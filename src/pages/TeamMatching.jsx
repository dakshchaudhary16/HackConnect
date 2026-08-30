import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { addConnection, getConnections } from '../services/mockStore'
import { useToast } from '../context/ToastContext'

const ALL_SKILLS = [
  'React', 'Node.js', 'Python', 'Java', 'C++', 'UI/UX Design',
  'Machine Learning', 'Data Science', 'Flutter', 'DevOps',
  'Blockchain', 'Cloud/AWS', 'Figma', 'MongoDB', 'SQL',
]

const MOCK_MATCHES = [
  { id: 1, name: 'Aarav Mehta', year: '3rd Year', skills: ['React', 'Node.js', 'MongoDB'], matchScore: 92, bio: 'Full-stack dev, shipped 4 hackathon projects' },
  { id: 2, name: 'Sneha Iyer', year: '2nd Year', skills: ['UI/UX Design', 'Figma'], matchScore: 87, bio: 'Product designer, loves clean interfaces' },
  { id: 3, name: 'Rohan Das', year: '4th Year', skills: ['Machine Learning', 'Python'], matchScore: 81, bio: 'ML enthusiast, Kaggle top 10%' },
  { id: 4, name: 'Priya Nair', year: '3rd Year', skills: ['Flutter', 'DevOps'], matchScore: 76, bio: 'Mobile-first, deploys everything to k8s' },
  { id: 5, name: 'Kabir Singh', year: '1st Year', skills: ['Blockchain', 'Cloud/AWS'], matchScore: 71, bio: 'Web3 curious, learning fast' },
  { id: 6, name: 'Ananya Rao', year: '2nd Year', skills: ['Data Science', 'SQL'], matchScore: 68, bio: 'Turns messy data into decisions' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' } }),
}

export default function TeamMatching() {
  const { showToast } = useToast()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [skillFilter, setSkillFilter] = useState('All')
  const [sortBy, setSortBy] = useState('match')
  const [connectedIds, setConnectedIds] = useState([])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/teams/matches')
        setMatches(res.data)
      } catch {
        setMatches(MOCK_MATCHES)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
    setConnectedIds(getConnections().map((c) => c.id))
  }, [])

  const handleConnect = async (person) => {
    try {
      await api.post(`/teams/connect/${person.id}`)
    } catch {
      // fall through to local mock
    } finally {
      addConnection(person)
      setConnectedIds((prev) => [...prev, person.id])
      showToast(`${person.name} added to your team`, 'success')
    }
  }

  const filtered = matches
    .filter((m) => skillFilter === 'All' || m.skills.includes(skillFilter))
    .sort((a, b) => (sortBy === 'match' ? b.matchScore - a.matchScore : a.name.localeCompare(b.name)))

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Find your team
          </h1>
          {connectedIds.length > 0 && (
            <Link to="/team" className="text-sm text-purple-400 hover:text-purple-300">
              View my team ({connectedIds.length}) →
            </Link>
          )}
        </div>
        <p className="text-gray-400 mb-8">ranked by skill complementarity, not just overlap</p>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
            <option value="All" className="bg-[#0a0a0f]">All skills</option>
            {ALL_SKILLS.map((s) => <option key={s} value={s} className="bg-[#0a0a0f]">{s}</option>)}
          </select>
          <div className="flex bg-white/5 rounded-full p-1">
            <button onClick={() => setSortBy('match')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'match' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-gray-400'}`}>
              Best match
            </button>
            <button onClick={() => setSortBy('name')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'name' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-gray-400'}`}>
              A-Z
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500 text-sm">Loading matches...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-sm">No matches for that filter, try a different skill.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {filtered.map((m, i) => {
              const connected = connectedIds.includes(m.id)
              return (
                <motion.div
                  key={m.id}
                  initial="hidden" animate="show" custom={i} variants={fadeUp}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold leading-tight">{m.name}</h3>
                        <p className="text-xs text-gray-500">{m.year}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                      {m.matchScore}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{m.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.skills.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{s}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleConnect(m)}
                    disabled={connected}
                    className={`w-full text-sm py-2 rounded-xl transition-colors font-medium ${
                      connected ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-white/5 hover:bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {connected ? 'Connected ✓' : 'Connect'}
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}