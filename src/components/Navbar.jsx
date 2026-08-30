import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/hackathons', label: 'Hackathons' },
    { to: '/matches', label: 'Matches' },
    { to: '/team', label: 'Team' },
    { to: '/profile', label: 'Profile' },
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/70 border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link
          to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
          className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          HackConnect
        </Link>
        {user?.role === 'student' && (
          <div className="hidden md:flex items-center gap-1">
            {studentLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                  location.pathname === link.to ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400 hidden sm:block">
          {user?.name} · <span className="text-purple-400 capitalize">{user?.role}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-1.5 rounded-full border border-white/10 text-gray-300 hover:border-red-500/50 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}