import { useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'

const SKILL_OPTIONS = [
  'React', 'Node.js', 'Python', 'Java', 'C++', 'UI/UX Design',
  'Machine Learning', 'Data Science', 'Flutter', 'DevOps',
  'Blockchain', 'Cloud/AWS', 'Figma', 'MongoDB', 'SQL',
]

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const [name, setName] = useState(user?.name || '')
  const [year, setYear] = useState(user?.year || '1')
  const [bio, setBio] = useState(user?.bio || '')
  const [skills, setSkills] = useState(user?.skills || [])
  const [github, setGithub] = useState(user?.github || '')
  const [linkedin, setLinkedin] = useState(user?.linkedin || '')
  const [saving, setSaving] = useState(false)

  const toggleSkill = (skill) => {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleSave = async () => {
    setSaving(true)
    const updates = { name, year, bio, skills, github, linkedin }
    try {
      await api.put('/profile', updates)
      updateUser(updates)
      showToast('Profile updated', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not save profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080B12]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Your profile
        </h1>
        <p className="text-gray-400 mb-8">keep this current, it drives your team matches</p>

        <div className="backdrop-blur-xl bg-[#0F1420] border border-[#252D3D] rounded-3xl p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                <option value="1" className="bg-[#080B12]">1st Year</option>
                <option value="2" className="bg-[#080B12]">2nd Year</option>
                <option value="3" className="bg-[#080B12]">3rd Year</option>
                <option value="4" className="bg-[#080B12]">4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="What do you build, what are you looking for in a team..." className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 flex items-center gap-1.5"><GithubIcon className="w-3.5 h-3.5" /> GitHub URL</label>
              <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/yourname" className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 flex items-center gap-1.5"><LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn URL</label>
              <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourname" className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    skills.includes(skill) ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 border-transparent text-white' : 'border-[#252D3D] text-gray-400 hover:border-indigo-500/50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}