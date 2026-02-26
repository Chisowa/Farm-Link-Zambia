import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { ProfileMenu } from '@/components/ProfileMenu'

interface LandingProps {
  onLoginClick?: () => void
  onSignupClick?: () => void
}

export default function LandingPage({ onLoginClick, onSignupClick }: LandingProps) {
  const { isDark, toggleDarkMode } = useTheme()
  const { user } = useAuth()

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-white'}`}
    >
      {/* Navigation */}
      <nav
        className="fixed top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300"
        style={{
          backgroundColor: isDark ? 'rgba(15, 32, 39, 0.95)' : 'rgba(245, 243, 240, 0.95)',
          borderColor: 'rgba(212, 175, 55, 0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xl sm:text-2xl font-bold transition-colors duration-300"
              style={{ color: '#1a3a2e' }}
            >
              Farm-Link
            </span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium">
            {['Features', 'About', 'Get Started'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="transition-colors duration-300 relative group"
                style={{ color: '#3d3d3d' }}
              >
                {item}
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-400 group-hover:w-full"
                  style={{ backgroundColor: '#d4af37' }}
                ></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-colors duration-300"
              style={{ color: isDark ? '#d4af37' : '#3d3d3d' }}
            >
              {isDark ? '☀' : '☾'}
            </button>

            {/* Show Profile Menu if user is logged in, otherwise show auth buttons */}
            {user ? (
              <ProfileMenu />
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-sm md:text-base font-medium transition-colors duration-300"
                  style={{ color: '#1a3a2e' }}
                >
                  Sign In
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-white"
                  style={{ backgroundColor: '#1a3a2e' }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="w-full pt-32 pb-20 sm:pt-40 sm:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a52 100%)' }}
      >
        {/* Floating background */}
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

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-in fade-in duration-800">
            <div className="space-y-4">
              <h1
                className="text-5xl sm:text-6xl font-bold leading-tight text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Premium Intelligence for Zambian Agriculture
              </h1>
              <p className="text-xl text-white/90 font-light">
                Experience sophisticated AI-powered farming guidance. Real-time weather, crop
                expertise, and pest management—designed for serious farmers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onSignupClick}
                className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{
                  backgroundColor: 'white',
                  color: '#1a3a2e',
                }}
              >
                Start Free
              </button>
              <button
                onClick={() =>
                  window.scrollTo({
                    top: (document.querySelector('#features') as HTMLElement)?.offsetTop,
                    behavior: 'smooth',
                  })
                }
                className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                }}
              >
                Learn More
              </button>
            </div>

            <div
              className="grid grid-cols-3 gap-4 pt-8 border-t"
              style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              {[
                { value: '24/7', label: 'AI Advisory' },
                { value: '50+', label: 'Crop Types' },
                { value: '100%', label: 'Free Forever' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-left animate-in fade-in duration-800"
                  style={{ animationDelay: `${0.6 + i * 0.1}s` }}
                >
                  <div className="text-3xl font-bold" style={{ color: '#d4af37' }}>
                    {stat.value}
                  </div>
                  <div className="mt-1 text-white/80 text-sm font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right duration-800">
            <img
              src="https://images.unsplash.com/photo-1561319612-04c209af8e35?fm=jpg&q=60&w=800&auto=format&fit=crop"
              alt="Agricultural field"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
        style={{ backgroundColor: isDark ? '#0f2027' : 'white' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in duration-800">
            <h2
              className="text-4xl font-bold mb-4 transition-colors duration-300"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: isDark ? 'white' : '#1a3a2e',
              }}
            >
              Refined Excellence
            </h2>
            <div className="w-16 h-1 mx-auto mb-4" style={{ backgroundColor: '#d4af37' }}></div>
            <p
              className="text-xl transition-colors duration-300"
              style={{ color: isDark ? '#bfaea3' : '#666' }}
            >
              Comprehensive agricultural tools built with sophistication and precision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '▬',
                title: 'AI Advisor',
                desc: 'Sophisticated conversational AI trained on agricultural research. Get instant expert advice on crops, pests, and farming techniques.',
              },
              {
                icon: '◆',
                title: 'Weather Intelligence',
                desc: 'Precision forecasts for your exact location. Plan planting, spraying, and harvesting with confidence and accuracy.',
              },
              {
                icon: '●',
                title: 'Crop Expertise',
                desc: 'Detailed growing guides for Zambian crops. Learn optimal conditions, timing, and best varieties for maximum yield.',
              },
              {
                icon: '✓',
                title: 'Location-Specific',
                desc: "Personalized insights based on your region's soil, climate, and conditions. Truly localized agricultural intelligence.",
              },
              {
                icon: '◈',
                title: 'Real-Time Data',
                desc: 'Stay informed with current weather patterns, pest alerts, and seasonal recommendations for your area.',
              },
              {
                icon: '✤',
                title: 'Always Complimentary',
                desc: 'Every feature available at no cost. Built to empower Zambian farmers with world-class agricultural technology.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-lg border p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in"
                style={{
                  backgroundColor: isDark ? '#1a3a2e' : '#f5f3f0',
                  borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                  borderTop: '3px solid #d4af37',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div className="mb-4 text-2xl opacity-80">{feature.icon}</div>
                <h3
                  className="text-2xl font-semibold mb-3 transition-colors duration-300"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: isDark ? 'white' : '#1a3a2e',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="transition-colors duration-300"
                  style={{ color: isDark ? '#bfaea3' : '#666' }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        className="w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
        style={{ backgroundColor: '#1a3a2e', color: 'white' }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg h-96 w-full">
            <img
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop"
              alt="Healthy crops"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6 animate-in fade-in duration-800 delay-200">
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Built for Excellence
            </h2>
            <div className="space-y-4 text-lg font-light">
              <p>
                Farm-Link represents a new standard in agricultural technology. We partner with ZARI
                and the Ministry of Agriculture to deliver verified, research-backed guidance.
              </p>
              <p>
                Whether farming in Lusaka, Kitwe, Livingstone, or any Zambian region, our platform
                understands your local climate, soil, and opportunities.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { value: '10+', label: 'Regions' },
                { value: '50+', label: 'Crops' },
                { value: '24/7', label: 'Support' },
                { value: '100%', label: 'Free' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-4 text-center transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderColor: '#d4af37',
                  }}
                >
                  <div className="text-3xl font-bold" style={{ color: '#d4af37' }}>
                    {stat.value}
                  </div>
                  <div className="mt-2 font-medium text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-center transition-colors duration-300"
        style={{ background: 'linear-gradient(135deg, #0f2027 0%, #1a3a2e 100%)' }}
      >
        <div className="max-w-4xl mx-auto relative z-10 animate-in fade-in duration-800">
          <h2
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Begin Your Journey
          </h2>
          <p className="text-xl text-white/90 font-light mb-8">
            Join discerning Zambian farmers elevating their agricultural practice with Farm-Link.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSignupClick}
              className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: 'white', color: '#1a3a2e' }}
            >
              Get Started Free
            </button>
            <button
              onClick={onLoginClick}
              className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="w-full py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
        style={{ backgroundColor: '#2d2d2d', color: '#aaa' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            {[
              { title: 'Platform', links: ['Features', 'Security', 'Support'] },
              { title: 'Company', links: ['About', 'Contact', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
            ].map((col, i) => (
              <div key={i}>
                <h3
                  className="font-semibold mb-4 transition-colors duration-300"
                  style={{ color: isDark ? '#d4af37' : 'white' }}
                >
                  {col.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="transition-colors duration-300 hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="border-t pt-8 text-center text-sm"
            style={{ borderColor: '#444', color: '#888' }}
          >
            <p>&copy; 2026 Farm-Link Zambia. Premium agricultural intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
