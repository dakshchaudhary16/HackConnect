import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080B12] flex items-center justify-center px-4">
      <div className="text-center">
        <p
          className="text-8xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          404
        </p>
        <h1 className="text-xl font-semibold text-white mb-2">This page doesn't exist</h1>
        <p className="text-gray-400 mb-8">The link might be broken, or the page may have moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white px-6 py-2.5 rounded-xl font-medium"
        >
          <Compass className="w-4 h-4" /> Back to HackConnect
        </Link>
      </div>
    </div>
  )
}