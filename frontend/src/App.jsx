import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import History from './pages/History'
import HangmanGame from './pages/HangmanGame'
import RPSGame from './pages/RPSGame'
import Leaderboard from './pages/Leaderboard'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner" />
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register"    element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile"     element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/history"     element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/hangman"     element={<PrivateRoute><HangmanGame /></PrivateRoute>} />
          <Route path="/rps"         element={<PrivateRoute><RPSGame /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
