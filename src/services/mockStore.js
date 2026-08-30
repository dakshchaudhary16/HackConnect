const HACKATHONS_KEY = 'hc_hackathons_v1'
const REGISTRATIONS_KEY = 'hc_registrations_v1'
const CONNECTIONS_KEY = 'hc_connections_v1'

const DEFAULT_HACKATHONS = [
  { id: 1, name: 'HackSRM 2026', domain: 'Open Innovation', date: 'Sep 20-21', mode: 'Offline', teamSize: '2-4', description: 'Annual flagship hackathon at SRM, open to all domains, 24 hours of building.' },
  { id: 2, name: 'Smart India Hackathon', domain: 'GovTech', date: 'Oct 5-6', mode: 'Hybrid', teamSize: '6', description: 'National-level hackathon solving real government and PSU problem statements.' },
  { id: 3, name: 'ETHIndia', domain: 'Web3', date: 'Nov 12-14', mode: 'Offline', teamSize: '2-5', description: "India's biggest Ethereum hackathon, blockchain and dApp focused." },
  { id: 4, name: 'HackHer', domain: 'Diversity in Tech', date: 'Sep 28', mode: 'Online', teamSize: '3-4', description: 'A hackathon spotlighting women and non-binary builders in tech.' },
  { id: 5, name: 'DevFest Chennai', domain: 'Cloud/AI', date: 'Oct 18-19', mode: 'Offline', teamSize: '2-4', description: 'Google Developer Groups community hackathon on cloud and AI tooling.' },
  { id: 6, name: 'CodeStorm', domain: 'FinTech', date: 'Nov 2', mode: 'Online', teamSize: '2-3', description: '24-hour sprint building financial tools and predictive systems.' },
]

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getHackathons() {
  return read(HACKATHONS_KEY, DEFAULT_HACKATHONS)
}

export function saveHackathons(list) {
  write(HACKATHONS_KEY, list)
}

export function getHackathonById(id) {
  return getHackathons().find((h) => String(h.id) === String(id))
}

export function addHackathon(hackathon) {
  const list = getHackathons()
  const created = { ...hackathon, id: Date.now() }
  saveHackathons([...list, created])
  return created
}

export function updateHackathon(id, updates) {
  const list = getHackathons()
  const updated = list.map((h) => (String(h.id) === String(id) ? { ...h, ...updates } : h))
  saveHackathons(updated)
}

export function deleteHackathon(id) {
  saveHackathons(getHackathons().filter((h) => String(h.id) !== String(id)))
  const regs = getAllRegistrations()
  delete regs[id]
  write(REGISTRATIONS_KEY, regs)
}

export function getAllRegistrations() {
  return read(REGISTRATIONS_KEY, {})
}

export function getRegistrationsFor(hackathonId) {
  const all = getAllRegistrations()
  return all[hackathonId] || []
}

export function registerForHackathon(hackathonId, user) {
  const all = getAllRegistrations()
  const list = all[hackathonId] || []
  if (list.some((r) => r.email === user.email)) return list
  const updated = { ...all, [hackathonId]: [...list, user] }
  write(REGISTRATIONS_KEY, updated)
  return updated[hackathonId]
}

export function isRegistered(hackathonId, email) {
  return getRegistrationsFor(hackathonId).some((r) => r.email === email)
}

export function getConnections() {
  return read(CONNECTIONS_KEY, [])
}

export function addConnection(person) {
  const list = getConnections()
  if (list.some((p) => p.id === person.id)) return list
  const updated = [...list, person]
  write(CONNECTIONS_KEY, updated)
  return updated
}

export function removeConnection(id) {
  const list = getConnections().filter((p) => String(p.id) !== String(id))
  write(CONNECTIONS_KEY, list)
  return list
}