import React from 'react'
import { useTheme } from '@/context/ThemeContext'

/* ─────────────────────────────────────────────
   FormInput
   ───────────────────────────────────────────── */
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const { isDark } = useTheme()
    const [focused, setFocused] = React.useState(false)

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '0.75rem 1rem',
      fontFamily: '"Lato", sans-serif',
      fontSize: '0.95rem',
      fontWeight: 400,
      color: isDark ? '#f5f3f0' : '#3d3d3d',
      backgroundColor: isDark ? '#0f1a15' : '#faf8f6',
      border: `1px solid ${error ? '#c0392b' : focused ? '#d4af37' : isDark ? '#2a3f35' : '#e0d9d0'}`,
      borderRadius: '8px',
      outline: 'none',
      boxShadow: focused ? '0 0 0 3px rgba(212, 175, 55, 0.12)' : 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
    }

    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label
            style={{
              display: 'block',
              fontFamily: '"Lato", sans-serif',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isDark ? '#9a8a7e' : '#bfaea3',
              marginBottom: '0.5rem',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={inputStyle}
          className={className}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {error && (
          <p
            style={{
              fontFamily: '"Lato", sans-serif',
              fontSize: '0.8rem',
              color: '#c0392b',
              marginTop: '0.375rem',
            }}
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
FormInput.displayName = 'FormInput'

/* ─────────────────────────────────────────────
   FormButton
   ───────────────────────────────────────────── */
interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

export const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ loading = false, variant = 'primary', children, disabled, className = '', style: propStyle, ...props }, ref) => {
    const [hovered, setHovered] = React.useState(false)

    const baseStyle: React.CSSProperties = {
      width: '100%',
      padding: '0.875rem 1.5rem',
      fontFamily: '"Lato", sans-serif',
      fontSize: '0.9rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      borderRadius: '8px',
      border: 'none',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transform: hovered && !disabled && !loading ? 'translateY(-2px)' : 'translateY(0)',
    }

    const primaryStyle: React.CSSProperties = {
      ...baseStyle,
      backgroundColor: hovered && !disabled && !loading ? '#d4af37' : '#1a3a2e',
      color: hovered && !disabled && !loading ? '#1a3a2e' : '#f5f3f0',
      boxShadow: hovered && !disabled && !loading
        ? '0 6px 20px rgba(212, 175, 55, 0.3)'
        : '0 2px 8px rgba(26, 58, 46, 0.2)',
    }

    const secondaryStyle: React.CSSProperties = {
      ...baseStyle,
      backgroundColor: 'transparent',
      color: hovered && !disabled && !loading ? '#d4af37' : '#1a3a2e',
      border: `1px solid ${hovered && !disabled && !loading ? '#d4af37' : '#1a3a2e'}`,
      boxShadow: hovered && !disabled && !loading ? '0 4px 12px rgba(212, 175, 55, 0.15)' : 'none',
    }

    const finalStyle = variant === 'primary' ? primaryStyle : secondaryStyle

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{ ...finalStyle, ...propStyle }}
        className={className}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        {loading && (
          <span
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        )}
        {children}
      </button>
    )
  }
)
FormButton.displayName = 'FormButton'

/* ─────────────────────────────────────────────
   FormError
   ───────────────────────────────────────────── */
interface FormErrorProps {
  message?: string
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null
  return (
    <div
      style={{
        padding: '0.875rem 1rem',
        backgroundColor: 'rgba(192, 57, 43, 0.06)',
        border: '1px solid rgba(192, 57, 43, 0.2)',
        borderLeft: '3px solid #c0392b',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
      }}
    >
      <span style={{ color: '#c0392b', fontSize: '0.75rem', marginTop: '1px', flexShrink: 0 }}>◆</span>
      <p
        style={{
          fontFamily: '"Lato", sans-serif',
          fontSize: '0.875rem',
          color: '#c0392b',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   FormSuccess
   ───────────────────────────────────────────── */
interface FormSuccessProps {
  message?: string
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null
  return (
    <div
      style={{
        padding: '0.875rem 1rem',
        backgroundColor: 'rgba(26, 58, 46, 0.05)',
        border: '1px solid rgba(26, 58, 46, 0.15)',
        borderLeft: '3px solid #1a3a2e',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
      }}
    >
      <span style={{ color: '#1a3a2e', fontSize: '0.75rem', marginTop: '1px', flexShrink: 0 }}>✓</span>
      <p
        style={{
          fontFamily: '"Lato", sans-serif',
          fontSize: '0.875rem',
          color: '#1a3a2e',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CSS spin keyframe (injected once)
   ───────────────────────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('form-spin-style')) {
  const style = document.createElement('style')
  style.id = 'form-spin-style'
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }'
  document.head.appendChild(style)
}
