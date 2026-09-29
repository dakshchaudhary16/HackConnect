import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const ROLES = [
  { label: 'Frontend', who: 'You' },
  { label: 'Backend', who: 'Daksh' },
  { label: 'AI/ML', who: 'Aryaman' },
]

export default function SkillCoverageGraphic() {
  return (
    <div className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-8">
      <div className="grid grid-cols-3 gap-3 mb-6">
        {ROLES.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="w-9 h-9 rounded-full bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center mx-auto mb-2">
              <Check className="w-4 h-4 text-[#818CF8]" />
            </div>
            <p className="text-white text-sm font-medium">{r.label}</p>
            <p className="text-[11px] text-gray-500">{r.who}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-px bg-[#252D3D]" />
        <span className="text-[11px] text-gray-600 uppercase tracking-wide">converges to</span>
        <div className="flex-1 h-px bg-[#252D3D]" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-gradient-to-r from-[#6366F1]/10 to-[#22D3EE]/10 border border-[#6366F1]/20 rounded-xl py-3 text-center"
      >
        <span className="text-white text-sm font-semibold">Complete team</span>
      </motion.div>
    </div>
  )
}