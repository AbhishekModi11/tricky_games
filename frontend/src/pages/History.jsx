import { useState, useEffect } from 'react'
import api from '../api'

const FILTERS = [
  { key: 'all',     label: 'All Games' },
  { key: 'hangman', label: '🎭 Hangman' },
  { key: 'rps',     label: '✊ RPS' },
]

const RESULT_ICONS = { win: '✅', loss: '❌', draw: '🤝' }

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function History() {
  const [filter, setFilter] = useState('all')
  const [page, setPage]     = useState(1)
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = { page }
    if (filter !== 'all') params.game = filter
    api.get('/history', { params })
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [filter, page])

  const changeFilter = f => { setFilter(f); setPage(1) }

  return (
    <div>
      <h1 className="page-title">Game History</h1>
      <p className="page-sub">Every battle recorded. Every win remembered.</p>

      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`filter-tab ${filter === f.key ? 'active' : ''}`}
            onClick={() => changeFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="spinner" />
        ) : !data || data.records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
            <p>No games found. Go play something!</p>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Game</th>
                <th>Result</th>
                <th>Detail</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.records.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--text2)', fontFamily: 'monospace' }}>
                    {(page - 1) * 10 + i + 1}
                  </td>
                  <td>
                    <span style={{ marginRight: 6 }}>
                      {r.game_type === 'hangman' ? '🎭' : '✊'}
                    </span>
                    {r.game_type === 'hangman' ? 'Hangman' : 'Rock Paper Scissors'}
                  </td>
                  <td>
                    <span className={`badge badge-${r.result}`}>
                      {RESULT_ICONS[r.result]} {r.result.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{r.detail}</td>
                  <td style={{ color: 'var(--text2)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {formatDate(r.played_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.pages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button className="page-btn" disabled={page === data.pages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}

      {data && (
        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.85rem', marginTop: 12 }}>
          {data.total} game{data.total !== 1 ? 's' : ''} total
        </p>
      )}
    </div>
  )
}
