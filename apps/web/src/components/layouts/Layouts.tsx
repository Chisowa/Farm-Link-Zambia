import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigation } from '@/context/NavigationContext'
import { useTheme } from '@/context/ThemeContext'
import type { PageType } from '@/context/NavigationContext'
import { ProfileMenu } from '@/components/ProfileMenu'

/* ─────────────────────────────────────────────
   Symbol constants (no emoji, no icon library)
   ───────────────────────────────────────────── */
const SYM = {
  dashboard: '◈',
  advisory: '◆',
  crops: '▬',
  weather: '▲',
  profile: '●',
  logout: '◊',
  menu: '≡',
  close: '✕',
  sun: '◉',
  moon: '◌',
}

/* ─────────────────────────────────────────────
   MainLayout — Sidebar-based layout
   ───────────────────────────────────────────── */
interface MainLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export function MainLayout({ children, currentPage }: MainLayoutProps) {
  const { user, logout } = useAuth()
  const { navigateTo } = useNavigation()
  const { isDark, toggleDarkMode } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navItems = [
    { text: 'Dashboard', id: 'dashboard', symbol: SYM.dashboard },
    { text: 'Ask AI', id: 'advisory', symbol: SYM.advisory },
    { text: 'Crops', id: 'crops', symbol: SYM.crops },
    { text: 'Weather', id: 'weather', symbol: SYM.weather },
  ]

  const handleLogout = () => {
    logout()
    navigateTo('landing')
    setMobileMenuOpen(false)
  }

  const sidebarBg = isDark ? '#0f1a15' : '#ffffff'
  const sidebarBorder = isDark ? '#2a3f35' : '#e0d9d0'
  const logoColor = isDark ? '#d4af37' : '#1a3a2e'
  const textColor = isDark ? '#e8e0d6' : '#3d3d3d'
  const mutedColor = isDark ? '#9a8a7e' : '#bfaea3'
  const mainBg = isDark ? '#0a1510' : '#faf8f6'

  const getNavItemStyle = (isActive: boolean): React.CSSProperties => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.875rem 1.5rem',
    backgroundColor: isActive ? '#1a3a2e' : 'transparent',
    color: isActive ? '#f5f3f0' : textColor,
    borderLeft: isActive ? '3px solid #d4af37' : '3px solid transparent',
    border: 'none',
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: isActive ? '#d4af37' : 'transparent',
    cursor: 'pointer',
    fontFamily: '"Lato", sans-serif',
    fontSize: '0.95rem',
    fontWeight: isActive ? 700 : 400,
    letterSpacing: '0.02em',
    textAlign: 'left' as const,
    transition: 'all 0.3s ease',
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: mainBg }}>
      {/* ── Mobile overlay ── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            transition: 'opacity 0.3s ease',
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: '260px',
          backgroundColor: sidebarBg,
          borderRight: `1px solid ${sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
          boxShadow: mobileMenuOpen ? '4px 0 24px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '1.75rem 1.5rem',
            borderBottom: `1px solid ${sidebarBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => {
              navigateTo('dashboard')
              setMobileMenuOpen(false)
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <h1
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: logoColor,
                letterSpacing: '-0.5px',
                margin: 0,
              }}
            >
              Farm-Link
            </h1>
            <p
              style={{
                fontFamily: '"Lato", sans-serif',
                fontSize: '0.7rem',
                color: '#d4af37',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                margin: '2px 0 0',
                fontWeight: 400,
              }}
            >
              Zambia
            </p>
          </button>

          {/* Mobile close */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: mutedColor,
              fontSize: '1.1rem',
              padding: '0.25rem',
            }}
          >
            {SYM.close}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, paddingTop: '1rem', paddingBottom: '1rem', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              className="sidebar-nav-item"
              onClick={() => {
                navigateTo(item.id as PageType)
                setMobileMenuOpen(false)
              }}
              style={getNavItemStyle(currentPage === item.id)}
            >
              <span
                style={{
                  fontSize: '0.9rem',
                  color: currentPage === item.id ? '#d4af37' : mutedColor,
                  fontWeight: 700,
                  minWidth: '16px',
                }}
              >
                {item.symbol}
              </span>
              {item.text}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div style={{ borderTop: `1px solid ${sidebarBorder}`, padding: '1.25rem 1.5rem' }}>
          {/* Dark mode toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                fontFamily: '"Lato", sans-serif',
                fontSize: '0.8rem',
                color: mutedColor,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
            <button
              onClick={toggleDarkMode}
              style={{
                width: '40px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: isDark ? '#d4af37' : '#e0d9d0',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.3s ease',
              }}
              aria-label="Toggle dark mode"
            >
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: isDark ? '21px' : '3px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#1a3a2e' : 'white',
                  transition: 'left 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.5rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                }}
              >
                {isDark ? SYM.sun : SYM.moon}
              </span>
            </button>
          </div>

          {/* Profile link */}
          <button
            className="sidebar-nav-item"
            onClick={() => {
              navigateTo('profile')
              setMobileMenuOpen(false)
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1a3a2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d4af37',
                fontFamily: '"Lato", sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left', overflow: 'hidden' }}>
              <p
                style={{
                  fontFamily: '"Lato", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: textColor,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name?.split(' ')[0]}
              </p>
              <p
                style={{
                  fontFamily: '"Lato", sans-serif',
                  fontSize: '0.7rem',
                  color: mutedColor,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.email}
              </p>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: '"Lato", sans-serif',
              fontSize: '0.85rem',
              color: '#c0392b',
              fontWeight: 400,
              transition: 'color 0.3s ease',
            }}
          >
            <span style={{ fontSize: '0.7rem' }}>{SYM.logout}</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="lg:ml-[260px]" style={{ flex: 1, minHeight: '100vh', width: '100%' }}>
        {/* Mobile top bar */}
        <div
          className="lg:hidden"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            backgroundColor: sidebarBg,
            borderBottom: `1px solid ${sidebarBorder}`,
          }}
        >
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: textColor,
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: '"Lato", sans-serif',
            }}
          >
            <span>{SYM.menu}</span>
            <span
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: logoColor,
              }}
            >
              Farm-Link
            </span>
          </button>

          <button
            onClick={toggleDarkMode}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isDark ? '#2a3f35' : '#f0ece6',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: textColor,
              transition: 'all 0.3s ease',
            }}
          >
            {isDark ? SYM.sun : SYM.moon}
          </button>
        </div>

        {/* Page content */}
        <main
          className="anim-fade-in"
          style={{
            padding: '2rem 2rem 3rem',
            minHeight: 'calc(100vh - 64px)',
            position: 'relative',
          }}
        >
          {/* Profile Menu - Fixed top-right */}
          <div className="fixed top-6 right-6 z-50">
            <ProfileMenu />
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   AuthLayout — Centered full-page layout
   ───────────────────────────────────────────── */
interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { isDark, toggleDarkMode } = useTheme()

  const bg = isDark
    ? 'linear-gradient(135deg, #0f1a15 0%, #1a2e26 100%)'
    : 'linear-gradient(135deg, #f5f3f0 0%, #ede9e4 100%)'

  return (
    <div
      className="anim-fade-in"
      style={{
        minHeight: '100vh',
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        transition: 'background 0.3s ease',
      }}
    >
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: isDark ? '#2a3f35' : '#ffffff',
          border: `1px solid ${isDark ? '#3a5040' : '#e0d9d0'}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          color: isDark ? '#d4af37' : '#1a3a2e',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
        }}
        aria-label="Toggle dark mode"
      >
        {isDark ? SYM.sun : SYM.moon}
      </button>

      {/* Floating background decoration */}
      <div
        className="anim-float"
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.05)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="anim-float anim-delay-3"
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(26, 58, 46, 0.06)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="w-full anim-slide-up"
        style={{ maxWidth: '440px', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1a3a2e, #2d5a52)',
              marginBottom: '1rem',
              boxShadow: '0 4px 20px rgba(26, 58, 46, 0.3)',
            }}
          >
            <span style={{ color: '#d4af37', fontSize: '1.4rem', fontWeight: 700 }}>◈</span>
          </div>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.6rem',
              fontWeight: 700,
              color: isDark ? '#d4af37' : '#1a3a2e',
              letterSpacing: '-0.5px',
              marginBottom: '0.25rem',
            }}
          >
            Farm-Link
          </h1>
          <p
            style={{
              fontFamily: '"Lato", sans-serif',
              fontSize: '0.65rem',
              color: '#d4af37',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            Zambia
          </p>
          {title && (
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: isDark ? '#f5f3f0' : '#1a3a2e',
                letterSpacing: '-0.5px',
                marginBottom: '0.5rem',
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              style={{
                fontFamily: '"Lato", sans-serif',
                fontSize: '0.95rem',
                color: isDark ? '#9a8a7e' : '#bfaea3',
                fontWeight: 300,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: isDark ? '#1a2e26' : '#ffffff',
            borderRadius: '16px',
            border: `1px solid ${isDark ? '#2a3f35' : '#e0d9d0'}`,
            padding: '2.5rem',
            boxShadow: '0 8px 40px rgba(26, 58, 46, 0.1)',
            transition: 'background-color 0.3s ease',
          }}
        >
          {children}
        </div>

        <p
          style={{
            textAlign: 'center',
            fontFamily: '"Lato", sans-serif',
            fontSize: '0.8rem',
            color: isDark ? '#9a8a7e' : '#bfaea3',
            marginTop: '1.5rem',
            fontStyle: 'italic',
            fontWeight: 300,
          }}
        >
          Empowering Zambian farmers with AI-driven agricultural insights
        </p>
      </div>
    </div>
  )
}
