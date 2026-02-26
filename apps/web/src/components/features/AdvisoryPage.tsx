import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useNavigation } from '@/context/NavigationContext'
import { useAuth } from '@/context/AuthContext'
import { ProfileMenu } from '@/components/ProfileMenu'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
}

export function AdvisoryPage() {
  const { isDark } = useTheme()
  const { navigateTo } = useNavigation()
  useAuth() // ensure auth context is available
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "Welcome. I'm your AI Agricultural Advisor. Ask me anything about crop management, pest control, weather patterns, or farming techniques specific to Zambian agriculture.",
    },
  ])
  const [input, setInput] = useState('')
  const [currentResponse, setCurrentResponse] = useState<string>('')

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content:
          'This is a placeholder response. Once your RAG engine is integrated, you will receive personalized agricultural advice based on verified research.',
      }
      setMessages(prev => [...prev, assistantMessage])
      setCurrentResponse(assistantMessage.content)
    }, 500)
  }

  const commonTopics = [
    'Crop Selection',
    'Pest Management',
    'Disease Control',
    'Weather Planning',
    'Planting Time',
    'Irrigation',
  ]

  const tips = [
    { title: 'Be Specific', description: 'Include crop type, symptoms, location' },
    { title: 'Ask One Question', description: 'Focus on a single topic' },
    { title: 'Describe Details', description: 'Help the AI identify issues accurately' },
    { title: 'Mention Your Region', description: 'Climate varies significantly' },
  ]

  return (
    <div
      className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}
    >
      {/* Profile Menu - Fixed top-right */}
      <div className="fixed top-6 right-6 z-50">
        <ProfileMenu />
      </div>

      <div className="max-w-7xl mx-auto animate-in fade-in duration-600">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigateTo('dashboard')}
            className="mb-4 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: isDark ? '#1a3a2e' : '#f5f3f0',
              color: isDark ? '#d4af37' : '#1a3a2e',
              border: `1px solid ${isDark ? '#2d5a52' : '#e0d9d0'}`,
            }}
          >
            ← Back to Dashboard
          </button>

          <h1
            className="text-4xl font-bold mb-2 transition-colors duration-300"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: isDark ? 'white' : '#1a3a2e',
            }}
          >
            AI Agricultural Advisor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get expert farming guidance from our intelligent advisor
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-100">
          {/* Chat Section */}
          <div
            className="lg:col-span-2 rounded-lg border overflow-hidden flex flex-col h-96 md:h-[600px] transition-colors duration-300"
            style={{
              backgroundColor: isDark ? '#1a3a2e' : 'white',
              borderColor: isDark ? '#2d5a52' : '#e0d9d0',
            }}
          >
            {/* Chat Header */}
            <div
              className="p-4 border-b text-white"
              style={{
                background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a52 100%)',
                borderColor: '#d4af37',
              }}
            >
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Chat with the Advisor
              </h2>
              <p className="text-sm text-white/80">Ask anything about farming, crops, or weather</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-in fade-in slide-in-from-bottom duration-500 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="rounded-lg px-4 py-2 max-w-xs transition-all duration-300"
                    style={{
                      backgroundColor: msg.type === 'assistant' ? '#e8dcc4' : '#1a3a2e',
                      color: msg.type === 'assistant' ? '#1a3a2e' : 'white',
                      border: msg.type === 'assistant' ? '1px solid #d4af37' : '1px solid #1a3a2e',
                    }}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              className="p-4 border-t transition-colors duration-300"
              style={{
                backgroundColor: isDark ? '#0f2027' : '#faf8f6',
                borderColor: isDark ? '#2d5a52' : '#e0d9d0',
              }}
            >
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask your farming question..."
                  className="flex-1 p-3 rounded-lg border resize-none transition-all duration-300 focus:outline-none focus:ring-0"
                  style={{
                    backgroundColor: isDark ? '#1a3a2e' : 'white',
                    borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                    color: isDark ? 'white' : '#3d3d3d',
                    height: '50px',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#d4af37'
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = isDark ? '#2d5a52' : '#e0d9d0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  onClick={handleSend}
                  className="px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: '#1a3a2e',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div
              className="rounded-lg border p-6 transition-colors duration-300 animate-in fade-in delay-150"
              style={{
                backgroundColor: isDark ? '#1a3a2e' : 'white',
                borderColor: isDark ? '#2d5a52' : '#e0d9d0',
              }}
            >
              <h3
                className="font-semibold mb-4 transition-colors duration-300"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: isDark ? 'white' : '#1a3a2e',
                  fontSize: '1.1rem',
                }}
              >
                Tips for Better Advice
              </h3>
              <ul className="space-y-3 text-sm">
                {tips.map((tip, i) => (
                  <li
                    key={i}
                    className={`pb-3 ${i !== tips.length - 1 ? 'border-b' : ''}`}
                    style={{ borderColor: isDark ? '#2d5a52' : '#e0d9d0' }}
                  >
                    <div
                      className="font-medium mb-1 transition-colors duration-300"
                      style={{ color: isDark ? 'white' : '#1a3a2e' }}
                    >
                      {tip.title}
                    </div>
                    <p
                      className="transition-colors duration-300"
                      style={{ color: isDark ? '#bfaea3' : '#666' }}
                    >
                      {tip.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Topics Card */}
            <div
              className="rounded-lg border p-6 transition-colors duration-300 animate-in fade-in delay-200"
              style={{
                backgroundColor: isDark ? '#1a3a2e' : 'white',
                borderColor: isDark ? '#2d5a52' : '#e0d9d0',
              }}
            >
              <h3
                className="font-semibold mb-4 transition-colors duration-300"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: isDark ? 'white' : '#1a3a2e',
                  fontSize: '1.1rem',
                }}
              >
                Popular Topics
              </h3>
              <div className="space-y-2">
                {commonTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setInput(`Tell me about ${topic}`)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: '#e8dcc4',
                      color: '#1a3a2e',
                      border: '1px solid #d4af37',
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Response Section */}
        {currentResponse && (
          <div
            className="mt-8 rounded-lg border p-6 animate-in fade-in delay-300 transition-colors duration-300"
            style={{
              backgroundColor: isDark ? '#1a3a2e' : 'white',
              borderColor: isDark ? '#2d5a52' : '#e0d9d0',
            }}
          >
            <h3
              className="text-xl font-semibold mb-4 transition-colors duration-300"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: isDark ? 'white' : '#1a3a2e',
              }}
            >
              Latest Response
            </h3>

            <div
              className="p-4 rounded-lg mb-4 border-l-4 transition-colors duration-300"
              style={{
                backgroundColor: isDark ? '#0f2027' : '#faf8f6',
                borderColor: '#d4af37',
              }}
            >
              <p
                className="text-sm transition-colors duration-300"
                style={{ color: isDark ? 'white' : '#3d3d3d' }}
              >
                <strong>Latest Question:</strong> {messages[messages.length - 2]?.content}
              </p>
            </div>

            <p
              className="text-sm leading-relaxed mb-6 transition-colors duration-300"
              style={{ color: isDark ? '#bfaea3' : '#555' }}
            >
              {currentResponse}
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'transparent',
                  color: '#1a3a2e',
                  border: '2px solid #1a3a2e',
                }}
              >
                Helpful
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'transparent',
                  color: '#1a3a2e',
                  border: '2px solid #1a3a2e',
                }}
              >
                Not Helpful
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
