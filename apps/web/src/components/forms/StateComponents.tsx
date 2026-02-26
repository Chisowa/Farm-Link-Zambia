import React from 'react'

/* ─────────────────────────────────────────────
   LoadingSpinner
   ───────────────────────────────────────────── */
export function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          border: '2px solid rgba(212, 175, 55, 0.2)',
          borderTop: '2px solid #d4af37',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </>
  )
}

/* ─────────────────────────────────────────────
   LoadingPage
   ───────────────────────────────────────────── */
export function LoadingPage() {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: 'linear-gradient(135deg, #f5f3f0 0%, #ede9e4 100%)',
        }}
      >
        <LoadingSpinner size={40} />
        <p
          style={{
            fontFamily: '"Lato", sans-serif',
            fontSize: '0.85rem',
            color: '#bfaea3',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Loading
        </p>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────
   SkeletonBlock
   ───────────────────────────────────────────── */
export function SkeletonBlock({
  height = 20,
  width = '100%',
  borderRadius = 6,
  style: extraStyle,
}: {
  height?: number
  width?: number | string
  borderRadius?: number
  style?: React.CSSProperties
}) {
  return (
    <>
      <style>{`
        @keyframes skeleton-loading {
          0% { background-color: #e0d9d0; }
          50% { background-color: #f5f3f0; }
          100% { background-color: #e0d9d0; }
        }
        .skeleton {
          animation: skeleton-loading 1s infinite;
        }
      `}</style>
      <div
        className="skeleton"
        style={{ height: `${height}px`, width, borderRadius: `${borderRadius}px`, ...extraStyle }}
      />
    </>
  )
}

/* ─────────────────────────────────────────────
   SkeletonCard
   ───────────────────────────────────────────── */
export function SkeletonCard() {
  return (
    <>
      <style>{`
        @keyframes skeleton-loading {
          0% { background-color: #e0d9d0; }
          50% { background-color: #f5f3f0; }
          100% { background-color: #e0d9d0; }
        }
        .skeleton {
          animation: skeleton-loading 1s infinite;
        }
      `}</style>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e0d9d0',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
        }}
      >
        <SkeletonBlock height={18} width="60%" />
        <SkeletonBlock height={14} />
        <SkeletonBlock height={14} width="80%" />
        <SkeletonBlock height={14} width="40%" />
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────
   ErrorMessage
   ───────────────────────────────────────────── */
interface ErrorBoundaryProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ title, message, onRetry }: ErrorBoundaryProps) {
  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: 'rgba(192, 57, 43, 0.04)',
        border: '1px solid rgba(192, 57, 43, 0.15)',
        borderLeft: '3px solid #c0392b',
        borderRadius: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <span style={{ color: '#c0392b', fontSize: '1.2rem', marginTop: '-2px', flexShrink: 0 }}>
          !
        </span>
        <div style={{ flex: 1 }}>
          {title && (
            <h4
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#c0392b',
                marginBottom: '0.375rem',
              }}
            >
              {title}
            </h4>
          )}
          <p
            style={{
              fontFamily: '"Lato", sans-serif',
              fontSize: '0.9rem',
              color: '#c0392b',
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                marginTop: '0.875rem',
                padding: '0.5rem 1.25rem',
                backgroundColor: '#c0392b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: '"Lato", sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s ease',
              }}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   EmptyState
   ───────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
      }}
    >
      {icon && (
        <div style={{ color: '#bfaea3', marginBottom: '1rem', fontSize: '2rem' }}>{icon}</div>
      )}
      <h3
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#3d3d3d',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontFamily: '"Lato", sans-serif',
            fontSize: '0.9rem',
            color: '#bfaea3',
            marginBottom: '1.5rem',
            maxWidth: '360px',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
