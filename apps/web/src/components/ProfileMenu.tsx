import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function ProfileMenu() {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    email: user?.email || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.id) {
        setError('User not authenticated')
        return
      }

      // Update user in Firebase
      await updateDoc(doc(db, 'users', user.id), {
        name: formData.name,
        location: formData.location,
        updatedAt: new Date(),
      })

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setIsEditOpen(false)
        setIsOpen(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U'
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center font-bold text-white text-sm"
        style={{
          backgroundColor: '#1a3a2e',
          border: '2px solid #d4af37',
          cursor: 'pointer',
        }}
        title={user?.name || 'Profile'}
      >
        {getInitial(user?.name || 'User')}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg border shadow-lg overflow-hidden animate-in fade-in duration-200 z-50"
          style={{
            backgroundColor: isDark ? '#1a3a2e' : 'white',
            borderColor: isDark ? '#2d5a52' : '#e0d9d0',
          }}
        >
          {/* User Info */}
          <div
            className="px-4 py-3 border-b transition-colors duration-300"
            style={{
              backgroundColor: isDark ? '#0f2027' : '#f5f3f0',
              borderColor: isDark ? '#2d5a52' : '#e0d9d0',
            }}
          >
            <p
              className="text-xs transition-colors duration-300"
              style={{ color: isDark ? '#bfaea3' : '#888' }}
            >
              Signed in as
            </p>
            <p
              className="font-semibold text-sm transition-colors duration-300"
              style={{ color: isDark ? 'white' : '#1a3a2e' }}
            >
              {user?.name || 'User'}
            </p>
            <p
              className="text-xs transition-colors duration-300"
              style={{ color: isDark ? '#bfaea3' : '#888' }}
            >
              {user?.location || 'Location not set'}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsEditOpen(true)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm transition-colors duration-300 hover:bg-opacity-50"
              style={{
                color: isDark ? 'white' : '#1a3a2e',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = isDark ? '#2d5a52' : '#f5f3f0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              ✎ Edit Profile
            </button>
            <button
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
              className="w-full text-left px-4 py-2 text-sm transition-colors duration-300 hover:bg-opacity-50 border-t"
              style={{
                color: '#c0392b',
                backgroundColor: 'transparent',
                borderColor: isDark ? '#2d5a52' : '#e0d9d0',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = isDark ? '#2d5a52' : '#f5f3f0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              ⌄ Logout
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200"
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="rounded-lg border p-6 w-full max-w-md animate-in zoom-in duration-300"
            style={{
              backgroundColor: isDark ? '#1a3a2e' : 'white',
              borderColor: isDark ? '#2d5a52' : '#e0d9d0',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2
              className="text-2xl font-bold mb-4 transition-colors duration-300"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: isDark ? 'white' : '#1a3a2e',
              }}
            >
              Edit Profile
            </h2>

            {error && (
              <div
                className="p-3 rounded-lg mb-4 text-sm"
                style={{
                  backgroundColor: 'rgba(192, 57, 43, 0.1)',
                  border: '1px solid rgba(192, 57, 43, 0.3)',
                  color: '#c0392b',
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="p-3 rounded-lg mb-4 text-sm"
                style={{
                  backgroundColor: 'rgba(39, 174, 96, 0.1)',
                  border: '1px solid rgba(39, 174, 96, 0.3)',
                  color: '#27ae60',
                }}
              >
                Profile updated successfully!
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              {/* Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: isDark ? 'white' : '#1a3a2e' }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border transition-all duration-300 focus:outline-none"
                  style={{
                    backgroundColor: isDark ? '#0f2027' : 'white',
                    borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                    color: isDark ? 'white' : '#3d3d3d',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#d4af37'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = isDark ? '#2d5a52' : '#e0d9d0'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Location */}
              <div>
                <label
                  className="block text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: isDark ? 'white' : '#1a3a2e' }}
                >
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Lusaka, Zambia"
                  className="w-full px-3 py-2 rounded-lg border transition-all duration-300 focus:outline-none"
                  style={{
                    backgroundColor: isDark ? '#0f2027' : 'white',
                    borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                    color: isDark ? 'white' : '#3d3d3d',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#d4af37'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = isDark ? '#2d5a52' : '#e0d9d0'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label
                  className="block text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: isDark ? '#bfaea3' : '#888' }}
                >
                  Email (Cannot change)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border opacity-60 cursor-not-allowed"
                  style={{
                    backgroundColor: isDark ? '#0f2027' : '#f5f3f0',
                    borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                    color: isDark ? '#bfaea3' : '#888',
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                style={{
                  backgroundColor: isDark ? '#2d5a52' : '#f5f3f0',
                  color: isDark ? 'white' : '#1a3a2e',
                  border: `1px solid ${isDark ? '#2d5a52' : '#e0d9d0'}`,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300"
                style={{
                  backgroundColor: loading ? '#bfaea3' : '#1a3a2e',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
