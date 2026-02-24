import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { AuthProvider } from './contexts/AuthContext'
import { QueryProvider } from './providers/QueryProvider'
import './style.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    {/* QueryProvider sets up tRPC + TanStack Query */}
    <QueryProvider>
      {/* AuthProvider gives useAuth() access to the logged-in Firebase user */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
)
