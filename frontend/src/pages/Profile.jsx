import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const AVATARS = ['👑', '🎯', '🃏', '🎲', '🏆', '🦁', '🐉', '⚡', '🔥', '💎', '🧙', '🦅']

export default function Profile() {
  const { user, refreshUser, logout } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(user.avatar)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')

  const saveAvatar = async () => {
    setSaving(true)
    try {
      await api.put('/me/avatar', { avatar: selected })
      await refreshUser()
      setMsg('Avatar updated!')
      setTimeout(() => setMsg(''), 2000)
    } catch {
      setMsg('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const s = user.stats

  const statColor = (val, type) => {
    if (type === 'wins')   return 'var(--green)'
    if (type === 'losses') return 'var(--red)'
    if (type === 'draws')  return 'var(--blue)'
    if (type === 'pct')    return 'var(--gold)'
    return 'var(--text)'
  }

  return (
    <div>
      <h1 className="page-title">My Profile</h1>
      <p className="page-sub">Your stats, your avatar, your legacy.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left: identity */}
        <div className="card">
          <div className="profile-header">
            <div className="avatar-big">{selected}</div>
            <div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.3rem', fontWeight: 700 }}>
                {user.username}
              </div>
              <div style={{ color: 'var(--text2)', fontSize: '0.85rem', marginTop: 4 }}>{user.email}</div>
              <div style={{ color: 'var(--text2)', fontSize: '0.75rem', marginTop: 4 }}>
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: 10 }}>Choose your avatar:</p>
          <div className="avatar-picker">
            {AVATARS.map(a => (
              <div
                key={a}
                className={`avatar-opt ${a === selected ? 'selected' : ''}`}
                onClick={() => setSelected(a)}
              >
                {a}
              </div>
            ))}
          </div>

          {msg && <div className={`alert ${msg.includes('Failed') ? 'alert-error' : 'alert-success'}`} style={{ marginTop: 12 }}>{msg}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={saveAvatar} disabled={saving || selected === user.avatar}>
              {saving ? 'Saving…' : 'Save Avatar'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/history')}>
              📜 My History
            </button>
          </div>
        </div>

        {/* Right: stats */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Orbitron, monospace', marginBottom: 16, fontSize: '0.95rem', color: 'var(--text2)' }}>
              OVERALL STATS
            </h3>
            <div className="stats-grid">
              <div className="stat-tile">
                <div className="stat-num" style={{ color: 'var(--gold)' }}>{s.wins}</div>
                <div className="stat-label">Wins</div>
              </div>
              <div className="stat-tile">
                <div className="stat-num" style={{ color: 'var(--red)' }}>{s.losses}</div>
                <div className="stat-label">Losses</div>
              </div>
              <div className="stat-tile">
                <div className="stat-num" style={{ color: 'var(--blue)' }}>{s.draws}</div>
                <div className="stat-label">Draws</div>
              </div>
              <div className="stat-tile">
                <div className="stat-num" style={{ color: 'var(--purple2)' }}>{s.win_pct}%</div>
                <div className="stat-label">Win Rate</div>
              </div>
            </div>

            {/* Win bar */}
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 6 }}>
                <span>Win Rate</span><span>{s.wins}/{s.total} games</span>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${s.win_pct}%`,
                  background: 'linear-gradient(90deg, var(--purple), var(--gold))',
                  borderRadius: 8,
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: 'Orbitron, monospace', marginBottom: 16, fontSize: '0.95rem', color: 'var(--text2)' }}>
              BY GAME
            </h3>
            <div style={{ display: 'flex', gap: 16 }}>
              <div className="stat-tile" style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 4 }}>🎭</div>
                <div className="stat-num" style={{ color: 'var(--purple2)', fontSize: '1.5rem' }}>{s.hangman_wins}</div>
                <div className="stat-label">Hangman Wins</div>
              </div>
              <div className="stat-tile" style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 4 }}>✊</div>
                <div className="stat-num" style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>{s.rps_wins}</div>
                <div className="stat-label">RPS Wins</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => { logout(); navigate('/') }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
