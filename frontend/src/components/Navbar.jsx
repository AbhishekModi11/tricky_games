import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const active = path => location.pathname === path ? 'nav-btn active' : 'nav-btn'

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <span>👑</span> Tricky King
      </Link>

      <div className="navbar-links">
        <Link to="/"            className={active('/')}>Home</Link>
        <Link to="/leaderboard" className={active('/leaderboard')}>🏆 Board</Link>

        {user ? (
          <>
            <Link to="/hangman" className={active('/hangman')}>🎭 Hangman</Link>
            <Link to="/rps"     className={active('/rps')}>✊ RPS</Link>
            <Link to="/history" className={active('/history')}>📜 History</Link>
            <Link to="/profile">
              <div className="nav-avatar" title={user.username}>{user.avatar}</div>
            </Link>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn-primary btn">Play Free</Link>
          </>
        )}
      </div>
    </nav>
  )
}
