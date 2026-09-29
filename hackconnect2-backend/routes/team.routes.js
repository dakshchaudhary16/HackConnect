import express from 'express'
import Team from '../models/Team.js'
import TeamRequest from '../models/TeamRequest.js'
import Hackathon from '../models/Hackathon.js'
import Registration from '../models/Registration.js'
import User from '../models/User.js'
import { verifyToken, requireRole } from '../middleware/auth.js'
import { computeMatchScore } from '../utils/matching.js'
import { parseRequiredSize } from '../utils/helpers.js'

const router = express.Router()
router.use(verifyToken, requireRole('student'))

router.get('/matches', async (req, res) => {
  const me = req.user
  const others = await User.find({ role: 'student', _id: { $ne: me._id } })
  const allSkillsSet = new Set(me.skills)
  others.forEach((o) => o.skills.forEach((s) => allSkillsSet.add(s)))
  const allSkills = [...allSkillsSet]

  const matches = others
    .map((o) => ({
      id: o._id,
      name: o.name,
      year: o.year,
      bio: o.bio,
      skills: o.skills,
      matchScore: computeMatchScore(me.skills, o.skills, allSkills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)

  res.json(matches)
})

router.post('/invite', async (req, res) => {
  try {
    const { hackathonId, recipientId } = req.body
    if (String(recipientId) === String(req.user._id)) {
      return res.status(400).json({ message: "You can't invite yourself" })
    }
    const hackathon = await Hackathon.findById(hackathonId)
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' })

    const relevantDate = hackathon.endDate || hackathon.startDate
    if (relevantDate && new Date(relevantDate) < new Date()) {
      return res.status(409).json({ message: 'This hackathon has already ended' })
    }

    let team = await Team.findOne({ hackathon: hackathonId, members: req.user._id })

    if (team && team.registered) {
      return res.status(409).json({ message: 'Your team for this hackathon is already registered' })
    }
    if (!team) {
      try {
        team = await Team.create({
          hackathon: hackathonId,
          leader: req.user._id,
          members: [req.user._id],
          requiredSize: parseRequiredSize(hackathon.teamSize),
        })
      } catch (err) {
        if (err.code === 11000) {
          team = await Team.findOne({ hackathon: hackathonId, leader: req.user._id })
        } else {
          throw err
        }
      }
    }

    const recipientTeam = await Team.findOne({ hackathon: hackathonId, members: recipientId })
    if (recipientTeam) {
      return res.status(409).json({ message: "They're already on a team for this hackathon" })
    }

    if (team.members.length >= team.requiredSize) {
      return res.status(409).json({ message: 'Your team is already full for this hackathon' })
    }

    const existing = await TeamRequest.findOne({ team: team._id, recipient: recipientId, status: 'pending' })
    if (existing) return res.status(409).json({ message: 'Invite already sent, waiting on their response' })

    const request = await TeamRequest.create({
      team: team._id,
      hackathon: hackathonId,
      requester: req.user._id,
      recipient: recipientId,
    })
    res.status(201).json({ id: request._id })
  } catch (err) {
    res.status(500).json({ message: 'Invite failed', error: err.message })
  }
})

router.get('/requests', async (req, res) => {
  const incoming = await TeamRequest.find({ recipient: req.user._id, status: 'pending' })
    .populate('requester', 'name skills year')
    .populate('hackathon', 'name')
    .populate('team', 'requiredSize members')

  const outgoing = await TeamRequest.find({ requester: req.user._id })
    .populate('recipient', 'name skills year')
    .populate('hackathon', 'name')
    .sort({ createdAt: -1 })

  res.json({
    incoming: incoming.filter((r) => r.hackathon && r.team).map((r) => ({
      id: r._id,
      hackathonName: r.hackathon?.name,
      requesterId: r.requester?._id,
      requesterName: r.requester?.name,
      requesterSkills: r.requester?.skills,
      teamSize: `${r.team?.members?.length || 0}/${r.team?.requiredSize || '?'}`,
    })),
    outgoing: outgoing.filter((r) => r.hackathon).map((r) => ({
      id: r._id,
      hackathonId: r.hackathon?._id,
      hackathonName: r.hackathon?.name,
      recipientId: r.recipient?._id,
      recipientName: r.recipient?.name,
      status: r.status,
    })),
  })
})

router.post('/requests/:id/accept', async (req, res) => {
  const request = await TeamRequest.findById(req.params.id)
  if (!request || String(request.recipient) !== String(req.user._id)) {
    return res.status(404).json({ message: 'Request not found' })
  }
  if (request.status !== 'pending') return res.status(409).json({ message: 'Already handled' })

  const existingTeam = await Team.findOne({ hackathon: request.hackathon, members: req.user._id })
  if (existingTeam) {
    request.status = 'declined'
    await request.save()
    return res.status(409).json({ message: "You're already on a team for this hackathon" })
  }

  const team = await Team.findById(request.team)
  if (!team) return res.status(404).json({ message: 'Team no longer exists' })
  if (team.registered) {
    request.status = 'declined'
    await request.save()
    return res.status(409).json({ message: 'That team already registered before you could join' })
  }
  if (team.members.length >= team.requiredSize) {
    request.status = 'declined'
    await request.save()
    return res.status(409).json({ message: 'That team filled up before you could join' })
  }

  team.members.push(req.user._id)
  await team.save()
  request.status = 'accepted'
  await request.save()

  await TeamRequest.updateMany(
    { hackathon: request.hackathon, recipient: req.user._id, status: 'pending', _id: { $ne: request._id } },
    { status: 'declined' }
  )

  res.json({ message: 'Joined the team' })
})

router.post('/requests/:id/decline', async (req, res) => {
  const request = await TeamRequest.findById(req.params.id)
  if (!request || String(request.recipient) !== String(req.user._id)) {
    return res.status(404).json({ message: 'Request not found' })
  }
  request.status = 'declined'
  await request.save()
  res.json({ message: 'Declined' })
})

router.get('/my-teams', async (req, res) => {
  const teams = await Team.find({ members: req.user._id })
    .populate('hackathon', 'name domain date teamSize')
    .populate('members', 'name year skills')
    .populate('leader', 'name')

  res.json(teams.filter((t) => t.hackathon).map((t) => ({
    id: t._id,
    hackathon: { id: t.hackathon._id, name: t.hackathon.name, domain: t.hackathon.domain, date: t.hackathon.date },
    leaderId: t.leader._id,
    leaderName: t.leader.name,
    isLeader: String(t.leader._id) === String(req.user._id),
    members: t.members.map((m) => ({ id: m._id, name: m.name, year: m.year, skills: m.skills })),
    requiredSize: t.requiredSize,
    registered: t.registered,
  })))
})

router.get('/hackathon/:hackathonId', async (req, res) => {
  const team = await Team.findOne({ hackathon: req.params.hackathonId, members: req.user._id })
    .populate('members', 'name year skills')
    .populate('leader', 'name')

  if (!team) return res.json(null)

  res.json({
    id: team._id,
    leaderId: team.leader._id,
    leaderName: team.leader.name,
    isLeader: String(team.leader._id) === String(req.user._id),
    members: team.members.map((m) => ({ id: m._id, name: m.name, year: m.year, skills: m.skills })),
    requiredSize: team.requiredSize,
    registered: team.registered,
  })
})

router.post('/:teamId/register', async (req, res) => {
  const team = await Team.findById(req.params.teamId)
  if (!team) return res.status(404).json({ message: 'Team not found' })
  if (String(team.leader) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only the team leader can register the team' })
  }
  if (team.members.length < team.requiredSize) {
    return res.status(400).json({ message: `Your team needs ${team.requiredSize - team.members.length} more member(s) before registering` })
  }
  if (team.registered) return res.status(409).json({ message: 'This team is already registered' })

  await Promise.all(team.members.map((studentId) =>
    Registration.findOneAndUpdate(
      { hackathon: team.hackathon, student: studentId },
      { hackathon: team.hackathon, student: studentId, team: team._id },
      { upsert: true }
    )
  ))

  team.registered = true
  await team.save()
  res.json({ message: 'Team registered' })
})

router.post('/:teamId/leave', async (req, res) => {
  const team = await Team.findById(req.params.teamId)
  if (!team) return res.status(404).json({ message: 'Team not found' })

  const isMember = team.members.some((m) => String(m) === String(req.user._id))
  if (!isMember) return res.status(403).json({ message: "You're not on this team" })

  if (team.registered) {
    return res.status(409).json({ message: "Can't leave a team that's already registered" })
  }

  const isLeader = String(team.leader) === String(req.user._id)

  if (!isLeader) {
    team.members = team.members.filter((m) => String(m) !== String(req.user._id))
    await team.save()
    return res.json({ message: 'Left the team' })
  }

  const remaining = team.members.filter((m) => String(m) !== String(req.user._id))

  if (remaining.length === 0) {
    await TeamRequest.deleteMany({ team: team._id, status: 'pending' })
    await Team.findByIdAndDelete(team._id)
    return res.json({ message: 'Team disbanded' })
  }

  const newLeaderId = remaining[0]
  team.leader = newLeaderId
  team.members = remaining
  await team.save()
  res.json({ message: 'Left the team, leadership passed on' })
})

export default router