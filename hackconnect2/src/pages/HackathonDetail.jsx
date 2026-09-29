import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users as UsersIcon } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { getHackathonById } from '../services/mockStore'
import { useToast } from '../context/ToastContext'

export default function HackathonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [hackathon, setHackathon] = useState(null)
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const hackRes = await api.get(`/hackathons/${id}`)
      setHackathon(hackRes.data)
    } catch {
      setHackathon(getHackathonById(id))
    }
    try {
      const teamRes = await api.get(`/teams/hackathon/${id}`)
      setTeam(teamRes.data)
    } catch {
      setTeam(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleRegisterTeam = async () => {
    try {
      await api.post(`/teams/${team.id}/register`)
      showToast(`Registered for ${hackathon.name}`, 'success')
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B12]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10 text-gray-500 text-sm">Loading...</div>
      </div>
    )
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-[#080B12]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-gray-400 mb-4">Hackathon not found.</p>
          <Link to="/hackathons" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to hackathons</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080B12]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/hackathons')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to hackathons
        </button>

        <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300">{hackathon.domain}</span>
        <h1 className="text-3xl font-bold text-white mt-3 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {hackathon.name}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {hackathon.date}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {hackathon.mode}</span>
          <span className="flex items-center gap-1.5"><UsersIcon className="w-4 h-4" /> Team of {hackathon.teamSize}</span>
        </div>

        <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-2">About this hackathon</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{hackathon.description}</p>
        </div>

        <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6">
          {!team && (
            <>
              <p className="text-white font-medium mb-1">You need a team to register</p>
              <p className="text-sm text-gray-500 mb-4">Registration is per team, not per person, for this hackathon.</p>
              <Link to={`/matches?hackathon=${id}`} className="inline-block bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
                Find teammates
              </Link>
            </>
          )}

          {team && !team.registered && team.members.length < team.requiredSize && (
            <>
              <p className="text-white font-medium mb-1">{team.members.length}/{team.requiredSize} teammates</p>
              <p className="text-sm text-gray-500 mb-4">Invite {team.requiredSize - team.members.length} more before you can register.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {team.members.map((m) => (
                  <Link key={m.id} to={`/students/${m.id}`} className="text-xs px-2.5 py-1 rounded-full bg-[#151B29] text-gray-300 hover:text-white transition-colors">{m.name}</Link>
                ))}
              </div>
              <Link to={`/matches?hackathon=${id}`} className="inline-block bg-[#151B29] hover:bg-indigo-500/20 text-indigo-300 px-5 py-2.5 rounded-xl text-sm font-medium">
                Invite more teammates
              </Link>
            </>
          )}

          {team && !team.registered && team.members.length >= team.requiredSize && (
            <>
              <p className="text-white font-medium mb-1">Your team is full</p>
              <p className="text-sm text-gray-500 mb-4">
                {team.isLeader ? 'Register on behalf of your whole team.' : `Waiting for ${team.leaderName} to register your team.`}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {team.members.map((m) => (
                  <Link key={m.id} to={`/students/${m.id}`} className="text-xs px-2.5 py-1 rounded-full bg-[#151B29] text-gray-300 hover:text-white transition-colors">{m.name}</Link>
                ))}
              </div>
              {team.isLeader && (
                <button onClick={handleRegisterTeam} className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
                  Register team
                </button>
              )}
            </>
          )}

          {team && team.registered && (
            <>
              <p className="text-white font-medium mb-1">Your team is registered ✅</p>
              <div className="flex flex-wrap gap-2">
                {team.members.map((m) => (
                  <Link key={m.id} to={`/students/${m.id}`} className="text-xs px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 hover:brightness-110 transition-colors">{m.name}</Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}