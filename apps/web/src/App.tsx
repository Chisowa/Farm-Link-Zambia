/**
 * =============================================================================
 * WELCOME TO FARM-LINK ZAMBIA
 * =============================================================================
 *
 * A production-ready monorepo built with modern technologies:
 * - React + Vite for fast development
 * - TypeScript for type safety
 * - Tailwind CSS + Shadcn UI for beautiful components
 * - tRPC for type-safe APIs
 * - TanStack Query for server state management
 * - Zod for data validation
 * - Firebase for authentication and data storage
 * - Vertex AI for agricultural advisory
 *
 * =============================================================================
 */

import './style.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NavigationProvider, useNavigation } from './context/NavigationContext'
import { ThemeProvider } from './context/ThemeContext'
import { QueryProvider } from './providers/QueryProvider'

// Auth Pages
import { LoginPage, SignupPage, ProfilePage } from './components/auth'

// Feature Pages
import { DashboardPage, AdvisoryPage, CropsPage, WeatherPage } from './components/features'

// Landing Page
import Landing from './components/Landing'

// Shared Components
import { LoadingPage } from './components/forms/StateComponents'

/**
 * App Content - Routes based on authentication state
 */
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const { currentPage, navigateTo } = useNavigation()

  // Loading screen while checking auth state
  if (isLoading) {
    return <LoadingPage />
  }

  // If authenticated, show the requested page
  if (isAuthenticated) {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'advisory':
        return <AdvisoryPage />
      case 'crops':
        return <CropsPage />
      case 'weather':
        return <WeatherPage />
      case 'profile':
        return <ProfilePage />
      // If they're authenticated but on landing/login/signup, show dashboard
      case 'landing':
      case 'login':
      case 'signup':
      default:
        return <DashboardPage />
    }
  }

  // Not authenticated - show login/signup/landing
  if (currentPage === 'signup') {
    return (
      <SignupPage
        onSignupSuccess={() => navigateTo('dashboard')}
        onLoginClick={() => navigateTo('login')}
      />
    )
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        onLoginSuccess={() => navigateTo('dashboard')}
        onSignupClick={() => navigateTo('signup')}
      />
    )
  }

  // Default to landing for unauthenticated users
  return (
    <Landing onLoginClick={() => navigateTo('login')} onSignupClick={() => navigateTo('signup')} />
  )
}

/**
 * Main App Component - Farm-Link Zambia
 */
export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
