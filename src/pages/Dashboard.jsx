import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Compass, Users, UserCircle, Sparkles, ArrowUpRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const MOCK_HACKATHONS = [
  { id: 1, name: 'HackSRM 2026', domain: 'Open Innovation', date: 'Sep 20-21', mode: 'Offline', teamSize: '2-4' },
  { id: 2, name: 'Smart India Hackathon', domain: 'GovTech', date: 'Oct 5-6', mode: 'Hybrid', teamSize: '6' },
  { id: 3, name: 'ETHIndia', domain: 'Web3', date: 'Nov 12-14', mode: 'Offline', teamSize: '2-5' },
]

const MOCK_MATCHES = [
  { id: 1, name: 'Aarav Mehta', skills: ['React', 'Node.js', 'MongoDB'], matchScore: 92 },
  { id: 2, name: 'Sneha Iyer', skills: ['UI/UX Design', 'Figma'], matchScore: 87 },
  { id: 3, name: 'Rohan Das', skills: ['Machine Learning', 'Python'], matchScore: 81 },
]

function MatchRing({ score }) {
  const radius = 21
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={radius} fill="none"
          stroke="url(#ringGradient)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
        {score}
      </span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
      <div className="h-4 w-20 bg-white/10 rounded-full mb-4" />
      <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
      <div className="h-3 w-1/2 bg-white/10 rounded" />
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackRes, matchRes] = await Promise.all([api.get('/hackathons'), api.get('/teams/matches')])
        setHackathons(hackRes.data)
        setMatches(matchRes.data)
      } catch {
        setHackathons(MOCK_HACKATHONS)
        setMatches(MOCK_MATCHES)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const filledFields = [user?.name, user?.bio, user?.year, user?.skills?.length > 0].filter(Boolean).length
  const profileStrength = Math.round((filledFields / 4) * 100)

  const quickActions = [
    { to: '/hackathons', label: 'Browse hackathons', icon: Compass, color: 'from-purple-500 to-indigo-500' },
    { to: '/matches', label: 'Find your team', icon: Users, color: 'from-pink-500 to-rose-500' },
    { to: '/profile', label: 'Edit profile', icon: UserCircle, color: 'from-cyan-500 to-blue-500' },
  ]

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {greeting}, {user?.name?.split(' ')[0] || 'there'} <span className="inline-block">👋</span>
          </h1>
          <p className="text-gray-400 mb-8">here's what's happening around you</p>
        </motion.div>

        <motion.div
          initial="hidden" animate="show" custom={1} variants={fadeUp}
          className="grid sm:grid-cols-3 gap-4 mb-10"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{loading ? '—' : hackathons.length}</p>
              <p className="text-xs text-gray-400 mt-1">Hackathons open now</p>
            </div>
            <Compass className="w-8 h-8 text-purple-400/60" strokeWidth={1.5} />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{loading ? '—' : matches.length}</p>
              <p className="text-xs text-gray-400 mt-1">Suggested teammates</p>
            </div>
            <Users className="w-8 h-8 text-pink-400/60" strokeWidth={1.5} />
          </div>
          <Link to="/profile" className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-cyan-500/40 transition-colors group">
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold text-white">{profileStrength}%</p>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-xs text-gray-400 mb-2">Profile strength</p>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.section initial="hidden" animate="show" custom={2} variants={fadeUp} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Hackathons for you
            </h2>
            <Link to="/hackathons" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {hackathons.slice(0, 3).map((h, i) => (
                <motion.div
                  key={h.id}
                  initial="hidden" animate="show" custom={i} variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{h.domain}</span>
                    <span className="text-xs text-gray-500">{h.mode}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{h.name}</h3>
                  <p className="text-sm text-gray-400">{h.date} · Team of {h.teamSize}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section initial="hidden" animate="show" custom={3} variants={fadeUp} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Suggested teammates</h2>
            <Link to="/matches" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              See more <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {matches.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial="hidden" animate="show" custom={i} variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-pink-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {m.name.charAt(0)}
                    </div>
                    <MatchRing score={m.matchScore} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{m.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.skills.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{s}</span>
                    ))}
                  </div>
                  <Link
                    to="/matches"
                    className="block text-center text-sm bg-white/5 hover:bg-pink-500/20 text-pink-300 py-2 rounded-xl transition-colors"
                  >
                    Connect
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section initial="hidden" animate="show" custom={4} variants={fadeUp}>
          <h2 className="text-xl font-semibold text-white mb-4">Quick actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-colors"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shrink-0`}>
                  <a.icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <span className="text-white font-medium">{a.label}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}