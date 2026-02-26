import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { MainLayout } from '@/components/layouts/Layouts'
import { FormInput, FormButton, FormError, FormSuccess } from '@/components/forms/FormComponents'
import { LoadingSpinner } from '@/components/forms/StateComponents'

export function ProfilePage() {
  const { user, updateProfile, isLoading: authLoading } = useAuth()
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cardBg = isDark ? '#1a2e26' : '#ffffff'
  const cardBorder = isDark ? '#2a3f35' : '#e0d9d0'
  const textColor = isDark ? '#e8e0d6' : '#3d3d3d'
  const mutedColor = isDark ? '#9a8a7e' : '#bfaea3'

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim()) {
      setError('Name cannot be empty')
      return
    }

    setIsSubmitting(true)

    try {
      await updateProfile({
        name: formData.name.trim(),
        location: formData.location.trim(),
      })
      setSuccess('Profile updated successfully!')
    } catch (err) {
      console.error('Profile update error:', err)
      if (err instanceof Error) {
        if (err.message.includes('permission')) {
          setError('You do not have permission to update this profile')
        } else if (err.message.includes('failed') || err.message.includes('offline')) {
          setError('Failed to save profile. Please check your internet connection and try again.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (authLoading) {
    return (
      <MainLayout currentPage="profile">
        <div style={{ maxWidth: '640px' }}>
          <div
            style={{
              backgroundColor: cardBg,
              borderRadius: '12px',
              border: `1px solid ${cardBorder}`,
              padding: '4rem',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <LoadingSpinner size={40} />
              <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', color: mutedColor, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                Loading your profile...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // No user state
  if (!user) {
    return (
      <MainLayout currentPage="profile">
        <div style={{ maxWidth: '640px' }}>
          <FormError message="Unable to load user profile. Please try refreshing the page." />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout currentPage="profile">
      <div className="anim-fade-in" style={{ maxWidth: '640px' }}>

        {/* ── Profile card ── */}
        <div
          className="anim-slide-up"
          style={{
            backgroundColor: cardBg,
            borderRadius: '16px',
            border: `1px solid ${cardBorder}`,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(26,58,46,0.06)',
          }}
        >
          {/* Card header with gradient */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a3a2e, #2d5a52)',
              padding: '2rem 2.5rem',
              borderBottom: '2px solid #d4af37',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {/* Avatar */}
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  border: '2px solid rgba(212,175,55,0.4)',
                  background: 'rgba(212,175,55,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#d4af37',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '●'}
              </div>
              <div>
                <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.25px', marginBottom: '0.25rem' }}>
                  {user.name || 'Your Profile'}
                </h1>
                <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '0.875rem', fontWeight: 300, color: 'rgba(255,255,255,0.65)' }}>
                  Manage your account settings
                </p>
              </div>
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: '2rem 2.5rem' }}>
            {error && (
              <div style={{ marginBottom: '1.5rem' }}>
                <FormError message={error} />
              </div>
            )}
            {success && (
              <div style={{ marginBottom: '1.5rem' }}>
                <FormSuccess message={success} />
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <FormInput
                type="email"
                label="Email Address"
                value={formData.email}
                disabled
                style={{ opacity: 0.65, cursor: 'not-allowed' }}
              />

              <FormInput
                type="text"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <FormInput
                type="text"
                name="location"
                label="Location / Region"
                placeholder="e.g., Lusaka, Eastern Province"
                value={formData.location}
                onChange={handleChange}
              />

              <FormButton type="submit" loading={isSubmitting} disabled={authLoading}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </FormButton>
            </form>
          </div>

          {/* Account info footer */}
          <div
            style={{
              padding: '1.5rem 2.5rem',
              borderTop: `1px solid ${cardBorder}`,
              backgroundColor: isDark ? 'rgba(0,0,0,0.15)' : '#faf8f6',
            }}
          >
            <h3 style={{ fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: mutedColor, marginBottom: '1rem' }}>
              Account Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', fontWeight: 700, color: mutedColor, minWidth: '72px' }}>
                  User ID
                </span>
                <span style={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', fontWeight: 300, color: textColor, wordBreak: 'break-all' as const }}>
                  {user.id}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', fontWeight: 700, color: mutedColor, minWidth: '72px' }}>
                  Status
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '20px',
                    backgroundColor: isDark ? 'rgba(26,58,46,0.4)' : 'rgba(26,58,46,0.08)',
                    border: `1px solid ${isDark ? 'rgba(26,58,46,0.6)' : 'rgba(26,58,46,0.2)'}`,
                    fontFamily: '"Lato", sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: isDark ? '#a8d4b0' : '#1a3a2e',
                  }}
                >
                  <span style={{ fontSize: '0.55rem' }}>●</span>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
