import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, LogOut } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useToast } from '../context/ToastContext'

export default function MyTeam() {
  const { showToast } = useToast()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await api.get('/teams/my-teams')
      setTeams(res.data)
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not load teams', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRegister = async (team) => {
    try {
      await api.post(`/teams/${team.id}/register`)
      showToast(`Registered for ${team.hackathon.name}`, 'success')
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error')
    }
  }

  const handleLeave = async (team) => {
    if (!window.confirm(`Leave your team for ${team.hackathon.name}?`)) return
    try {
      await api.post(`/teams/${team.id}/leave`)
      showToast('You left the team', 'info')
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not leave team', 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B12]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-16 text-gray-500 text-sm text-center">Loading your teams...</div>
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="min-h-screen bg-[#080B12]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <Users className="w-10 h-10 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            No teams yet
          </h1>
          <p className="text-gray-400 mb-6">Invite someone from Matches to start a team for a hackathon.</p>
          <Link to="/matches" className="inline-block bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white px-6 py-2.5 rounded-xl font-medium">
            Find teammates
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
          My teams
        </h1>
        <p className="text-gray-400 mb-8">{teams.length} team{teams.length === 1 ? '' : 's'} across your hackathons</p>

        <div className="space-y-4">
          {teams.map((t) => (
            <div key={t.id} className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <h3 className="text-white font-semibold">{t.hackathon.name}</h3>
                  <p className="text-xs text-gray-500">{t.hackathon.date} · led by {t.leaderName}</p>
                </div>
                <div className="flex items-center gap-2">
                  {t.registered ? (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 font-medium">Registered ✓</span>
                  ) : t.members.length >= t.requiredSize && t.isLeader ? (
                    <button onClick={() => handleRegister(t)} className="text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white px-4 py-2 rounded-full font-medium">
                      Register team
                    </button>
                  ) : t.members.length >= t.requiredSize ? (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-[#151B29] text-gray-400">Waiting for {t.leaderName} to register</span>
                  ) : (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-[#151B29] text-gray-400">{t.members.length}/{t.requiredSize} teammates</span>
                  )}
                  {!t.registered && (
                    <button onClick={() => handleLeave(t)} title="Leave this team" className="text-gray-500 hover:text-red-400 transition-colors p-1.5">
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.members.map((m) => (
                  <Link key={m.id} to={`/students/${m.id}`} className="flex items-center gap-2 bg-[#151B29] hover:bg-[#1c2333] rounded-full pl-1 pr-3 py-1 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-semibold">
                      {m.name.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-300">{m.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}