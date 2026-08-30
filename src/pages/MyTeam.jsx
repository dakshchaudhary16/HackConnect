import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import { getConnections, removeConnection } from '../services/mockStore'
import { useToast } from '../context/ToastContext'

export default function MyTeam() {
  const { showToast } = useToast()
  const [team, setTeam] = useState([])

  useEffect(() => {
    setTeam(getConnections())
  }, [])

  const handleRemove = (person) => {
    const updated = removeConnection(person.id)
    setTeam(updated)
    showToast(`${person.name} removed from your team`, 'info')
  }

  const skillCoverage = [...new Set(team.flatMap((m) => m.skills))]

  if (team.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <Users className="w-10 h-10 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            No teammates yet
          </h1>
          <p className="text-gray-400 mb-6">Connect with someone from your matches to start building your team.</p>
          <Link
            to="/matches"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-medium"
          >
            Find teammates
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          My team
        </h1>
        <p className="text-gray-400 mb-8">{team.length} teammate{team.length === 1 ? '' : 's'} connected</p>

        {skillCoverage.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Combined skill coverage</h2>
            <div className="flex flex-wrap gap-2">
              {skillCoverage.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/20">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {team.map((m) => (
            <div key={m.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shrink-0">
                {m.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">{m.name}</h3>
                  <button onClick={() => handleRemove(m)} className="text-gray-500 hover:text-red-400 transition-colors" title="Remove from team">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">{m.year}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.skills.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-600 mt-8">
          Team chat and real-time collaboration need a backend to work across accounts, that's next once the API is live.
        </p>
      </div>
    </div>
  )
}