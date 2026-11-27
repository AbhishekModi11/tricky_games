import { createContext, useContext, useState, useEffect } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('tk_token')
    if (token) {
      api.get('/me')
        .then(r => setUser(r.data.user))
        .catch(() => localStorage.removeItem('tk_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const r = await api.post('/login', { username, password })
    localStorage.setItem('tk_token', r.data.token)
    setUser(r.data.user)
  }

  const register = async (username, email, password) => {
    const r = await api.post('/register', { username, email, password })
    localStorage.setItem('tk_token', r.data.token)
    setUser(r.data.user)
  }

  const logout = () => {
    localStorage.removeItem('tk_token')
    setUser(null)
  }

  const refreshUser = async () => {
    const r = await api.get('/me')
    setUser(r.data.user)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
