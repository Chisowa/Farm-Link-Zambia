import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AuthLayout } from '@/components/layouts/Layouts'
import { FormInput, FormButton, FormError } from '@/components/forms/FormComponents'

interface SignupPageProps {
  onSignupSuccess?: () => void
  onLoginClick?: () => void
}

export function SignupPage({ onSignupSuccess, onLoginClick }: SignupPageProps) {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
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

    if (!formData.name) newErrors.name = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      await signup(formData.email, formData.password, formData.name)
      onSignupSuccess?.()
    } catch (err) {
      const firebaseError = err as { code?: string; message: string }
      let errorMessage = 'Signup failed. Please try again.'

      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.'
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.'
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.'
      } else if (firebaseError.code === 'auth/operation-not-allowed') {
        errorMessage = 'Account creation is currently disabled.'
      } else if (firebaseError.code === 'auth/too-many-requests') {
        errorMessage = 'Too many signup attempts. Please try again later.'
      }

      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Get Started" subtitle="Create your Farm-Link account">
      {error && <FormError message={error} />}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <FormInput
          type="text"
          name="name"
          label="Full Name"
          placeholder="John Farmer"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

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

        <FormInput
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <FormButton type="submit" loading={isSubmitting}>
          Create Account
        </FormButton>
      </form>

      <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
        <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '0.875rem', fontWeight: 300, color: '#bfaea3' }}>
          Already have an account?{' '}
          <button
            onClick={onLoginClick}
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
            Sign In
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
