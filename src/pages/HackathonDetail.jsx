import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users as UsersIcon } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { getHackathonById, registerForHackathon, isRegistered, getRegistrationsFor } from '../services/mockStore'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function HackathonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [hackathon, setHackathon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [registrantCount, setRegistrantCount] = useState(0)

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await api.get(`/hackathons/${id}`)
        setHackathon(res.data)
      } catch {
        setHackathon(getHackathonById(id))
      } finally {
        setLoading(false)
      }
    }
    fetchHackathon()
    setRegistrantCount(getRegistrationsFor(id).length)
    if (user?.email) setRegistered(isRegistered(id, user.email))
  }, [id, user])

  const handleRegister = async () => {
    setRegistering(true)
    const payload = { id: user?.id, name: user?.name, email: user?.email }
    try {
      await api.post(`/hackathons/${id}/register`, payload)
    } catch {
      // fall through to local mock
    } finally {
      registerForHackathon(id, payload)
      setRegistered(true)
      setRegistrantCount(getRegistrationsFor(id).length)
      setRegistering(false)
      showToast(`You're registered for ${hackathon?.name}`, 'success')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10 text-gray-500 text-sm">Loading...</div>
      </div>
    )
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-gray-400 mb-4">Hackathon not found.</p>
          <Link to="/hackathons" className="text-purple-400 hover:text-purple-300 text-sm">← Back to hackathons</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/hackathons')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to hackathons
        </button>

        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{hackathon.domain}</span>
        <h1 className="text-3xl font-bold text-white mt-3 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {hackathon.name}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {hackathon.date}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {hackathon.mode}</span>
          <span className="flex items-center gap-1.5"><UsersIcon className="w-4 h-4" /> Team of {hackathon.teamSize}</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-2">About this hackathon</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{hackathon.description}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-white font-medium">{registrantCount} student{registrantCount === 1 ? '' : 's'} registered</p>
            <p className="text-xs text-gray-500 mt-1">
              {registered ? "You're on the list" : 'Register to save your spot'}
            </p>
          </div>
          <button
            onClick={handleRegister}
            disabled={registered || registering}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
              registered
                ? 'bg-green-500/15 text-green-400 cursor-default'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50'
            }`}
          >
            {registered ? 'Registered ✓' : registering ? 'Registering...' : 'Register interest'}
          </button>
        </div>
      </div>
    </div>
  )
}