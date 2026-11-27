import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Register() {
  const [form, setForm]       = useState({ username: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 4) { setError('Password must be at least 4 characters'); return }
    setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
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
            Claim Your Throne
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: 4 }}>Create your free account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              placeholder="tricky_king"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="king@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Min 4 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            className="btn btn-gold"
            style={{ width: '100%', marginTop: 8, padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : '👑 Become a King'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
