import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useAdviceHistory, useAskAI, useClearHistory, useSubmitFeedback } from '../hooks/useAskAI'

interface AdviceRecord {
  id: string
  queryText: string
  responseText: string
  sourcedDocuments: string[]
  feedback?: 'helpful' | 'not_helpful'
  createdAt: Date | string
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const userId = user?.uid ?? ''

  const [query, setQuery] = useState('')
  const [currentAdvice, setCurrentAdvice] = useState<AdviceRecord | null>(null)
  const [activeTab, setActiveTab] = useState<'ask' | 'history'>('ask')
  const [confirmClear, setConfirmClear] = useState(false)

  const askAI = useAskAI()
  const submitFeedback = useSubmitFeedback()
  const clearHistory = useClearHistory()
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

  const handleClearHistory = async () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    await clearHistory.mutateAsync({ userId })
    setConfirmClear(false)
    history.refetch()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAsk()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="font-semibold text-gray-900 tracking-tight">Farm Link Zambia</span>
          <div className="flex items-center gap-5">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user?.displayName ?? user?.email}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Advisor panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('ask')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'ask'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Advisor
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'history'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              History
            </button>
          </div>

          {/* Ask tab */}
          {activeTab === 'ask' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your question
                </label>
                <textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your farming issue or ask about crops, pests, diseases, soil, or planting practices."
                  rows={4}
                  className="w-full resize-none border border-gray-200 rounded-md p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">Ctrl+Enter to submit</span>
                  <button
                    onClick={handleAsk}
                    disabled={!query.trim() || askAI.isPending}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {askAI.isPending ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {askAI.isError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  Something went wrong. Please check your connection and try again.
                </div>
              )}

              {/* Response */}
              {currentAdvice && (
                <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                      Question
                    </p>
                    <p className="text-sm text-gray-600 italic">"{currentAdvice.queryText}"</p>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
                      Response
                    </p>
                    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {currentAdvice.responseText}
                    </div>
                  </div>

                  {currentAdvice.sourcedDocuments.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentAdvice.sourcedDocuments.map(doc => (
                          <span
                            key={doc}
                            className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded border border-gray-200"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                    <span className="text-xs text-gray-500">Was this helpful?</span>
                    <button
                      onClick={() => handleFeedback(currentAdvice.id, 'helpful')}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                        currentAdvice.feedback === 'helpful'
                          ? 'bg-green-50 border-green-400 text-green-700 font-medium'
                          : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                      }`}
                    >
                      Helpful
                    </button>
                    <button
                      onClick={() => handleFeedback(currentAdvice.id, 'not_helpful')}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                        currentAdvice.feedback === 'not_helpful'
                          ? 'bg-red-50 border-red-400 text-red-700 font-medium'
                          : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                      }`}
                    >
                      Not helpful
                    </button>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!currentAdvice && !askAI.isPending && (
                <div className="bg-white rounded-lg border border-dashed border-gray-200 p-10 text-center">
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Ask about crops, pests, diseases, soil, or planting. Responses are grounded in
                    ZARI research and Ministry of Agriculture publications.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* History tab */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {/* History header with clear button */}
              {history.data && history.data.advice.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {history.data.advice.length} conversation
                    {history.data.advice.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={handleClearHistory}
                    disabled={clearHistory.isPending}
                    className={`text-xs transition-colors ${
                      confirmClear
                        ? 'text-red-600 font-medium hover:text-red-800'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    {clearHistory.isPending
                      ? 'Clearing...'
                      : confirmClear
                        ? 'Confirm — this cannot be undone'
                        : 'Clear history'}
                  </button>
                </div>
              )}

              {history.isLoading && (
                <div className="text-center py-10 text-sm text-gray-400">Loading...</div>
              )}

              {!history.isLoading && history.data?.advice.length === 0 && (
                <div className="bg-white rounded-lg border border-dashed border-gray-200 p-10 text-center">
                  <p className="text-sm text-gray-400">No conversations yet.</p>
                </div>
              )}

              {history.data?.advice.map((item: AdviceRecord) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-800 mb-1">{item.queryText}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.responseText}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('en-ZM', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {item.feedback && (
                      <span
                        className={`text-xs ${item.feedback === 'helpful' ? 'text-green-600' : 'text-gray-400'}`}
                      >
                        {item.feedback === 'helpful' ? 'Helpful' : 'Not helpful'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Suggested questions
            </h3>
            <ul className="space-y-2">
              {EXAMPLE_QUESTIONS.map(q => (
                <li key={q}>
                  <button
                    onClick={() => {
                      setQuery(q)
                      setActiveTab('ask')
                    }}
                    className="text-xs text-left text-green-700 hover:text-green-900 hover:underline w-full leading-relaxed"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              What this covers
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>Crop advice and planting guides</li>
              <li>Pest and disease identification</li>
              <li>Weather-based recommendations</li>
              <li>ZARI and MoA research documents</li>
              <li>Zambia-specific farming guidance</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Location tip
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Include your province or district for location-specific advice — for example, "I am in
              Eastern Province, which maize variety should I plant?"
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
