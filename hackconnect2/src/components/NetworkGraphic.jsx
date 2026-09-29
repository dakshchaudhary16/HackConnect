import { motion } from 'framer-motion'

export default function NetworkGraphic({ compact = false }) {
  const size = compact ? 'w-full max-w-xs' : 'w-full max-w-md'
  return (
    <div className={`relative ${size} mx-auto h-[180px]`}>
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full overflow-visible">
        <motion.line x1="160" y1="40" x2="90" y2="140" stroke="url(#lineGrad)" strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
        <motion.line x1="160" y1="40" x2="230" y2="140" stroke="url(#lineGrad)" strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.45 }} />
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="absolute left-1/2 -translate-x-1/2 top-0 bg-[#0F1420] border border-indigo-500/30 rounded-2xl px-4 py-2.5 text-center shadow-lg shadow-black/30"
      >
        <p className="text-white text-sm font-semibold">You</p>
        <p className="text-[10px] text-gray-500 mt-0.5">React · Frontend</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
        className="absolute left-[8%] bottom-0 bg-[#0F1420] border border-[#252D3D] rounded-2xl px-4 py-2.5 text-center shadow-lg shadow-black/30"
      >
        <p className="text-white text-sm font-semibold">Daksh</p>
        <p className="text-[10px] text-gray-500 mt-0.5">Node.js · Backend</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
        className="absolute right-[8%] bottom-0 bg-[#0F1420] border border-[#252D3D] rounded-2xl px-4 py-2.5 text-center shadow-lg shadow-black/30"
      >
        <p className="text-white text-sm font-semibold">Aryaman</p>
        <p className="text-[10px] text-gray-500 mt-0.5">Python · ML</p>
      </motion.div>
    </div>
  )
}