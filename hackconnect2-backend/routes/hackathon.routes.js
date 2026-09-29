import express from 'express'
import Hackathon from '../models/Hackathon.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const hackathons = await Hackathon.find().sort({ createdAt: -1 })
  const now = new Date()
  const upcoming = hackathons.filter((h) => {
    const relevantDate = h.endDate || h.startDate
    return !relevantDate || new Date(relevantDate) >= now
  })
  res.json(upcoming.map((h) => ({
    id: h._id, name: h.name, domain: h.domain, date: h.date,
    startDate: h.startDate, endDate: h.endDate,
    mode: h.mode, teamSize: h.teamSize, description: h.description,
  })))
})

router.get('/:id', async (req, res) => {
  const h = await Hackathon.findById(req.params.id)
  if (!h) return res.status(404).json({ message: 'Hackathon not found' })
  res.json({
    id: h._id, name: h.name, domain: h.domain, date: h.date,
    startDate: h.startDate, endDate: h.endDate,
    mode: h.mode, teamSize: h.teamSize, description: h.description,
  })
})

export default router