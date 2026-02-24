import './style.css'
import { useState } from 'react'
import AuthPage from './components/auth/AuthPage'
import Dashboard from './components/Dashboard'
import Landing from './components/Landing'
import { useAuth } from './contexts/AuthContext'

type View = 'landing' | 'auth' | 'dashboard'

/**
 * Root component — drives top-level routing via auth state.
 *
 * landing  → public marketing page (no auth required)
 * auth     → login / register page
 * dashboard → protected main app (requires Firebase auth)
 */
export function App() {
  const { user, loading } = useAuth()
  const [view, setView] = useState<View>('landing')

  // Full-screen spinner while Firebase resolves the auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-4xl block mb-4">🌾</span>
          <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm mt-3">Loading Farm-Link Zambia…</p>
        </div>
      </div>
    )
  }

  // If user is already authenticated, show the dashboard
  if (user) return <Dashboard />

  // Auth page (login / register)
  if (view === 'auth') {
    return <AuthPage onSuccess={() => setView('dashboard')} />
  }

  // Default: landing page with "Get Started" → auth
  return <Landing onGetStarted={() => setView('auth')} />
}
