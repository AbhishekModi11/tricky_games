import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Login() {
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="auth-card">
        <div className="auth-logo">
          <span className="crown">👑</span>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.4rem', marginTop: 8 }}>
            Tricky King
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: 4 }}>Sign in to your throne</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              placeholder="your_username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8, padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: '0.9rem' }}>
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}
