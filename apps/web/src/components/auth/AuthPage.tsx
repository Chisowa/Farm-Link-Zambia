import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '../../contexts/AuthContext'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

interface AuthPageProps {
  onSuccess: () => void
  onClose?: () => void
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const { login, register, loginWithGoogle } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogle = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      onSuccess()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      if (!msg.includes('popup-closed-by-user')) {
        setError(friendlyError(msg))
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const switchMode = (next: 'login' | 'register') => {
    setMode(next)
    setError('')
  }

  const handleLogin = async (data: LoginForm) => {
    setError('')
    setSubmitting(true)
    try {
      await login(data.email, data.password)
      onSuccess()
    } catch (e: unknown) {
      setError(e instanceof Error ? friendlyError(e.message) : 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (data: RegisterForm) => {
    setError('')
    setSubmitting(true)
    try {
      await register(data.email, data.password, data.name)
      onSuccess()
    } catch (e: unknown) {
      setError(e instanceof Error ? friendlyError(e.message) : 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-green-600 focus:ring-2 focus:ring-green-600/10'

  return (
    <div
      className="bg-white rounded-xl overflow-hidden"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6 text-center" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div
          className="inline-flex w-11 h-11 rounded-full items-center justify-center mb-3 text-white"
          style={{ backgroundColor: '#1a3d0a' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.9} className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3C8 3 4 7 4 12c0 2 .8 4 2 5.5L12 21l6-3.5A9 9 0 0012 3z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M4 12h16" />
          </svg>
        </div>
        <h1
          className="text-[17px] font-bold text-gray-900"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Farm-Link Zambia
        </h1>
        <p className="text-xs text-gray-500 mt-1">AI-Powered Agricultural Advisory</p>
      </div>

      {/* Mode toggle */}
      <div className="px-8 pt-5">
        <div className="flex rounded-lg p-0.5" style={{ backgroundColor: '#f1f5f9' }}>
          <button
            type="button"
            onClick={() => switchMode('login')}
            className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            style={
              mode === 'login'
                ? {
                    backgroundColor: '#fff',
                    color: '#1a3d0a',
                    fontFamily: "'Montserrat', sans-serif",
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }
                : { backgroundColor: 'transparent', color: '#64748b' }
            }
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            style={
              mode === 'register'
                ? {
                    backgroundColor: '#fff',
                    color: '#1a3d0a',
                    fontFamily: "'Montserrat', sans-serif",
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }
                : { backgroundColor: 'transparent', color: '#64748b' }
            }
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-6">
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm text-red-700"
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
          >
            {error}
          </div>
        )}

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || submitting}
          className="w-full flex items-center justify-center gap-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50 disabled:opacity-60 mb-4"
        >
          {googleLoading ? (
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {googleLoading ? 'Signing in…' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                {...loginForm.register('email')}
                placeholder="farmer@example.com"
                className={inputClass}
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                {...loginForm.register('password')}
                placeholder="••••••••"
                className={inputClass}
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full text-sm font-semibold text-white py-2.5 rounded-lg transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#1a3d0a', fontFamily: "'Montserrat', sans-serif" }}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
              <input
                type="text"
                {...registerForm.register('name')}
                placeholder="John Banda"
                className={inputClass}
              />
              {registerForm.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                {...registerForm.register('email')}
                placeholder="farmer@example.com"
                className={inputClass}
              />
              {registerForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                {...registerForm.register('password')}
                placeholder="••••••••"
                className={inputClass}
              />
              {registerForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                {...registerForm.register('confirmPassword')}
                placeholder="••••••••"
                className={inputClass}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full text-sm font-semibold text-white py-2.5 rounded-lg transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#1a3d0a', fontFamily: "'Montserrat', sans-serif" }}
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function friendlyError(msg: string): string {
  if (
    msg.includes('user-not-found') ||
    msg.includes('wrong-password') ||
    msg.includes('invalid-credential')
  )
    return 'Invalid email or password.'
  if (msg.includes('email-already-in-use')) return 'An account with this email already exists.'
  if (msg.includes('weak-password')) return 'Password is too weak. Use at least 6 characters.'
  if (msg.includes('network-request-failed')) return 'Network error. Check your connection.'
  return 'Something went wrong. Please try again.'
}
