/**
 * Main application dashboard — shown after successful login.
 * Features:
 *  - AI Advisor: ask a question, see RAG-grounded response, give feedback
 *  - Advice history sidebar
 *  - Navigation header with user info + logout
 */
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useAdviceHistory, useAskAI, useSubmitFeedback } from '../hooks/useAskAI'

interface AdviceRecord {
  id: string
  queryText: string
  responseText: string
  sourcedDocuments: string[]
  feedback?: 'helpful' | 'not_helpful'
  createdAt: Date
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const userId = user?.uid ?? ''

  const [query, setQuery] = useState('')
  const [currentAdvice, setCurrentAdvice] = useState<AdviceRecord | null>(null)
  const [activeTab, setActiveTab] = useState<'ask' | 'history'>('ask')

  const askAI = useAskAI()
  const submitFeedback = useSubmitFeedback()
  const history = useAdviceHistory(userId)

  const handleAsk = async () => {
    if (!query.trim() || askAI.isPending) return
    try {
      const result = await askAI.mutateAsync({
        query: query.trim(),
        userId,
        language: 'en',
        knowledgeBaseDocs: [],
      })
      setCurrentAdvice(result as AdviceRecord)
      setQuery('')
      history.refetch()
    } catch {
      // error shown via askAI.error
    }
  }

  const handleFeedback = async (adviceId: string, feedback: 'helpful' | 'not_helpful') => {
    await submitFeedback.mutateAsync({ adviceId, feedback })
    if (currentAdvice?.id === adviceId) {
      setCurrentAdvice(prev => (prev ? { ...prev, feedback } : null))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAsk()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌾</span>
            <span className="font-bold text-green-700 text-lg">Farm-Link Zambia</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user?.displayName ?? user?.email}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-red-600 border border-gray-300 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: AI Advisor ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab bar */}
          <div className="flex gap-2 border-b border-gray-200 pb-2">
            <button
              onClick={() => setActiveTab('ask')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'ask'
                  ? 'text-green-700 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💬 Ask AI Advisor
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'history'
                  ? 'text-green-700 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 My History
            </button>
          </div>

          {activeTab === 'ask' && (
            <div className="space-y-4">
              {/* Query input */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ask your farming question
                </label>
                <textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="E.g. My maize leaves are yellowing and I see small insects underneath. What pest is this and how do I treat it?"
                  rows={4}
                  className="w-full resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">Press Ctrl+Enter to submit</p>
                  <button
                    onClick={handleAsk}
                    disabled={!query.trim() || askAI.isPending}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {askAI.isPending ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>Ask</>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {askAI.isError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
                  Failed to get advice. Please check your connection and try again.
                </div>
              )}

              {/* Response */}
              {currentAdvice && (
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                        Your question
                      </span>
                      <p className="text-sm text-gray-700 mt-0.5 italic">
                        "{currentAdvice.queryText}"
                      </p>
                    </div>
                    <span className="text-green-600 text-lg">🤖</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      AI Advisor Response
                    </span>
                    <div className="mt-2 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {currentAdvice.responseText}
                    </div>
                  </div>

                  {currentAdvice.sourcedDocuments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                        Sources
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentAdvice.sourcedDocuments.map(doc => (
                          <span
                            key={doc}
                            className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200"
                          >
                            📄 {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                    <span className="text-xs text-gray-500">Was this helpful?</span>
                    <button
                      onClick={() => handleFeedback(currentAdvice.id, 'helpful')}
                      className={`text-sm px-3 py-1 rounded-lg border transition-colors ${
                        currentAdvice.feedback === 'helpful'
                          ? 'bg-green-100 border-green-400 text-green-700'
                          : 'border-gray-200 hover:border-green-400 text-gray-500 hover:text-green-700'
                      }`}
                    >
                      👍 Yes
                    </button>
                    <button
                      onClick={() => handleFeedback(currentAdvice.id, 'not_helpful')}
                      className={`text-sm px-3 py-1 rounded-lg border transition-colors ${
                        currentAdvice.feedback === 'not_helpful'
                          ? 'bg-red-100 border-red-400 text-red-700'
                          : 'border-gray-200 hover:border-red-400 text-gray-500 hover:text-red-700'
                      }`}
                    >
                      👎 No
                    </button>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!currentAdvice && !askAI.isPending && (
                <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-8 text-center">
                  <span className="text-4xl block mb-3">🌱</span>
                  <p className="text-gray-500 text-sm">
                    Ask any question about your crops, pests, diseases, or farming practices.
                    <br />
                    The AI advisor uses ZARI research and Ministry of Agriculture documents to give
                    you grounded advice.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.isLoading && (
                <div className="text-center py-8 text-gray-400">Loading history...</div>
              )}
              {history.data?.advice.length === 0 && (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
                  <p className="text-gray-400 text-sm">
                    No advice history yet. Ask your first question!
                  </p>
                </div>
              )}
              {history.data?.advice.map((item: AdviceRecord) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                >
                  <p className="text-sm font-medium text-gray-800 mb-1">"{item.queryText}"</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.responseText}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('en-ZM', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {item.feedback && (
                      <span className="text-xs text-gray-400">
                        {item.feedback === 'helpful' ? '👍 Helpful' : '👎 Not helpful'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Quick info sidebar ───────────────────────────────── */}
        <div className="space-y-4">
          {/* Quick tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">💡 Example Questions</h3>
            <ul className="space-y-2">
              {EXAMPLE_QUESTIONS.map(q => (
                <li key={q}>
                  <button
                    onClick={() => {
                      setQuery(q)
                      setActiveTab('ask')
                    }}
                    className="text-xs text-left text-green-700 hover:text-green-900 hover:underline w-full"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">🚀 Features</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex gap-2">
                <span>🌿</span> Crop advice & planting guides
              </li>
              <li className="flex gap-2">
                <span>⚠️</span> Pest & disease identification
              </li>
              <li className="flex gap-2">
                <span>☁️</span> Weather-based recommendations
              </li>
              <li className="flex gap-2">
                <span>📚</span> ZARI & MoA research documents
              </li>
              <li className="flex gap-2">
                <span>🌍</span> Zambia-specific guidance
              </li>
            </ul>
          </div>

          {/* Agro-ecological zones note */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-4">
            <h3 className="font-semibold text-green-800 text-sm mb-2">🗺️ Your Region Matters</h3>
            <p className="text-xs text-green-700">
              Mention your province or district in your question for location-specific advice (e.g.
              "I'm in Eastern Province, what maize variety should I plant?").
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

const EXAMPLE_QUESTIONS = [
  'How do I treat armyworm on my maize crop?',
  'When is the best time to plant groundnuts in Zambia?',
  'My cassava leaves are curling — what disease is this?',
  'What fertilizer should I use for maize in sandy soil?',
  'How do I store my harvest to prevent grain borer?',
  'What is the recommended spacing for soybean planting?',
]
