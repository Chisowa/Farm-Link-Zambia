import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigation } from '@/context/NavigationContext'
import { useTheme } from '@/context/ThemeContext'
import { ProfileMenu } from '@/components/ProfileMenu'

export function DashboardPage() {
  const { user } = useAuth()
  const { navigateTo } = useNavigation()
  const { isDark } = useTheme()

  const quickStats = [
    { label: 'Location', value: user?.location || 'Not set', symbol: '◆' },
    { label: 'Crops Tracked', value: '0', symbol: '●' },
    { label: 'Advice Received', value: '0', symbol: '▬' },
    { label: 'Alerts', value: '0', symbol: '▲' },
  ]

  const featureCards = [
    {
      title: 'Ask AI Advisor',
      description: 'Ask questions about crop management, pest control, weather, and more',
      symbol: '▬',
      action: () => navigateTo('advisory'),
    },
    {
      title: 'Check Weather',
      description: 'Monitor forecasts and plan your farming activities ahead',
      symbol: '◆',
      action: () => navigateTo('weather'),
    },
    {
      title: 'Crop Information',
      description: 'Learn about optimal growing conditions and best practices',
      symbol: '●',
      action: () => navigateTo('crops'),
    },
  ]

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}
    >
      {/* Profile Menu - Fixed top-right */}
      <div className="fixed top-6 right-6 z-50">
        <ProfileMenu />
      </div>

      {/* Sidebar */}
      <aside
        className={`w-64 h-screen fixed left-0 top-0 border-r transition-colors duration-300 overflow-y-auto`}
        style={{
          backgroundColor: isDark ? '#0f2027' : 'white',
          borderColor: isDark ? '#2d5a52' : '#e0d9d0',
        }}
      >
        <div className="p-6">
          <div
            className="text-2xl font-bold transition-colors duration-300"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: isDark ? '#d4af37' : '#1a3a2e',
            }}
          >
            Farm-Link
          </div>

          <nav className="mt-8 space-y-2">
            {[
              { label: 'Dashboard', symbol: '▬', active: true, page: 'dashboard' as const },
              { label: 'AI Advisor', symbol: '●', active: false, page: 'advisory' as const },
              { label: 'Weather', symbol: '◆', active: false, page: 'weather' as const },
              { label: 'Crops', symbol: '✓', active: false, page: 'crops' as const },
            ].map(item => (
              <a
                key={item.label}
                href="#"
                onClick={e => {
                  e.preventDefault()
                  if (item.label !== 'Dashboard') navigateTo(item.page)
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  item.active
                    ? 'text-white transform translate-x-1'
                    : 'text-gray-600 dark:text-gray-400 hover:translate-x-1'
                }`}
                style={{
                  backgroundColor: item.active ? '#1a3a2e' : 'transparent',
                  borderLeft: item.active ? '3px solid #d4af37' : 'none',
                  paddingLeft: item.active ? 'calc(1rem - 3px)' : '1rem',
                }}
              >
                <span className="text-lg opacity-70">{item.symbol}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 animate-in fade-in duration-600">
        <div className="max-w-6xl">
          {/* Header */}
          <div
            className="mb-8 pb-6 border-b transition-colors duration-300"
            style={{ borderColor: isDark ? '#2d5a52' : '#e0d9d0' }}
          >
            <h1
              className="text-4xl font-bold transition-colors duration-300"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: isDark ? 'white' : '#1a3a2e',
              }}
            >
              Dashboard
            </h1>
          </div>

          {/* Welcome Hero */}
          <div
            className="rounded-2xl p-8 mb-8 text-white overflow-hidden relative animate-in fade-in duration-700 delay-100"
            style={{
              background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a52 100%)',
            }}
          >
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)',
                animation: 'float 6s ease-in-out infinite',
              }}
            ></div>
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(30px); }
              }
            `}</style>

            <div className="relative z-10">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Welcome back, {user?.name?.split(' ')[0]}!
              </h2>
              <p className="text-lg text-white/90 font-light">
                Your personalized agricultural intelligence for {user?.location || 'your location'}{' '}
                • Get started with today's insights
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, i) => (
              <div
                key={i}
                className="rounded-lg border p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 animate-in fade-in"
                style={{
                  backgroundColor: isDark ? '#1a3a2e' : 'white',
                  borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                  borderTop: '3px solid #d4af37',
                  animationDelay: `${0.1 + i * 0.1}s`,
                }}
              >
                <div className="text-3xl mb-3 opacity-80" style={{ fontSize: '1.8rem' }}>
                  {stat.symbol}
                </div>
                <div
                  className="text-sm font-medium mb-1 transition-colors duration-300"
                  style={{ color: isDark ? '#bfaea3' : '#888' }}
                >
                  {stat.label}
                </div>
                <div
                  className="text-2xl font-bold transition-colors duration-300"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: isDark ? 'white' : '#1a3a2e',
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2
            className="text-2xl font-bold mb-6 transition-colors duration-300"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: isDark ? 'white' : '#1a3a2e',
            }}
          >
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featureCards.map((card, i) => (
              <div
                key={i}
                onClick={card.action}
                className="rounded-lg border p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2 animate-in fade-in relative overflow-hidden"
                style={{
                  backgroundColor: isDark ? '#1a3a2e' : 'white',
                  borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                  animationDelay: `${0.2 + i * 0.1}s`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, #1a3a2e, #d4af37)',
                  }}
                ></div>

                <div className="text-2xl mb-3 opacity-70">{card.symbol}</div>
                <h3
                  className="text-lg font-semibold mb-2 transition-colors duration-300"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: isDark ? 'white' : '#1a3a2e',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm mb-3 transition-colors duration-300"
                  style={{ color: isDark ? '#bfaea3' : '#666' }}
                >
                  {card.description}
                </p>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    card.action()
                  }}
                  className="text-sm font-semibold transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1"
                  style={{ color: '#d4af37' }}
                >
                  Open →
                </a>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <h2
            className="text-2xl font-bold mb-6 transition-colors duration-300"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: isDark ? 'white' : '#1a3a2e',
            }}
          >
            Recent Activity
          </h2>

          <div
            className="rounded-lg border p-12 text-center transition-colors duration-300"
            style={{
              backgroundColor: isDark ? '#1a3a2e' : 'white',
              borderColor: isDark ? '#2d5a52' : '#e0d9d0',
            }}
          >
            <p
              className="transition-colors duration-300"
              style={{ color: isDark ? '#bfaea3' : '#888' }}
            >
              No activity yet. Start by asking the AI Advisor for personalized farm insights!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
