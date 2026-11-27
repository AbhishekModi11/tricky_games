import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const GAMES = [
  {
    icon: '🎭',
    title: 'Hangman',
    desc: 'Guess the hidden word letter by letter before the man gets hanged. 6 lives, 20 tricky words.',
    path: '/hangman',
    color: '#7c3aed',
  },
  {
    icon: '✊',
    title: 'Rock Paper Scissors',
    desc: 'The classic hand game against the machine. Fast rounds, instant results, and bragging rights.',
    path: '/rps',
    color: '#f59e0b',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handlePlay = (path) => {
    navigate(user ? path : '/register')
  }

  return (
    <div>
      <div className="hero">
        <div className="hero-crown">👑</div>
        <h1 className="hero-title">TRICKY KING</h1>
        <p className="hero-sub">
          Two games. One throne. Prove you&apos;re the trickiest of them all.
        </p>
        {!user && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Create Account →
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        )}
        {user && (
          <p style={{ color: 'var(--gold)', fontFamily: 'Orbitron, monospace', fontSize: '1rem' }}>
            Welcome back, {user.avatar} {user.username}! &nbsp;
            <span style={{ color: 'var(--text2)' }}>
              {user.stats.wins} wins and counting.
            </span>
          </p>
        )}
      </div>

      <div className="game-cards">
        {GAMES.map(g => (
          <div
            key={g.path}
            className="game-card"
            onClick={() => handlePlay(g.path)}
            style={{ '--hover-color': g.color }}
          >
            <span className="game-icon">{g.icon}</span>
            <h2 className="game-title">{g.title}</h2>
            <p className="game-desc">{g.desc}</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 20, background: `linear-gradient(135deg, ${g.color}, ${g.color}cc)` }}
            >
              Play Now
            </button>
          </div>
        ))}
      </div>

      {user && (
        <div
          className="card"
          style={{ marginTop: 40, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center' }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: 4 }}>TOTAL WINS</div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 900 }}>
              {user.stats.wins}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: 4 }}>WIN RATE</div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '2.5rem', color: 'var(--purple2)', fontWeight: 900 }}>
              {user.stats.win_pct}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: 4 }}>GAMES PLAYED</div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '2.5rem', color: 'var(--blue)', fontWeight: 900 }}>
              {user.stats.total}
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/history')}>
            View Full History →
          </button>
        </div>
      )}
    </div>
  )
}
