import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Compass, Users, ArrowUpRight, Inbox, Layers } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const MOCK_HACKATHONS = [
  { id: 1, name: 'HackSRM 2026', domain: 'Open Innovation', date: 'Sep 20-21' },
  { id: 2, name: 'Smart India Hackathon', domain: 'GovTech', date: 'Oct 5-6' },
  { id: 3, name: 'ETHIndia', domain: 'Web3', date: 'Nov 12-14' },
]

const MOCK_MATCHES = [
  { id: 1, name: 'Daksh', skills: ['React', 'Node.js', 'MongoDB'], matchScore: 92 },
  { id: 2, name: 'Aryaman', skills: ['UI/UX Design', 'Figma'], matchScore: 87 },
  { id: 3, name: 'Rohan Das', skills: ['Machine Learning', 'Python'], matchScore: 81 },
]

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-[#151B29] shrink-0" />
      <div className="flex-1">
        <div className="h-3.5 w-2/3 bg-[#151B29] rounded mb-2" />
        <div className="h-2.5 w-1/3 bg-[#151B29] rounded" />
      </div>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' } }),
}

export default function Dashboard() {
  const { user } = useAuth()
  const [hackathons, setHackathons] = useState([])
  const [matches, setMatches] = useState([])
  const [pendingRequests, setPendingRequests] = useState(0)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.allSettled([
        api.get('/hackathons'),
        api.get('/teams/matches'),
        api.get('/teams/requests'),
        api.get('/teams/my-teams'),
      ])

      setHackathons(results[0].status === 'fulfilled' ? results[0].value.data : MOCK_HACKATHONS)
      setMatches(results[1].status === 'fulfilled' ? results[1].value.data : MOCK_MATCHES)
      setPendingRequests(results[2].status === 'fulfilled' ? results[2].value.data.incoming.length : 0)
      setTeams(results[3].status === 'fulfilled' ? results[3].value.data : [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const filledFields = [user?.name, user?.bio, user?.year, user?.skills?.length > 0].filter(Boolean).length
  const profileStrength = Math.round((filledFields / 4) * 100)

  const teamsInProgress = teams.filter((t) => !t.registered).length
  const teamsRegistered = teams.filter((t) => t.registered).length

  return (
    <div className="relative min-h-screen bg-[#080B12] overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/[0.06] rounded-full blur-[140px] pointer-events-none" />

      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp} className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-500 text-sm">here's what's happening around you</p>
        </motion.div>

        <motion.div
          initial="hidden" animate="show" custom={1} variants={fadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          <div className="bg-[#0F1420] border border-[#252D3D] rounded-xl p-4">
            <p className="text-xl font-bold text-white">{loading ? '—' : hackathons.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Open hackathons</p>
          </div>
          <div className="bg-[#0F1420] border border-[#252D3D] rounded-xl p-4">
            <p className="text-xl font-bold text-white">{loading ? '—' : matches.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Suggested teammates</p>
          </div>
          <Link
            to="/requests"
            className={`bg-[#0F1420] border rounded-xl p-4 transition-colors ${
              pendingRequests > 0 ? 'border-indigo-500/40 hover:border-indigo-400' : 'border-[#252D3D] hover:border-gray-600'
            }`}
          >
            <p className={`text-xl font-bold ${pendingRequests > 0 ? 'text-indigo-400' : 'text-white'}`}>
              {loading ? '—' : pendingRequests}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Pending requests</p>
          </Link>
          <Link to="/profile" className="bg-[#0F1420] border border-[#252D3D] rounded-xl p-4 hover:border-gray-600 transition-colors">
            <p className="text-xl font-bold text-white">{profileStrength}%</p>
            <p className="text-xs text-gray-500 mt-0.5">Profile strength</p>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <motion.section initial="hidden" animate="show" custom={2} variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Hackathons for you
              </h2>
              <Link to="/hackathons" className="text-xs text-indigo-400 hover:text-indigo-300">View all</Link>
            </div>
            <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-2">
              {loading ? (
                [0, 1, 2].map((i) => <SkeletonRow key={i} />)
              ) : hackathons.length === 0 ? (
                <p className="text-sm text-gray-500 p-3">No open hackathons right now.</p>
              ) : (
                hackathons.slice(0, 4).map((h) => (
                  <Link
                    key={h.id}
                    to={`/hackathons/${h.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#151B29] transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">{h.name}</p>
                      <p className="text-xs text-gray-500 truncate">{h.domain} · {h.date}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </Link>
                ))
              )}
            </div>
          </motion.section>

          <motion.section initial="hidden" animate="show" custom={3} variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Suggested teammates
              </h2>
              <Link to="/matches" className="text-xs text-indigo-400 hover:text-indigo-300">See more</Link>
            </div>
            <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-2">
              {loading ? (
                [0, 1, 2].map((i) => <SkeletonRow key={i} />)
              ) : matches.length === 0 ? (
                <p className="text-sm text-gray-500 p-3">No suggestions yet, add more skills to your profile.</p>
              ) : (
                matches.slice(0, 4).map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#151B29] transition-colors">
                    <Link to={`/students/${m.id}`} className="flex items-center gap-3 min-w-0 group">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">{m.name}</p>
                        <p className="text-xs text-gray-500 truncate">{m.skills.slice(0, 2).join(', ')}</p>
                      </div>
                    </Link>
                    <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent shrink-0">
                      {m.matchScore}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </div>

        <motion.section initial="hidden" animate="show" custom={4} variants={fadeUp}>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <Layers className="w-3.5 h-3.5" /> Your teams
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/team" className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-5 hover:border-gray-600 transition-colors flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-white">{loading ? '—' : teamsInProgress}</p>
                <p className="text-xs text-gray-500 mt-0.5">In progress</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600" />
            </Link>
            <Link to="/registered" className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-5 hover:border-gray-600 transition-colors flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-white">{loading ? '—' : teamsRegistered}</p>
                <p className="text-xs text-gray-500 mt-0.5">Registered</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600" />
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}