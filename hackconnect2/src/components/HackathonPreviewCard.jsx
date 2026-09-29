import { motion } from 'framer-motion'

export default function HackathonPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-[#0F1420] border border-[#252D3D] rounded-2xl p-6 max-w-sm w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs px-2 py-1 rounded-full bg-[#6366F1]/15 text-[#818CF8]">AI · Web · Innovation</span>
        <span className="text-xs text-gray-500">Hybrid</span>
      </div>
      <h3 className="text-white font-semibold text-lg mb-1">BuildX 2026</h3>
      <p className="text-sm text-gray-500 mb-4">Oct 12 - 14 · Team of 4</p>
      <div className="text-center text-sm bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white py-2 rounded-xl font-medium">
        View hackathon
      </div>
    </motion.div>
  )
}