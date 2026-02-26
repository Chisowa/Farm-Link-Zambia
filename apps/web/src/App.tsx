import './style.css'
import { useState } from 'react'
import AuthPage from './components/auth/AuthPage'
import Dashboard from './components/Dashboard'
import Landing from './components/Landing'
import { useAuth } from './contexts/AuthContext'

export function App() {
  const { user, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  // Full-screen spinner while Firebase resolves the auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-full bg-green-700 items-center justify-center mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={1.8}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3C8 3 4 7 4 12c0 2 .8 4 2 5.5L12 21l6-3.5A9 9 0 0012 3z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M4 12h16" />
            </svg>
          </div>
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm mt-3">Loading Farm-Link Zambia…</p>
        </div>
      </div>
    )
  }

  // If user is already authenticated, show the dashboard
  if (user) return <Dashboard />

  return (
    <>
      {/* Landing page stays in the background */}
      <Landing onGetStarted={() => setShowAuth(true)} />

      {/* Auth modal overlay — shown when user clicks Log In / Get Started */}
      {showAuth && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAuth(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal card */}
          <div className="relative w-full max-w-md" onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-9 right-0 text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Close</span>
            </button>

            <AuthPage onSuccess={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />
          </div>
        </div>
      )}
    </>
  )
}
