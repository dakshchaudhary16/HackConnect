import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useToast } from '../context/ToastContext'

const ALL_SKILLS = [
  'React', 'Node.js', 'Python', 'Java', 'C++', 'UI/UX Design',
  'Machine Learning', 'Data Science', 'Flutter', 'DevOps',
  'Blockchain', 'Cloud/AWS', 'Figma', 'MongoDB', 'SQL',
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' } }),
}

export default function TeamMatching() {
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const [matches, setMatches] = useState([])
  const [hackathons, setHackathons] = useState([])
  const [selectedHackathon, setSelectedHackathon] = useState(searchParams.get('hackathon') || '')
  const [outgoing, setOutgoing] = useState([])
  const [loading, setLoading] = useState(true)
  const [skillFilter, setSkillFilter] = useState('All')
  const [sortBy, setSortBy] = useState('match')
  const [nameSearch, setNameSearch] = useState('')

  const loadOutgoing = async () => {
    try {
      const res = await api.get('/teams/requests')
      setOutgoing(res.data.outgoing)
    } catch {
      setOutgoing([])
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [matchRes, hackRes] = await Promise.all([api.get('/teams/matches'), api.get('/hackathons')])
        setMatches(matchRes.data)
        setHackathons(hackRes.data)
      } catch (err) {
        showToast(err.response?.data?.message || 'Could not load matches', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
    loadOutgoing()
  }, [])

  const handleInvite = async (person) => {
    if (!selectedHackathon) {
      showToast('Pick which hackathon you\'re inviting them for', 'info')
      return
    }
    try {
      await api.post('/teams/invite', { hackathonId: selectedHackathon, recipientId: person.id })
      showToast(`Invite sent to ${person.name}`, 'success')
      loadOutgoing()
    } catch (err) {
      showToast(err.response?.data?.message || 'Invite failed', 'error')
    }
  }

  const inviteStatus = (personId) => {
    const req = outgoing.find((o) => o.hackathonId === selectedHackathon && o.recipientId === personId)
    return req?.status
  }

  const filtered = matches
    .filter((m) => skillFilter === 'All' || m.skills.includes(skillFilter))
    .filter((m) => m.name.toLowerCase().includes(nameSearch.toLowerCase()))
    .sort((a, b) => (sortBy === 'match' ? b.matchScore - a.matchScore : a.name.localeCompare(b.name)))

  return (
    <div className="min-h-screen bg-[#080B12]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Find your team
          </h1>
          <Link to="/team" className="text-sm text-indigo-400 hover:text-indigo-300">
            My teams →
          </Link>
        </div>
        <p className="text-gray-400 mb-6">ranked by skill complementarity, not just overlap</p>

        <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-4 mb-6">
          <label className="text-xs text-gray-400 mb-1.5 block">Inviting teammates for</label>
          <select
            value={selectedHackathon}
            onChange={(e) => setSelectedHackathon(e.target.value)}
            className="w-full sm:w-auto bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="" className="bg-[#080B12]">Select a hackathon...</option>
            {hackathons.map((h) => (
              <option key={h.id} value={h.id} className="bg-[#080B12]">{h.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <input
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            placeholder="Search by name..."
            className="bg-[#0F1420] border border-[#252D3D] rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 min-w-[200px]"
          />
          <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="bg-[#0F1420] border border-[#252D3D] rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
            <option value="All" className="bg-[#080B12]">All skills</option>
            {ALL_SKILLS.map((s) => <option key={s} value={s} className="bg-[#080B12]">{s}</option>)}
          </select>
          <div className="flex bg-[#0F1420] border border-[#252D3D] rounded-full p-1">
            <button onClick={() => setSortBy('match')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'match' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white' : 'text-gray-400'}`}>
              Best match
            </button>
            <button onClick={() => setSortBy('name')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'name' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white' : 'text-gray-400'}`}>
              A-Z
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500 text-sm">Loading matches...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-sm">No matches for that search, try a different name or skill.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {filtered.map((m, i) => {
              const status = inviteStatus(m.id)
              return (
                <motion.div
                  key={m.id}
                  initial="hidden" animate="show" custom={i} variants={fadeUp}
                  className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-5 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Link to={`/students/${m.id}`} className="flex items-center gap-3 group">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold leading-tight group-hover:text-indigo-300 transition-colors">{m.name}</h3>
                        <p className="text-xs text-gray-500">{m.year}</p>
                      </div>
                    </Link>
                    <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                      {m.matchScore}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{m.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.skills.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-[#151B29] text-gray-300">{s}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleInvite(m)}
                    disabled={status === 'pending' || status === 'accepted'}
                    className={`w-full text-sm py-2 rounded-xl transition-colors font-medium ${
                      status === 'accepted' ? 'bg-green-500/15 text-green-400 cursor-default'
                      : status === 'pending' ? 'bg-[#151B29] text-gray-500 cursor-wait'
                      : 'bg-[#151B29] hover:bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {status === 'accepted' ? 'On your team ✓' : status === 'pending' ? 'Invite sent' : 'Invite'}
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