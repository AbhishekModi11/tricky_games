import { useState } from 'react'
import api from '../api'
import { useAuth } from '../AuthContext'

const CHOICES = [
  { id: 0, emoji: '🪨', name: 'Rock',     beats: 2 },
  { id: 1, emoji: '📄', name: 'Paper',    beats: 0 },
  { id: 2, emoji: '✂️',  name: 'Scissors', beats: 1 },
]

const RESULT_DATA = {
  win:  { label: 'YOU WIN!',  emoji: '🎉', color: 'var(--green)' },
  loss: { label: 'YOU LOSE!', emoji: '💔', color: 'var(--red)' },
  draw: { label: "IT'S A DRAW!", emoji: '🤝', color: 'var(--blue)' },
}

export default function RPSGame() {
  const { refreshUser } = useAuth()
  const [result, setResult]           = useState(null)
  const [userChoice, setUserChoice]   = useState(null)
  const [cpuChoice, setCpuChoice]     = useState(null)
  const [loading, setLoading]         = useState(false)
  const [streak, setStreak]           = useState(0)
  const [totalWins, setTotalWins]     = useState(0)
  const [totalGames, setTotalGames]   = useState(0)

  const play = async (choiceId) => {
    if (loading) return
    setLoading(true)
    setResult(null)
    setUserChoice(choiceId)
    setCpuChoice(null)

    try {
      const r = await api.post('/rps/play', { choice: choiceId })
      setCpuChoice(r.data.computer_choice)
      setResult(r.data.result)
      setTotalGames(g => g + 1)
      if (r.data.result === 'win') {
        setStreak(s => s + 1)
        setTotalWins(w => w + 1)
      } else {
        setStreak(0)
      }
      await refreshUser()
    } catch {
      setResult('error')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setUserChoice(null)
    setCpuChoice(null)
  }

  const rd = result && RESULT_DATA[result]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">✊ Rock Paper Scissors</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>You vs The Machine</p>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {streak > 1 && (
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid var(--gold)', borderRadius: 8, padding: '6px 14px', fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 700 }}>
              🔥 {streak} win streak!
            </div>
          )}
        </div>
      </div>

      {/* Session mini stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { label: 'Session Wins',   val: totalWins,            color: 'var(--green)' },
          { label: 'Session Games',  val: totalGames,           color: 'var(--purple2)' },
          { label: 'Win Streak',     val: streak,               color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="stat-tile" style={{ flex: '1 1 100px', textAlign: 'center' }}>
            <div className="stat-num" style={{ color: s.color, fontSize: '1.8rem' }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Choices */}
      {!result && (
        <div>
          <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 16 }}>
            {loading ? 'CPU is thinking…' : 'Pick your weapon:'}
          </p>
          <div className="rps-choices">
            {CHOICES.map(c => (
              <button
                key={c.id}
                className="rps-btn"
                onClick={() => play(c.id)}
                disabled={loading}
                style={{ opacity: loading ? 0.5 : 1 }}
              >
                {c.emoji}
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && rd && cpuChoice !== null && (
        <div className={`rps-result-box ${result}`}>
          <span className="result-emoji">{rd.emoji}</span>
          <div className="result-label" style={{ color: rd.color }}>{rd.label}</div>

          <div className="rps-vs" style={{ marginTop: 24, marginBottom: 16 }}>
            <div className="rps-side">
              <span className="big-emoji">{CHOICES[userChoice].emoji}</span>
              <div style={{ marginTop: 8, fontWeight: 600 }}>{CHOICES[userChoice].name}</div>
              <div className="side-label">You</div>
            </div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', color: 'var(--text2)' }}>VS</div>
            <div className="rps-side">
              <span className="big-emoji">{CHOICES[cpuChoice].emoji}</span>
              <div style={{ marginTop: 8, fontWeight: 600 }}>{CHOICES[cpuChoice].name}</div>
              <div className="side-label">CPU</div>
            </div>
          </div>

          {result === 'win' && (
            <p style={{ color: 'var(--green)', fontSize: '0.9rem', marginBottom: 12 }}>
              {CHOICES[userChoice].name} beats {CHOICES[cpuChoice].name}!
            </p>
          )}
          {result === 'loss' && (
            <p style={{ color: 'var(--red)', fontSize: '0.9rem', marginBottom: 12 }}>
              {CHOICES[cpuChoice].name} beats {CHOICES[userChoice].name}!
            </p>
          )}
          {result === 'draw' && (
            <p style={{ color: 'var(--blue)', fontSize: '0.9rem', marginBottom: 12 }}>
              Same choice — no winner this time!
            </p>
          )}

          <button className="btn btn-primary" onClick={reset}>Play Again</button>
        </div>
      )}

      {/* How-to */}
      <div className="card" style={{ marginTop: 32, background: 'var(--bg3)' }}>
        <h3 style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 12 }}>
          RULES
        </h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text2)' }}>
          <span>🪨 Rock crushes ✂️ Scissors</span>
          <span>📄 Paper covers 🪨 Rock</span>
          <span>✂️ Scissors cut 📄 Paper</span>
        </div>
      </div>
    </div>
  )
}
