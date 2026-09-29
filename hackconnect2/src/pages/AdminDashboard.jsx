import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Users, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { getHackathons, addHackathon, updateHackathon, deleteHackathon, getRegistrationsFor } from '../services/mockStore'
import { useToast } from '../context/ToastContext'

const EMPTY_FORM = { name: '', domain: '', startDate: '', endDate: '', mode: 'Offline', teamSize: '4', description: '' }

function formatDateRange(start, end) {
  if (!start) return ''
  const opts = { month: 'short', day: 'numeric' }
  const s = new Date(start)
  const startStr = s.toLocaleDateString('en-US', opts)
  if (!end || end === start) return `${startStr}, ${s.getFullYear()}`
  const e = new Date(end)
  const endStr = e.toLocaleDateString('en-US', opts)
  return `${startStr} - ${endStr}, ${e.getFullYear()}`
}

function toInputDate(isoOrNothing) {
  if (!isoOrNothing) return ''
  return new Date(isoOrNothing).toISOString().slice(0, 10)
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'students', label: 'Students' },
]

export default function AdminDashboard() {
  const { showToast } = useToast()
  const [tab, setTab] = useState('overview')

  const [hackathons, setHackathons] = useState([])
  const [registrantCounts, setRegistrantCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [viewingHackathon, setViewingHackathon] = useState(null)
  const [viewingRegistrants, setViewingRegistrants] = useState([])
  const [loadingRegistrants, setLoadingRegistrants] = useState(false)

  const [analytics, setAnalytics] = useState(null)
  const [students, setStudents] = useState([])
  const [studentSearch, setStudentSearch] = useState('')

  const loadHackathons = async () => {
    try {
      const res = await api.get('/admin/hackathons')
      setHackathons(res.data)
      const counts = {}
      await Promise.all(res.data.map(async (h) => {
        try {
          const r = await api.get(`/admin/hackathons/${h.id}/registrants`)
          counts[h.id] = r.data.length
        } catch {
          counts[h.id] = getRegistrationsFor(h.id).length
        }
      }))
      setRegistrantCounts(counts)
    } catch {
      const local = getHackathons()
      setHackathons(local)
      const counts = {}
      local.forEach((h) => { counts[h.id] = getRegistrationsFor(h.id).length })
      setRegistrantCounts(counts)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics')
      setAnalytics(res.data)
    } catch {
      setAnalytics(null)
    }
  }

  const loadStudents = async () => {
    try {
      const res = await api.get('/admin/students')
      setStudents(res.data)
    } catch {
      setStudents([])
    }
  }

  useEffect(() => {
    loadHackathons()
    loadAnalytics()
    loadStudents()
  }, [])

  const openCreateForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEditForm = (h) => {
    setEditingId(h.id)
    setForm({
      name: h.name, domain: h.domain,
      startDate: toInputDate(h.startDate), endDate: toInputDate(h.endDate),
      mode: h.mode, teamSize: h.teamSize, description: h.description || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name, domain: form.domain, mode: form.mode,
      teamSize: form.teamSize, description: form.description,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      date: formatDateRange(form.startDate, form.endDate),
    }
    if (editingId) {
      try {
        await api.put(`/admin/hackathons/${editingId}`, payload)
      } catch {
        updateHackathon(editingId, payload)
      }
      showToast(`${form.name} updated`, 'success')
    } else {
      try {
        await api.post('/admin/hackathons', payload)
      } catch {
        addHackathon(payload)
      }
      showToast(`${form.name} created`, 'success')
    }
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
    loadHackathons()
    loadAnalytics()
  }

  const handleDelete = async (h) => {
    if (!window.confirm(`Delete "${h.name}"? This can't be undone.`)) return
    try {
      await api.delete(`/admin/hackathons/${h.id}`)
    } catch {
      deleteHackathon(h.id)
    }
    showToast(`${h.name} deleted`, 'info')
    loadHackathons()
    loadAnalytics()
  }

  const openRegistrants = async (h) => {
    setViewingHackathon(h)
    setLoadingRegistrants(true)
    try {
      const res = await api.get(`/admin/hackathons/${h.id}/registrants`)
      setViewingRegistrants(res.data)
    } catch {
      setViewingRegistrants(getRegistrationsFor(h.id))
    } finally {
      setLoadingRegistrants(false)
    }
  }

  const totalRegistrations = analytics?.totalRegistrations ?? Object.values(registrantCounts).reduce((sum, c) => sum + c, 0)
  const totalStudents = analytics?.totalStudents ?? '—'
  const maxDomainCount = analytics?.domainBreakdown?.length ? Math.max(...analytics.domainBreakdown.map((d) => d.count)) : 1

  const filteredStudents = students.filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#080B12]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Admin Panel
        </h1>
        <p className="text-gray-400 mb-8">manage hackathons and monitor platform activity</p>

        <div className="flex bg-[#0F1420] border border-[#252D3D] rounded-full p-1 mb-8 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.id ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6">
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{totalStudents}</p>
                <p className="text-sm text-gray-400 mt-1">Total students</p>
              </div>
              <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6">
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {analytics ? analytics.upcomingCount : hackathons.length}
                </p>
                <p className="text-sm text-gray-400 mt-1">Upcoming hackathons</p>
              </div>
              <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6">
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{totalRegistrations}</p>
                <p className="text-sm text-gray-400 mt-1">Total registrations</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Hackathons by domain</h2>
                {!analytics || analytics.domainBreakdown.length === 0 ? (
                  <p className="text-sm text-gray-500">No hackathons yet.</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.domainBreakdown.map((d) => (
                      <div key={d.domain}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">{d.domain}</span>
                          <span className="text-xs text-gray-500">{d.count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#151B29] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                            style={{ width: `${(d.count / maxDomainCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Recent registrations</h2>
                {!analytics || analytics.recentRegistrations.length === 0 ? (
                  <p className="text-sm text-gray-500">No registrations yet.</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.recentRegistrations.map((r, i) => (
                      <div key={i} className="text-sm">
                        <p className="text-gray-300"><span className="text-white font-medium">{r.studentName}</span> registered for <span className="text-white font-medium">{r.hackathonName}</span></p>
                        <p className="text-xs text-gray-600">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'hackathons' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Hackathons</h2>
              <button onClick={() => (showForm ? setShowForm(false) : openCreateForm())} className="text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white px-4 py-2 rounded-full font-medium">
                {showForm ? 'Cancel' : '+ New Hackathon'}
              </button>
            </div>

            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleSubmit}
                className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6 mb-6 grid md:grid-cols-2 gap-4 overflow-hidden"
              >
                <input required placeholder="Hackathon name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" />
                <input required placeholder="Domain (e.g. Web3, GovTech)" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" />
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Start date</label>
                  <input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">End date (optional)</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]" />
                </div>
                <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500">
                  <option className="bg-[#080B12]">Offline</option>
                  <option className="bg-[#080B12]">Online</option>
                  <option className="bg-[#080B12]">Hybrid</option>
                </select>
                <input required type="number" min="2" placeholder="Required team size (e.g. 6)" value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })} className="bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" />
                <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-[#151B29] border border-[#252D3D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 md:col-span-2 resize-none" />
                <button type="submit" className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white font-semibold py-2.5 rounded-xl">
                  {editingId ? 'Save changes' : 'Create Hackathon'}
                </button>
              </motion.form>
            )}

            {loading ? (
              <div className="text-gray-500 text-sm">Loading...</div>
            ) : (
              <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#252D3D] text-gray-400 text-sm">
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Registrations</th>
                      <th className="px-6 py-3 font-medium">Mode</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hackathons.map((h) => (
                      <tr key={h.id} className="border-b border-[#151B29] last:border-0">
                        <td className="px-6 py-4 text-white font-medium">{h.name}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{h.date}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${h.isPast ? 'bg-[#151B29] text-gray-500' : 'bg-green-500/15 text-green-400'}`}>
                            {h.isPast ? 'Past' : 'Upcoming'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => openRegistrants(h)} className="flex items-center gap-1.5 text-gray-300 hover:text-indigo-300 transition-colors">
                            <Users className="w-3.5 h-3.5" /> {registrantCounts[h.id] ?? 0}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{h.mode}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => openEditForm(h)} className="text-gray-400 hover:text-indigo-300 transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(h)} className="text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'students' && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-xl font-semibold text-white">Students ({students.length})</h2>
              <input
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name..."
                className="bg-[#0F1420] border border-[#252D3D] rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 min-w-[220px]"
              />
            </div>
            {filteredStudents.length === 0 ? (
              <p className="text-sm text-gray-500">No students found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {filteredStudents.map((s) => (
                  <Link
                    key={s.id}
                    to={`/students/${s.id}`}
                    className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-4 flex items-center gap-3 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{s.name}</p>
                      <p className="text-xs text-gray-500 truncate">{s.skills?.slice(0, 3).join(', ') || 'No skills listed'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {viewingHackathon && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setViewingHackathon(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{viewingHackathon.name} · Registrants</h3>
              <button onClick={() => setViewingHackathon(null)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            {loadingRegistrants ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : viewingRegistrants.length === 0 ? (
              <p className="text-sm text-gray-500">No one has registered yet.</p>
            ) : (
              <div className="space-y-2">
                {viewingRegistrants.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#151B29] rounded-xl px-4 py-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {r.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{r.name || 'Unnamed'}</p>
                      <p className="text-xs text-gray-500 truncate">{r.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}