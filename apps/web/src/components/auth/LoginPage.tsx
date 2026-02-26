import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AuthLayout } from '@/components/layouts/Layouts'
import { FormInput, FormButton, FormError } from '@/components/forms/FormComponents'

interface LoginPageProps {
  onLoginSuccess?: () => void
  onSignupClick?: () => void
}

export function LoginPage({ onLoginSuccess, onSignupClick }: LoginPageProps) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      await login(formData.email, formData.password)
      onLoginSuccess?.()
    } catch (err) {
      const firebaseError = err as { code?: string; message: string }
      let errorMessage = 'Login failed. Please try again.'

      if (firebaseError.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.'
      } else if (firebaseError.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.'
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.'
      } else if (firebaseError.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.'
      } else if (firebaseError.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please try again later.'
      }

      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your Farm-Link account">
      {error && <FormError message={error} />}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <FormInput
          type="email"
          name="email"
          label="Email Address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <FormInput
          type="password"
          name="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <FormButton type="submit" loading={isSubmitting}>
          Sign In
        </FormButton>
      </form>

      <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
        <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '0.875rem', fontWeight: 300, color: '#bfaea3' }}>
          Don&apos;t have an account?{' '}
          <button
            onClick={onSignupClick}
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: '"Lato", sans-serif',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: linkHovered ? '#d4af37' : '#1a3a2e',
              cursor: 'pointer',
              transition: 'color 0.25s ease',
              textDecoration: 'none',
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
