import { useState, useEffect, useCallback } from 'react'
import api from '../api'
import { useAuth } from '../AuthContext'

const PICS = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
]

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

export default function HangmanGame() {
  const { refreshUser } = useAuth()
  const [word, setWord]           = useState('')
  const [guessed, setGuessed]     = useState([])
  const [lives, setLives]         = useState(6)
  const [gameOver, setGameOver]   = useState(false)
  const [won, setWon]             = useState(false)
  const [loading, setLoading]     = useState(true)
  const [saved, setSaved]         = useState(false)

  const startGame = useCallback(async () => {
    setLoading(true)
    setSaved(false)
    try {
      const r = await api.get('/hangman/new')
      setWord(r.data.word_id)
      setGuessed([])
      setLives(6)
      setGameOver(false)
      setWon(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { startGame() }, [startGame])

  const display = word
    ? word.split('').map(l => (guessed.includes(l) ? l : '_'))
    : []

  const wrongLetters = guessed.filter(l => word && !word.includes(l))

  const saveResult = useCallback(async (result, livesLeft) => {
    if (saved) return
    setSaved(true)
    try {
      await api.post('/hangman/result', { result, word, lives_left: livesLeft })
      await refreshUser()
    } catch { /* silent */ }
  }, [saved, word, refreshUser])

  const guess = useCallback((letter) => {
    if (gameOver || guessed.includes(letter)) return
    const newGuessed = [...guessed, letter]
    setGuessed(newGuessed)

    const newDisplay = word.split('').map(l => (newGuessed.includes(l) ? l : '_'))
    const isWin      = !newDisplay.includes('_')

    let newLives = lives
    if (!word.includes(letter)) {
      newLives = lives - 1
      setLives(newLives)
    }

    if (isWin) {
      setGameOver(true)
      setWon(true)
      saveResult('win', newLives)
    } else if (newLives === 0) {
      setGameOver(true)
      setWon(false)
      saveResult('loss', 0)
    }
  }, [gameOver, guessed, word, lives, saveResult])

  // Keyboard support
  useEffect(() => {
    const handler = e => {
      const key = e.key.toLowerCase()
      if (ALPHABET.includes(key)) guess(key)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [guess])

  if (loading) return <div className="spinner" />

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">🎭 Hangman</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Guess the word before it&apos;s too late</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={startGame}>New Game</button>
      </div>

      <div className="hangman-wrapper">
        {/* Left: ASCII + lives */}
        <div>
          <pre className="hangman-ascii">{PICS[6 - lives]}</pre>
          <div className="lives-bar" style={{ marginTop: 12 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.85rem' }}>
            {lives} {lives === 1 ? 'life' : 'lives'} remaining
          </p>

          {wrongLetters.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p style={{ color: 'var(--text2)', fontSize: '0.8rem', marginBottom: 6 }}>Wrong guesses:</p>
              <div className="wrong-letters">
                {wrongLetters.map(l => <span key={l} className="wrong-letter">{l}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Right: word + keyboard */}
        <div>
          <div className="word-display">
            {display.map((l, i) => (
              <div key={i} className={`letter-box ${l !== '_' ? 'revealed' : ''}`}>
                {l !== '_' ? l.toUpperCase() : ''}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.8rem', marginBottom: 16 }}>
            {word.length} letters — click a letter or use your keyboard
          </p>

          <div className="keyboard">
            {ALPHABET.map(l => {
              const isCorrect = guessed.includes(l) && word.includes(l)
              const isWrong   = guessed.includes(l) && !word.includes(l)
              return (
                <button
                  key={l}
                  className={`key-btn ${isCorrect ? 'correct' : isWrong ? 'wrong' : ''}`}
                  onClick={() => guess(l)}
                  disabled={gameOver || guessed.includes(l)}
                >
                  {l.toUpperCase()}
                </button>
              )
            })}
          </div>

          {gameOver && (
            <div className={`game-over-banner ${won ? 'win' : 'loss'}`}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>{won ? '🎉' : '💀'}</div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.3rem', fontWeight: 900 }}>
                {won ? 'YOU WIN!' : 'GAME OVER'}
              </div>
              {!won && (
                <p style={{ color: 'var(--text2)', marginTop: 8, fontSize: '0.9rem' }}>
                  The word was <strong style={{ color: 'var(--gold)' }}>{word.toUpperCase()}</strong>
                </p>
              )}
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={startGame}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
