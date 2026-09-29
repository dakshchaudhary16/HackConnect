import { motion } from 'framer-motion'

const PEOPLE = [
  { name: 'Daksh', skills: 'Node.js · Backend', score: 87 },
  { name: 'Aryaman', skills: 'Python · ML', score: 76 },
]

export default function MatchPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-5 w-full max-w-sm shadow-2xl shadow-black/40"
    >
      <p className="text-xs text-gray-500 mb-4 font-medium">Suggested teammates</p>
      <div className="space-y-3">
        {PEOPLE.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
            className="bg-[#151B29] border border-[#252D3D] rounded-xl p-3.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366F1] to-[#3B82F6] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {p.name.charAt(0)}
              </div>
              <div>
                <p className="text-white text-sm font-medium leading-tight">{p.name}</p>
                <p className="text-[11px] text-gray-500">{p.skills}</p>
              </div>
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-[#22D3EE] to-[#4ade80] bg-clip-text text-transparent">
              {p.score}%
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}