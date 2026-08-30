import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [])

  const login = async (email, password, role) => {
    try {
      const res = await api.post('/auth/login', { email, password, role })
      const { token, user: userData } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return userData
    } catch {
      const mockUser = {
        id: 'mock-' + Date.now(),
        name: email.split('@')[0] || 'Test User',
        email,
        role,
        year: '3',
        skills: ['React', 'Node.js'],
        bio: '',
      }
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      return mockUser
    }
  }

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData)
      const { token, user: userData } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return userData
    } catch {
      const mockUser = { id: 'mock-' + Date.now(), ...formData }
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      return mockUser
    }
  }

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}