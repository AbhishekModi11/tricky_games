import { useEffect, useState } from 'react'
import api from '../api'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/leaderboard')
      .then(r => setBoard(r.data.leaderboard))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  return (
    <div>
      <h1 className="page-title">🏆 Leaderboard</h1>
      <p className="page-sub">The greatest Tricky Kings, ranked by total wins.</p>

      {board.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🕹️</div>
          <p style={{ color: 'var(--text2)' }}>No players yet. Be the first king!</p>
        </div>
      ) : (
        <div>
          {board.map((player, i) => (
            <div key={player.username} className={`lb-row top-${i + 1}`}>
              <div className="lb-rank">
                {i < 3 ? MEDALS[i] : `#${i + 1}`}
              </div>
              <div style={{ fontSize: '1.6rem' }}>{player.avatar}</div>
              <div className="lb-name">{player.username}</div>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="lb-wins">{player.wins}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text2)', textTransform: 'uppercase' }}>Wins</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, color: 'var(--purple2)' }}>
                    {player.win_pct}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text2)', textTransform: 'uppercase' }}>Rate</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, color: 'var(--blue)' }}>
                    {player.total}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text2)', textTransform: 'uppercase' }}>Played</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
