import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { getHackathons, isRegistered } from '../services/mockStore'
import { useAuth } from '../context/AuthContext'

const DOMAINS = ['All', 'Open Innovation', 'GovTech', 'Web3', 'Diversity in Tech', 'Cloud/AI', 'FinTech']
const MODES = ['All', 'Online', 'Offline', 'Hybrid']

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' } }),
}

export default function Hackathons() {
  const { user } = useAuth()
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [domainFilter, setDomainFilter] = useState('All')
  const [modeFilter, setModeFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await api.get('/hackathons')
        setHackathons(res.data)
      } catch {
        setHackathons(getHackathons())
      } finally {
        setLoading(false)
      }
    }
    fetchHackathons()
  }, [])

  const filtered = hackathons.filter((h) => {
    const matchesDomain = domainFilter === 'All' || h.domain === domainFilter
    const matchesMode = modeFilter === 'All' || h.mode === modeFilter
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase())
    return matchesDomain && matchesMode && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Browse hackathons
        </h1>
        <p className="text-gray-400 mb-8">find one that fits your team and your skills</p>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 min-w-[200px]"
          />
          <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
            {DOMAINS.map((d) => <option key={d} value={d} className="bg-[#0a0a0f]">{d}</option>)}
          </select>
          <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
            {MODES.map((m) => <option key={m} value={m} className="bg-[#0a0a0f]">{m}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-gray-500 text-sm">Loading hackathons...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-sm">Nothing matches those filters.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((h, i) => {
              const registered = user?.email && isRegistered(h.id, user.email)
              return (
                <motion.div
                  key={h.id}
                  initial="hidden" animate="show" custom={i} variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{h.domain}</span>
                    <span className="text-xs text-gray-500">{h.mode}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">{h.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{h.date} · Team of {h.teamSize}</p>
                  <div className="flex items-center gap-2">
                    <Link to={`/hackathons/${h.id}`} className="flex-1 text-center text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl font-medium">
                      View details
                    </Link>
                    {registered && (
                      <span className="text-xs px-3 py-2 rounded-xl bg-green-500/15 text-green-400 font-medium whitespace-nowrap">
                        Registered ✓
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}