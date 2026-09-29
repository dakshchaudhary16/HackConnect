import express from 'express'
import User from '../models/User.js'
import Registration from '../models/Registration.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.put('/', verifyToken, async (req, res) => {
  const { name, year, bio, skills, github, linkedin } = req.body
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, year, bio, skills, github, linkedin },
    { new: true }
  )
  res.json({
    id: user._id, name: user.name, email: user.email, role: user.role,
    year: user.year, bio: user.bio, skills: user.skills,
    github: user.github, linkedin: user.linkedin,
  })
})

router.get('/:id', verifyToken, async (req, res) => {
  const user = await User.findById(req.params.id).select('name year bio skills github linkedin role')
  if (!user) return res.status(404).json({ message: 'Profile not found' })

  const registrations = await Registration.find({ student: req.params.id }).populate('hackathon', 'name domain date')

  res.json({
    id: user._id,
    name: user.name,
    year: user.year,
    bio: user.bio,
    skills: user.skills,
    github: user.github,
    linkedin: user.linkedin,
    hackathonsAttended: registrations.filter((r) => r.hackathon).map((r) => ({
      id: r.hackathon._id,
      name: r.hackathon.name,
      domain: r.hackathon.domain,
      date: r.hackathon.date,
    })),
  })
})

export default router