import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useToast } from '../context/ToastContext'

export default function TeamRequests() {
  const { showToast } = useToast()
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await api.get('/teams/requests')
      setIncoming(res.data.incoming)
      setOutgoing(res.data.outgoing)
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not load requests', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAccept = async (id, name) => {
    try {
      await api.post(`/teams/requests/${id}/accept`)
      showToast(`Joined ${name}'s team`, 'success')
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not accept', 'error')
    }
  }

  const handleDecline = async (id) => {
    try {
      await api.post(`/teams/requests/${id}/decline`)
      showToast('Declined', 'info')
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not decline', 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B12]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-16 text-gray-500 text-sm text-center">Loading requests...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080B12]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Team requests
        </h1>
        <p className="text-gray-400 mb-8">invites you've received and sent</p>

        <h2 className="text-lg font-semibold text-white mb-3">Incoming</h2>
        {incoming.length === 0 ? (
          <p className="text-sm text-gray-500 mb-8">No pending invites right now.</p>
        ) : (
          <div className="space-y-3 mb-10">
            {incoming.map((r) => (
              <div key={r.id} className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-medium">
                    <Link to={`/students/${r.requesterId}`} className="hover:text-indigo-300 transition-colors">{r.requesterName}</Link> wants you for {r.hackathonName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Team currently {r.teamSize} · skills: {r.requesterSkills?.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleAccept(r.id, r.requesterName)} className="text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white px-4 py-1.5 rounded-full font-medium">
                    Accept
                  </button>
                  <button onClick={() => handleDecline(r.id)} className="text-sm text-gray-400 hover:text-red-400 px-3 py-1.5">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-semibold text-white mb-3">Sent by you</h2>
        {outgoing.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't invited anyone yet.</p>
        ) : (
          <div className="space-y-3">
            {outgoing.map((r) => (
              <div key={r.id} className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-4 flex items-center justify-between">
                <p className="text-white">
                  <Link to={`/students/${r.recipientId}`} className="hover:text-indigo-300 transition-colors">{r.recipientName}</Link> · {r.hackathonName}
                </p>
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  r.status === 'accepted' ? 'bg-green-500/15 text-green-400'
                  : r.status === 'declined' ? 'bg-red-500/15 text-red-400'
                  : 'bg-[#151B29] text-gray-400'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}