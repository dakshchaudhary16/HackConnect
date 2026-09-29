import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { getHackathons } from '../services/mockStore'

const DOMAINS = ['All', 'Open Innovation', 'GovTech', 'Web3', 'Diversity in Tech', 'Cloud/AI', 'FinTech']
const MODES = ['All', 'Online', 'Offline', 'Hybrid']
const MONTHS = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' } }),
}

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [domainFilter, setDomainFilter] = useState('All')
  const [modeFilter, setModeFilter] = useState('All')
  const [monthFilter, setMonthFilter] = useState('All')
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
    const matchesMonth = monthFilter === 'All' || (h.startDate && MONTHS[new Date(h.startDate).getMonth() + 1] === monthFilter)
    return matchesDomain && matchesMode && matchesSearch && matchesMonth
  })

  return (
    <div className="min-h-screen bg-[#080B12]">
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
            className="bg-[#0F1420] border border-[#252D3D] rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 min-w-[200px]"
          />
          <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="bg-[#0F1420] border border-[#252D3D] rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
            {DOMAINS.map((d) => <option key={d} value={d} className="bg-[#080B12]">{d}</option>)}
          </select>
          <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="bg-[#0F1420] border border-[#252D3D] rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
            {MODES.map((m) => <option key={m} value={m} className="bg-[#080B12]">{m}</option>)}
          </select>
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="bg-[#0F1420] border border-[#252D3D] rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
            {MONTHS.map((m) => <option key={m} value={m} className="bg-[#080B12]">{m}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-gray-500 text-sm">Loading hackathons...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-sm">Nothing matches those filters.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((h, i) => (
              <motion.div
                key={h.id}
                initial="hidden" animate="show" custom={i} variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6 hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300">{h.domain}</span>
                  <span className="text-xs text-gray-500">{h.mode}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{h.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{h.date} · Team of {h.teamSize}</p>
                <Link to={`/hackathons/${h.id}`} className="block text-center text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white py-2 rounded-xl font-medium">
                  View details
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}