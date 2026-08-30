import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Users, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { getHackathons, addHackathon, updateHackathon, deleteHackathon, getRegistrationsFor } from '../services/mockStore'
import { useToast } from '../context/ToastContext'

const MOCK_STATS = { totalStudents: 428 }
const EMPTY_FORM = { name: '', domain: '', date: '', mode: 'Offline', teamSize: '4', description: '' }

export default function AdminDashboard() {
  const { showToast } = useToast()
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [viewingRegistrants, setViewingRegistrants] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/hackathons')
        setHackathons(res.data)
      } catch {
        setHackathons(getHackathons())
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const openCreateForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEditForm = (h) => {
    setEditingId(h.id)
    setForm({ name: h.name, domain: h.domain, date: h.date, mode: h.mode, teamSize: h.teamSize, description: h.description || '' })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      try {
        await api.put(`/admin/hackathons/${editingId}`, form)
      } catch {
        // fall through to local mock
      } finally {
        updateHackathon(editingId, form)
        setHackathons(getHackathons())
        showToast(`${form.name} updated`, 'success')
      }
    } else {
      try {
        await api.post('/admin/hackathons', form)
      } catch {
        addHackathon(form)
      }
      setHackathons(getHackathons())
      showToast(`${form.name} created`, 'success')
    }
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  const handleDelete = async (h) => {
    if (!window.confirm(`Delete "${h.name}"? This can't be undone.`)) return
    try {
      await api.delete(`/admin/hackathons/${h.id}`)
    } catch {
      // fall through to local mock
    } finally {
      deleteHackathon(h.id)
      setHackathons(getHackathons())
      showToast(`${h.name} deleted`, 'info')
    }
  }

  const totalRegistrations = hackathons.reduce((sum, h) => sum + getRegistrationsFor(h.id).length, 0)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Admin Panel
        </h1>
        <p className="text-gray-400 mb-10">manage hackathons and monitor platform activity</p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Students', value: MOCK_STATS.totalStudents },
            { label: 'Active Hackathons', value: hackathons.length },
            { label: 'Total Registrations', value: totalRegistrations },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Hackathons</h2>
          <button onClick={() => (showForm ? setShowForm(false) : openCreateForm())} className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium">
            {showForm ? 'Cancel' : '+ New Hackathon'}
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 grid md:grid-cols-2 gap-4 overflow-hidden"
          >
            <input required placeholder="Hackathon name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
            <input required placeholder="Domain (e.g. Web3, GovTech)" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
            <input required placeholder="Date (e.g. Sep 20-21)" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
            <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500">
              <option className="bg-[#0a0a0f]">Offline</option>
              <option className="bg-[#0a0a0f]">Online</option>
              <option className="bg-[#0a0a0f]">Hybrid</option>
            </select>
            <input placeholder="Team size (e.g. 2-4)" value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 md:col-span-2" />
            <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 md:col-span-2 resize-none" />
            <button type="submit" className="md:col-span-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2.5 rounded-xl">
              {editingId ? 'Save changes' : 'Create Hackathon'}
            </button>
          </motion.form>
        )}

        {loading ? (
          <div className="text-gray-500 text-sm">Loading...</div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Registrations</th>
                  <th className="px-6 py-3 font-medium">Mode</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hackathons.map((h) => (
                  <tr key={h.id} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-4 text-white font-medium">{h.name}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => setViewingRegistrants(h)} className="flex items-center gap-1.5 text-gray-300 hover:text-purple-300 transition-colors">
                        <Users className="w-3.5 h-3.5" /> {getRegistrationsFor(h.id).length}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{h.mode}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEditForm(h)} className="text-gray-400 hover:text-purple-300 transition-colors">
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

      {viewingRegistrants && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setViewingRegistrants(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#14141c] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{viewingRegistrants.name} · Registrants</h3>
              <button onClick={() => setViewingRegistrants(null)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            {getRegistrationsFor(viewingRegistrants.id).length === 0 ? (
              <p className="text-sm text-gray-500">No one has registered yet.</p>
            ) : (
              <div className="space-y-2">
                {getRegistrationsFor(viewingRegistrants.id).map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
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