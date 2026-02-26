import { useState } from 'react'

interface LandingProps {
  onGetStarted: () => void
}

const FEATURES = [
  {
    title: 'AI Advisory',
    description:
      'Get instant answers grounded in ZARI and Ministry of Agriculture research — tailored to your region and crop.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    title: 'Crop & Pest Guidance',
    description:
      'Identify pest threats early and get planting guidance on spacing, timing, and recommended varieties for Zambia.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3C9 3 6 6 6 9.5c0 3 1.5 4.5 6 4.5s6-1.5 6-4.5C18 6 15 3 12 3z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6M9 20h6" />
      </svg>
    ),
  },
  {
    title: 'Weather Insights',
    description:
      'Location-based forecasts to plan planting, spraying, and harvesting with confidence across all agro-zones.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
  },
]

export default function Landing({ onGetStarted }: LandingProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileNavOpen(false)
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-40 bg-white" style={{ boxShadow: '0 1px 0 #f1f5f9' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            style={{ textDecoration: 'none' }}
          >
            <div
              className="w-7 h-7 rounded flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#1a3d0a' }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3C9 3 6 6 6 9.5c0 3 1.5 4.5 6 4.5s6-1.5 6-4.5C18 6 15 3 12 3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6" />
              </svg>
            </div>
            <span
              className="font-bold text-[15px] text-gray-900"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Farm-Link Zambia
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: 'Home', id: '' },
              { label: 'Services', id: 'features' },
              { label: 'Contact', id: 'cta' },
            ].map(({ label, id }) => (
              <button
                key={label}
                onClick={() =>
                  id ? scrollTo(id) : window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                className="relative text-sm text-gray-600 font-medium py-1 group"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {label}
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-200"
                  style={{ backgroundColor: '#2d6a19' }}
                />
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onGetStarted}
              className="hidden sm:inline-flex items-center text-sm font-semibold text-white px-5 py-2 rounded"
              style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#2d6a19' }}
            >
              Sign In
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileNavOpen(o => !o)}
              className="md:hidden p-1.5 -mr-1 text-gray-600 rounded"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-1">
            {[
              { label: 'Home', id: '' },
              { label: 'Services', id: 'features' },
              { label: 'Contact', id: 'cta' },
            ].map(({ label, id }) => (
              <button
                key={label}
                onClick={() =>
                  id ? scrollTo(id) : window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                className="flex w-full items-center py-3 text-sm font-medium text-gray-700"
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid #f8fafc',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileNavOpen(false)
                  onGetStarted()
                }}
                className="w-full text-sm font-semibold text-white py-2.5 rounded"
                style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#2d6a19' }}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col sm:flex-row" style={{ minHeight: 'min(85vh, 680px)' }}>
        {/* Photo — left side */}
        <div
          className="h-64 sm:h-auto sm:w-1/2 relative overflow-hidden"
          style={{
            backgroundImage: "url('/hero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#2d6a19',
          }}
        >
          {/* subtle overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(26,61,10,0.3) 0%, rgba(0,0,0,0.1) 100%)',
            }}
          />
        </div>

        {/* Content — right side */}
        <div
          className="flex-1 sm:w-1/2 flex flex-col justify-center px-6 sm:px-14 lg:px-20 py-12 sm:py-0"
          style={{ backgroundColor: '#1a3d0a' }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: '#7ed957', fontFamily: "'Montserrat', sans-serif" }}
          >
            AI-Powered Platform
          </p>

          <h1
            className="font-black text-white leading-tight"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
            }}
          >
            Farm-Link
            <br />
            Zambia
          </h1>

          <p
            className="mt-5 mb-8 leading-relaxed max-w-sm"
            style={{ fontSize: '0.9rem', color: '#b8d4a0' }}
          >
            Personalised crop advice, pest management, and weather insights — grounded in ZARI
            research and built for Zambian smallholder farmers.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onGetStarted}
              className="text-sm font-semibold px-7 py-2.5 text-white rounded-sm transition-colors"
              style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#3d8c19' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4aa822')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3d8c19')}
            >
              Get Started Free
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="text-sm font-semibold px-7 py-2.5 text-white rounded-sm"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                border: '1.5px solid rgba(255,255,255,0.35)',
                background: 'transparent',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.75)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: '#2d6a19', fontFamily: "'Montserrat', sans-serif" }}
            >
              Services
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Everything you need to farm smarter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="p-6 border border-gray-100 rounded-lg transition-all duration-200"
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#bbf7d0'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,106,25,0.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#f1f5f9'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#f0fce8', color: '#2d6a19' }}
                >
                  {f.icon}
                </div>
                <h3
                  className="font-semibold text-gray-900 mb-2 text-[15px]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" style={{ backgroundColor: '#1a3d0a' }} className="py-20 sm:py-24">
        <div className="max-w-xl mx-auto px-5 sm:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Ready to transform your farming?
          </h2>
          <p className="text-[15px] leading-relaxed mb-10" style={{ color: '#8bbf6a' }}>
            Join Zambian farmers already using Farm-Link to increase yields and reduce losses.
          </p>
          <button
            onClick={onGetStarted}
            className="font-semibold text-sm px-10 py-3 rounded-sm bg-white"
            style={{ fontFamily: "'Montserrat', sans-serif", color: '#1a3d0a' }}
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: '#0d1a08' }} className="py-6">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: '#2d6a19' }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3C9 3 6 6 6 9.5c0 3 1.5 4.5 6 4.5s6-1.5 6-4.5C18 6 15 3 12 3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6" />
              </svg>
            </div>
            <span
              className="text-white font-bold text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Farm-Link Zambia
            </span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; 2026 Farm-Link Zambia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
