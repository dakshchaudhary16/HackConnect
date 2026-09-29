import express from 'express'
import Hackathon from '../models/Hackathon.js'
import Registration from '../models/Registration.js'
import Team from '../models/Team.js'
import TeamRequest from '../models/TeamRequest.js'
import User from '../models/User.js'
import { verifyToken, requireRole } from '../middleware/auth.js'
import { parseRequiredSize } from '../utils/helpers.js'

const router = express.Router()
router.use(verifyToken, requireRole('admin'))

router.get('/hackathons', async (req, res) => {
  const hackathons = await Hackathon.find().sort({ createdAt: -1 })
  const now = new Date()
  res.json(hackathons.map((h) => {
    const relevantDate = h.endDate || h.startDate
    const isPast = relevantDate ? new Date(relevantDate) < now : false
    return {
      id: h._id, name: h.name, domain: h.domain, date: h.date,
      startDate: h.startDate, endDate: h.endDate,
      mode: h.mode, teamSize: h.teamSize, description: h.description,
      isPast,
    }
  }))
})

router.post('/hackathons', async (req, res) => {
  const { name, domain, date, startDate, endDate, mode, teamSize, description } = req.body
  const h = await Hackathon.create({ name, domain, date, startDate, endDate, mode, teamSize, description })
  res.status(201).json({
    id: h._id, name: h.name, domain: h.domain, date: h.date,
    startDate: h.startDate, endDate: h.endDate,
    mode: h.mode, teamSize: h.teamSize, description: h.description,
  })
})

router.put('/hackathons/:id', async (req, res) => {
  const h = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!h) return res.status(404).json({ message: 'Hackathon not found' })

  if (req.body.teamSize) {
    const newSize = parseRequiredSize(req.body.teamSize)
    await Team.updateMany({ hackathon: h._id, registered: false }, { requiredSize: newSize })
  }

  res.json({
    id: h._id, name: h.name, domain: h.domain, date: h.date,
    startDate: h.startDate, endDate: h.endDate,
    mode: h.mode, teamSize: h.teamSize, description: h.description,
  })
})

router.delete('/hackathons/:id', async (req, res) => {
  await Hackathon.findByIdAndDelete(req.params.id)
  await Registration.deleteMany({ hackathon: req.params.id })
  await TeamRequest.deleteMany({ hackathon: req.params.id })
  await Team.deleteMany({ hackathon: req.params.id })
  res.json({ message: 'Deleted' })
})

router.get('/hackathons/:id/registrants', async (req, res) => {
  const regs = await Registration.find({ hackathon: req.params.id }).populate('student', 'name email')
  res.json(regs.map((r) => ({ name: r.student.name, email: r.student.email })))
})

router.get('/analytics', async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'student' })
  const hackathons = await Hackathon.find()
  const now = new Date()
  const upcomingCount = hackathons.filter((h) => {
    const d = h.endDate || h.startDate
    return !d || new Date(d) >= now
  }).length
  const pastCount = hackathons.length - upcomingCount

  const domainCounts = {}
  hackathons.forEach((h) => {
    domainCounts[h.domain] = (domainCounts[h.domain] || 0) + 1
  })
  const domainBreakdown = Object.entries(domainCounts).map(([domain, count]) => ({ domain, count }))

  const totalRegistrations = await Registration.countDocuments()
  const recent = await Registration.find().sort({ createdAt: -1 }).limit(10)
    .populate('student', 'name')
    .populate('hackathon', 'name')

  res.json({
    totalStudents,
    totalHackathons: hackathons.length,
    upcomingCount,
    pastCount,
    totalRegistrations,
    domainBreakdown,
    recentRegistrations: recent.filter((r) => r.student && r.hackathon).map((r) => ({
      studentName: r.student.name,
      hackathonName: r.hackathon.name,
      createdAt: r.createdAt,
    })),
  })
})

router.get('/students', async (req, res) => {
  const students = await User.find({ role: 'student' }).select('name year skills bio').sort({ name: 1 })
  res.json(students.map((s) => ({ id: s._id, name: s.name, year: s.year, skills: s.skills, bio: s.bio })))
})

export default router