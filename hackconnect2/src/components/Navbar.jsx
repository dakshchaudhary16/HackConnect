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
    { to: '/hackathons', label: 'Discover' },
    { to: '/matches', label: 'Matches' },
    { to: '/requests', label: 'Requests' },
    { to: '/team', label: 'My Teams' },
    { to: '/registered', label: 'Registered' },
    { to: '/profile', label: 'Profile' },
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#080B12]/80 border-b border-[#252D3D] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link
          to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
          className="text-xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Hack<span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Connect</span>
        </Link>
        {user?.role === 'student' && (
          <div className="hidden md:flex items-center gap-1">
            {studentLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                  location.pathname === link.to ? 'bg-[#151B29] text-white' : 'text-gray-400 hover:text-white'
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
          {user?.name} · <span className="text-indigo-400 capitalize">{user?.role === 'admin' ? 'organizer' : user?.role}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-1.5 rounded-full border border-[#252D3D] text-gray-300 hover:border-red-500/50 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}