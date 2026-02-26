import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useAdviceHistory, useAskAI, useClearHistory, useSubmitFeedback } from '../hooks/useAskAI'
import WeatherModal from './WeatherModal'

interface AdviceRecord {
  id: string
  queryText: string
  responseText: string
  sourcedDocuments: string[]
  feedback?: 'helpful' | 'not_helpful'
  createdAt: Date | string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  id?: string
  feedback?: 'helpful' | 'not_helpful'
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ny', label: 'Nyanja' },
  { code: 'bem', label: 'Bemba' },
  { code: 'toi', label: 'Tonga' },
  { code: 'loz', label: 'Lozi' },
  { code: 'kqn', label: 'Kaonde' },
  { code: 'lue', label: 'Luvale' },
]

const EXAMPLE_QUESTIONS = [
  'How do I treat armyworm on my maize crop?',
  'When is the best time to plant groundnuts in Zambia?',
  'My cassava leaves are curling — what disease is this?',
  'What fertilizer should I use for maize in sandy soil?',
  'How do I store my harvest to prevent grain borer?',
  'What is the recommended spacing for soybean planting?',
]

// ── Logo SVG ──────────────────────────────────────────────────────────────────
function LeafIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3C8 3 4 7 4 12c0 2 .8 4 2 5.5L12 21l6-3.5A9 9 0 0012 3z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M4 12h16" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth()

  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [weatherOpen, setWeatherOpen] = useState(false)
  const [language, setLanguage] = useState('en')

  const askAI = useAskAI()
  const submitFeedback = useSubmitFeedback()
  const clearHistory = useClearHistory()
  const history = useAdviceHistory(!!user)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, askAI.isPending])

  const userInitial = (user?.displayName?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase()
  const userName = user?.displayName ?? user?.email ?? ''

  const resizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value)
    resizeTextarea(e.target)
  }

  const handleAsk = async () => {
    const text = query.trim()
    if (!text || askAI.isPending) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setQuery('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const result = await askAI.mutateAsync({
        query: text,
        language,
        knowledgeBaseDocs: [],
      })
      const res = result as AdviceRecord
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.responseText,
          sources: res.sourcedDocuments,
          id: res.id,
        },
      ])
      history.refetch()
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please check your connection and try again.',
        },
      ])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleAsk()
    }
  }

  const handleFeedback = async (id: string, feedback: 'helpful' | 'not_helpful') => {
    await submitFeedback.mutateAsync({ adviceId: id, feedback })
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, feedback } : m)))
  }

  const handleNewChat = () => {
    setMessages([])
    setQuery('')
    setSidebarOpen(false)
  }

  const loadHistoryItem = (item: AdviceRecord) => {
    setMessages([
      { role: 'user', content: item.queryText },
      {
        role: 'assistant',
        content: item.responseText,
        sources: item.sourcedDocuments,
        id: item.id,
        feedback: item.feedback,
      },
    ])
    setSidebarOpen(false)
  }

  const handleClearHistory = async () => {
    await clearHistory.mutateAsync()
    setMessages([])
    history.refetch()
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-white"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      {/* ── Weather modal ── */}
      {weatherOpen && <WeatherModal onClose={() => setWeatherOpen(false)} />}

      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col flex-shrink-0 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ backgroundColor: '#111820' }}
      >
        {/* Logo row */}
        <div className="px-4 h-14 flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: '#2d6a19' }}
            >
              <LeafIcon className="w-4 h-4" />
            </div>
            <span
              className="text-white font-bold text-[13.5px]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Farm-Link
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-300 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* New chat + Weather buttons */}
        <div className="px-3 pt-3 pb-2 shrink-0 space-y-1.5">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 text-sm text-gray-300 py-2 px-3 rounded-md transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New chat</span>
          </button>

          <button
            onClick={() => setWeatherOpen(true)}
            className="w-full flex items-center gap-2 text-sm text-gray-300 py-2 px-3 rounded-md transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            <span>Weather</span>
          </button>

          {/* Language selector */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <svg
              className="w-4 h-4 shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none cursor-pointer"
              style={{ color: '#d1d5db' }}
            >
              {LANGUAGES.map(l => (
                <option
                  key={l.code}
                  value={l.code}
                  style={{ backgroundColor: '#111820', color: '#d1d5db' }}
                >
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-3 py-1 min-h-0">
          {history.isLoading && <p className="text-xs text-gray-600 px-2 py-3">Loading…</p>}
          {history.isError && (
            <p className="text-xs text-red-400 px-2 py-3">Failed to load history.</p>
          )}
          {history.data && history.data.advice.length === 0 && !history.isLoading && (
            <p className="text-xs text-gray-600 px-2 py-3">No history yet.</p>
          )}
          {history.data && history.data.advice.length > 0 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-2 pt-2 pb-1.5">
                Recent
              </p>
              {history.data.advice.map((item: AdviceRecord) => (
                <button
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className="w-full text-left text-xs text-gray-400 px-3 py-2.5 rounded-md truncate block transition-colors mb-0.5"
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.color = '#d1d5db'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#9ca3af'
                  }}
                >
                  {item.queryText}
                </button>
              ))}
              <button
                onClick={handleClearHistory}
                disabled={clearHistory.isPending}
                className="w-full text-left text-[11px] text-gray-600 px-3 py-2 mt-1 transition-colors hover:text-red-400 disabled:opacity-50 rounded-md"
              >
                {clearHistory.isPending ? 'Clearing…' : 'Clear history'}
              </button>
            </>
          )}
        </div>

        {/* User row */}
        <div
          className="px-3 py-3 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: '#2d6a19' }}
              >
                {userInitial}
              </div>
              <span className="text-xs text-gray-400 truncate">{userName}</span>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="text-gray-500 hover:text-gray-300 transition-colors p-1 shrink-0 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top bar — always visible on mobile, shown on desktop only when sidebar is open state irrelevant */}
        <div
          className="h-14 px-4 flex items-center gap-3 shrink-0 lg:hidden"
          style={{ borderBottom: '1px solid #f1f5f9' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 text-gray-500 hover:text-gray-800 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span
            className="text-sm font-semibold text-gray-800"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Farm-Link Zambia
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-5 py-12">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5 text-white"
                style={{ backgroundColor: '#1a3d0a' }}
              >
                <LeafIcon className="w-6 h-6" />
              </div>
              <h2
                className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Farm-Link Zambia
              </h2>
              <p className="text-sm text-gray-500 text-center max-w-sm mb-10 leading-relaxed">
                AI-powered agricultural advisory. Ask anything about crops, pests, soil, or
                planting.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
                {EXAMPLE_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuery(q)
                      textareaRef.current?.focus()
                    }}
                    className="text-left text-sm p-4 rounded-lg text-gray-600 transition-all"
                    style={{ border: '1px solid #e2e8f0', backgroundColor: '#fafafa' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#86efac'
                      e.currentTarget.style.backgroundColor = '#f0fce8'
                      e.currentTarget.style.color = '#166534'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.backgroundColor = '#fafafa'
                      e.currentTarget.style.color = '#4b5563'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div
                      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-white"
                      style={{ backgroundColor: '#1a3d0a' }}
                    >
                      <LeafIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[82%] space-y-2 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}
                  >
                    <div
                      className="px-4 py-3 text-sm leading-[1.7] whitespace-pre-wrap"
                      style={
                        msg.role === 'user'
                          ? {
                              backgroundColor: '#1a3d0a',
                              color: '#f0fce8',
                              borderRadius: '1rem 1rem 0.25rem 1rem',
                            }
                          : {
                              backgroundColor: '#f8fafc',
                              color: '#1e293b',
                              borderRadius: '1rem 1rem 1rem 0.25rem',
                              border: '1px solid #f1f5f9',
                            }
                      }
                    >
                      {msg.content}
                    </div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 px-0.5">
                        {msg.sources.map(s => (
                          <span
                            key={s}
                            className="text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: '#f8fafc',
                              color: '#64748b',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              className="w-3 h-3 shrink-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {msg.id && (
                      <div className="flex items-center gap-2 px-0.5">
                        <span className="text-[11px] text-gray-400">Helpful?</span>
                        <button
                          onClick={() => handleFeedback(msg.id!, 'helpful')}
                          className="text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-full transition-all"
                          style={
                            msg.feedback === 'helpful'
                              ? {
                                  backgroundColor: '#dcfce7',
                                  color: '#166534',
                                  border: '1px solid #86efac',
                                }
                              : {
                                  backgroundColor: 'transparent',
                                  color: '#9ca3af',
                                  border: '1px solid #e2e8f0',
                                }
                          }
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            className="w-3 h-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
                            />
                          </svg>
                          Yes
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id!, 'not_helpful')}
                          className="text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-full transition-all"
                          style={
                            msg.feedback === 'not_helpful'
                              ? {
                                  backgroundColor: '#fee2e2',
                                  color: '#991b1b',
                                  border: '1px solid #fca5a5',
                                }
                              : {
                                  backgroundColor: 'transparent',
                                  color: '#9ca3af',
                                  border: '1px solid #e2e8f0',
                                }
                          }
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            className="w-3 h-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"
                            />
                          </svg>
                          No
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div
                      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
                      style={{ backgroundColor: '#2d6a19' }}
                    >
                      {userInitial}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {askAI.isPending && (
                <div className="flex gap-3 justify-start">
                  <div
                    className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-white"
                    style={{ backgroundColor: '#1a3d0a' }}
                  >
                    <LeafIcon className="w-3.5 h-3.5" />
                  </div>
                  <div
                    className="px-4 py-3"
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      borderRadius: '1rem 1rem 1rem 0.25rem',
                    }}
                  >
                    <div className="flex gap-1 items-center h-5">
                      {[0, 150, 300].map(delay => (
                        <span
                          key={delay}
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ backgroundColor: '#94a3b8', animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {askAI.isError && (
                <p className="text-xs text-center text-red-500">
                  Request failed — please try again.
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Input bar ── */}
        <div className="shrink-0 px-4 sm:px-6 py-4" style={{ borderTop: '1px solid #f1f5f9' }}>
          <div className="max-w-2xl mx-auto">
            <div
              className="flex items-end gap-2 rounded-xl px-4 py-2.5 transition-all"
              style={{ border: '1.5px solid #e2e8f0', backgroundColor: '#fff' }}
              onFocusCapture={e => (e.currentTarget.style.borderColor = '#2d6a19')}
              onBlurCapture={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <textarea
                ref={textareaRef}
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about crops, pests, diseases, or soil…"
                rows={1}
                className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none leading-relaxed py-0.5"
                style={{ minHeight: '24px', maxHeight: '160px' }}
              />
              <button
                onClick={handleAsk}
                disabled={!query.trim() || askAI.isPending}
                className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-white transition-colors disabled:cursor-not-allowed"
                style={{
                  backgroundColor: query.trim() && !askAI.isPending ? '#1a3d0a' : '#d1d5db',
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-2 hidden sm:block">
              Ctrl+Enter to send &nbsp;·&nbsp; Responses grounded in ZARI &amp; Ministry of
              Agriculture research
            </p>
            <p className="text-[11px] text-gray-400 text-center mt-2 sm:hidden">
              Ctrl+Enter to send
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
