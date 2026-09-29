import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useToast } from '../context/ToastContext'

export default function RegisteredHackathons() {
  const { showToast } = useToast()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/teams/my-teams')
        setTeams(res.data.filter((t) => t.registered))
      } catch (err) {
        showToast(err.response?.data?.message || 'Could not load registrations', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B12]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-16 text-gray-500 text-sm text-center">Loading...</div>
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="min-h-screen bg-[#080B12]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <CheckCircle2 className="w-10 h-10 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            No registrations yet
          </h1>
          <p className="text-gray-400 mb-6">Once your team is full and registered for a hackathon, it'll show up here.</p>
          <Link to="/hackathons" className="inline-block bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white px-6 py-2.5 rounded-xl font-medium">
            Browse hackathons
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080B12]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Registered hackathons
        </h1>
        <p className="text-gray-400 mb-8">{teams.length} hackathon{teams.length === 1 ? '' : 's'} locked in</p>

        <div className="space-y-4">
          {teams.map((t) => (
            <div key={t.id} className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <h3 className="text-white font-semibold">{t.hackathon.name}</h3>
                  <p className="text-xs text-gray-500">{t.hackathon.date} · {t.hackathon.domain} · led by {t.leaderName}</p>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.members.map((m) => (
                  <Link key={m.id} to={`/students/${m.id}`} className="text-xs px-2.5 py-1 rounded-full bg-[#151B29] text-gray-300 hover:text-white transition-colors">{m.name}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}