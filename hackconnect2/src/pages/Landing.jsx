import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Users, UserCircle2, Layers, Sparkles, ArrowRight, Check, X } from 'lucide-react'
import MatchPreviewCard from '../components/MatchPreviewCard'
import SkillCoverageGraphic from '../components/SkillCoverageGraphic'
import HackathonPreviewCard from '../components/HackathonPreviewCard'
import NetworkGraphic from '../components/NetworkGraphic'

const BADGES = ['Skill-based matching', 'Complementary profiles', 'Hackathon discovery', 'Team formation']

const STEPS = [
  { num: '01', title: 'Create your profile', desc: 'Tell HackConnect what you know, what you want to build, and what your team still needs.', icon: UserCircle2 },
  { num: '02', title: 'Discover your matches', desc: 'The matching system surfaces students whose skills complement yours, not just repeat them.', icon: Users },
  { num: '03', title: 'Build your team', desc: 'Connect, get accepted, and register as a full team once everyone is locked in.', icon: Compass },
]

const FEATURES = [
  { title: 'Smart team matching', desc: 'Find students based on complementary skills rather than simple overlap, weighted toward filling your gaps.', icon: Sparkles },
  { title: 'Hackathon discovery', desc: 'Browse hackathons filtered by domain, mode, and month, with details on team requirements up front.', icon: Compass },
  { title: 'Team workspace', desc: 'See who is on your team, who is pending, and register together once your roster is full.', icon: Layers },
  { title: 'Profile-driven matching', desc: 'Your skills, year, and bio feed directly into who gets recommended to you and who you get recommended to.', icon: UserCircle2 },
]

const COMPARISON = [
  { old: 'Ask friends', new: 'Skill-based discovery' },
  { old: 'Random WhatsApp groups', new: 'Structured profiles' },
  { old: 'Teams of similar skill sets', new: 'Complementary skills' },
  { old: 'Search manually', new: 'Suggested matches' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#080B12] text-[#F8FAFC] overflow-x-hidden">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#080B12]/75 border-b border-[#252D3D] px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Hack<span className="bg-gradient-to-r from-[#818CF8] to-[#38BDF8] bg-clip-text text-transparent">Connect</span>
        </span>
        <div className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <Link to="/login" className="hover:text-white transition-colors">Login</Link>
        </div>
        <Link to="/register" className="text-sm bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:brightness-110 text-white px-4 py-2 rounded-full font-medium flex items-center gap-1.5">
          Get started <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* Hero: split layout, not centered */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#6366F1]/10 rounded-full blur-[140px] pointer-events-none" />

        <motion.div initial="hidden" animate="show" variants={fadeUp} className="relative">
          <p className="text-xs uppercase tracking-widest text-[#818CF8] font-medium mb-4">Your team is out there</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Find your team.<br />
            Build something{' '}
            <span className="bg-gradient-to-r from-[#818CF8] to-[#38BDF8] bg-clip-text text-transparent">remarkable.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md">
            Find college teammates based on skills, interests, and complementary strengths.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link to="/register" className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:brightness-110 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2">
              Find my team <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="bg-[#0F1420] border border-[#252D3D] hover:border-gray-600 text-white px-6 py-3 rounded-xl font-medium">
              Explore hackathons
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {BADGES.map((b) => (
              <span key={b} className="text-xs px-3 py-1.5 rounded-full bg-[#0F1420] border border-[#252D3D] text-gray-500">{b}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="relative flex justify-center lg:justify-end"
        >
          <MatchPreviewCard />
        </motion.div>
      </section>

      {/* How it works: horizontal steps with connecting rhythm */}
      <section id="how-it-works" className="border-t border-[#252D3D] py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Built around better team formation
          </motion.h2>
          <p className="text-gray-500">Three steps, from solo to shipped.</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 relative">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6 relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-[#818CF8]">{s.num}</span>
                <div className="w-8 h-8 rounded-lg bg-[#6366F1]/15 flex items-center justify-center">
                  <s.icon className="w-4 h-4 text-[#818CF8]" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* USP: split, text left, graphic right */}
      <section className="border-t border-[#252D3D] py-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-widest text-[#818CF8] font-medium mb-4">The right skills, the right people</p>
            <h2 className="text-3xl font-bold mb-4 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Your team shouldn't be five people who know the same thing.
            </h2>
            <p className="text-gray-400 leading-relaxed">
              HackConnect's matching weights complementary skills over raw overlap, so you get suggested teammates who fill your gaps, not clones of your own resume.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <SkillCoverageGraphic />
          </motion.div>
        </div>
      </section>

      {/* Features: genuine section, 4-up grid */}
      <section id="features" className="border-t border-[#252D3D] py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Everything you need to build your team
          </motion.h2>
          <p className="text-gray-500">Not a website about team matching, an actual one.</p>
        </div>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6"
            >
              <div className="w-9 h-9 rounded-lg bg-[#6366F1]/15 flex items-center justify-center mb-4">
                <f.icon className="w-4.5 h-4.5 text-[#818CF8]" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hackathon preview: split, reversed (visual left, text right) */}
      <section className="border-t border-[#252D3D] py-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-center lg:justify-start order-2 lg:order-1">
            <HackathonPreviewCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
            <p className="text-xs uppercase tracking-widest text-[#818CF8] font-medium mb-4">Find your next hackathon</p>
            <h2 className="text-3xl font-bold mb-4 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Discover hackathons that fit your team.
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Filter by domain, mode, and month, see the team size a hackathon actually requires, and register once your whole team is ready, not one person at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why HackConnect: comparison table paired with the network visual */}
      <section className="border-t border-[#252D3D] py-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Why HackConnect?
            </h2>
            <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2 border-b border-[#252D3D]">
                <div className="px-5 py-3 text-xs font-medium text-gray-500 flex items-center gap-2"><X className="w-3.5 h-3.5" /> The old way</div>
                <div className="px-5 py-3 text-xs font-medium text-[#818CF8] flex items-center gap-2 border-l border-[#252D3D]"><Check className="w-3.5 h-3.5" /> HackConnect</div>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={i} className={`grid grid-cols-2 ${i !== COMPARISON.length - 1 ? 'border-b border-[#252D3D]' : ''}`}>
                  <div className="px-5 py-3.5 text-sm text-gray-500">{row.old}</div>
                  <div className="px-5 py-3.5 text-sm text-white border-l border-[#252D3D]">{row.new}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <NetworkGraphic />
            <p className="text-center text-sm text-gray-500 mt-4">One team, three complementary skill sets.</p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA: centered */}
      <section className="border-t border-[#252D3D] py-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Stop searching for teammates.
          </h2>
          <p className="text-gray-400 mb-8">Start building with the right people.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:brightness-110 text-white px-8 py-3 rounded-xl font-medium">
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#252D3D] pt-14 pb-8 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 mb-10">
          <div>
            <span className="text-lg font-bold block mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Hack<span className="bg-gradient-to-r from-[#818CF8] to-[#38BDF8] bg-clip-text text-transparent">Connect</span>
            </span>
            <p className="text-sm text-gray-500 max-w-xs">Build better teams. Build better projects.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-600 mb-3">Product</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/register" className="hover:text-gray-300 transition-colors">Find teammates</Link></li>
              <li><Link to="/login" className="hover:text-gray-300 transition-colors">Hackathons</Link></li>
              <li><Link to="/login" className="hover:text-gray-300 transition-colors">Teams</Link></li>
              <li><Link to="/register" className="hover:text-gray-300 transition-colors">Profiles</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-600 mb-3">Resources</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#how-it-works" className="hover:text-gray-300 transition-colors">How it works</a></li>
              <li><a href="#features" className="hover:text-gray-300 transition-colors">Features</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto border-t border-[#252D3D] pt-6 text-xs text-gray-600">
          © 2026 HackConnect. Built for student innovators.
        </div>
      </footer>
    </div>
  )
}