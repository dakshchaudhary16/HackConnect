import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'

export default function PersonProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/profile/${id}`)
        setProfile(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B12]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 text-gray-500 text-sm text-center">Loading profile...</div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#080B12]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-gray-400 mb-4">{error || 'Profile not found.'}</p>
          <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to dashboard</Link>
        </div>
      </div>
    )
  }

  const yearSuffix = { '1': 'st', '2': 'nd', '3': 'rd', '4': 'th' }[profile.year] || 'th'

  return (
    <div className="min-h-screen bg-[#080B12]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-[#0F1420] border border-[#252D3D] rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{profile.name}</h1>
              {profile.year && <p className="text-sm text-gray-500">{profile.year}{yearSuffix} Year</p>}
            </div>
          </div>

          {profile.bio && (
            <p className="text-gray-300 text-sm leading-relaxed mb-6">{profile.bio}</p>
          )}

          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {profile.skills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[#151B29] text-gray-300">{s}</span>
              ))}
            </div>
          )}

          {(profile.github || profile.linkedin) && (
            <div className="flex items-center gap-3">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#151B29] text-gray-300 hover:text-white transition-colors">
                  <GithubIcon className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#151B29] text-gray-300 hover:text-white transition-colors">
                  <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Hackathons attended</h2>
          {profile.hackathonsAttended?.length === 0 ? (
            <p className="text-sm text-gray-500">No hackathons yet.</p>
          ) : (
            <div className="space-y-2">
              {profile.hackathonsAttended.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-[#151B29]">
                  <div>
                    <p className="text-white text-sm font-medium">{h.name}</p>
                    <p className="text-xs text-gray-500">{h.domain}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500"><Calendar className="w-3.5 h-3.5" /> {h.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}