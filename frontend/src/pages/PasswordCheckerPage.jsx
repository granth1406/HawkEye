import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PasswordChecker from '../components/PasswordChecker'
import EmailChecker from '../components/EmailChecker'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { LockIcon } from '../components/Icons'

export default function PasswordCheckerPage() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('password')
  const navigate = useNavigate()
  const tabListRef = useRef(null)
  const passwordTabRef = useRef(null)
  const emailTabRef = useRef(null)
  useScrollAnimation()

  useEffect(() => {
    const stored = localStorage.getItem('hawkeye_token')
    const storedUser = localStorage.getItem('hawkeye_user')
    
    if (!stored || !storedUser) {
      navigate('/dashboard')
      return
    }
    
    setToken(stored)
    setUser(storedUser)
  }, [navigate])

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type })
    if (type !== 'info') {
      setTimeout(() => setMessage(null), 4000)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleTabKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const tabs = [passwordTabRef, emailTabRef]
      const currentIndex = activeTab === 'password' ? 0 : 1
      const newIndex = e.key === 'ArrowLeft' 
        ? (currentIndex - 1 + tabs.length) % tabs.length
        : (currentIndex + 1) % tabs.length
      
      const newTab = newIndex === 0 ? 'password' : 'email'
      setActiveTab(newTab)
      
      // Focus the newly selected tab
      setTimeout(() => {
        tabs[newIndex].current?.focus()
      }, 0)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('hawkeye_token')
    localStorage.removeItem('hawkeye_user')
    setToken(null)
    setUser(null)
    showMessage('Logged out successfully', 'success')
    setTimeout(() => navigate('/'), 2000)
  }

  if (!token) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar user={user} onLogout={handleLogout} />

      {/* Status Message */}
      {message && (
        <div 
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 p-4 rounded-lg max-w-md ${
            message.type === 'success' 
              ? 'bg-green-500/20 text-green-200 border border-green-500/50' 
              : message.type === 'info'
              ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50'
              : 'bg-red-500/20 text-red-200 border border-red-500/50'
          }`}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-3 flex items-center gap-3">
              <LockIcon className="w-12 h-12 text-green-400" aria-hidden="true" /> Security <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Checker</span>
            </h1>
            <p className="text-gray-400 text-lg">Check if your passwords and emails have been compromised in known data breaches</p>
          </header>

          {/* Tabs */}
          <div 
            ref={tabListRef}
            role="tablist"
            aria-label="Data breach checker tabs"
            className="flex gap-4 mb-8 border-b border-gray-700"
          >
            <button
              ref={passwordTabRef}
              onClick={() => handleTabChange('password')}
              onKeyDown={handleTabKeyDown}
              className={`pb-4 px-6 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-t ${
                activeTab === 'password'
                  ? 'border-b-2 border-cyan-400 text-cyan-400'
                  : 'text-gray-400 hover:text-cyan-400'
              }`}
              aria-selected={activeTab === 'password'}
              role="tab"
              aria-controls="password-panel"
              tabIndex={activeTab === 'password' ? 0 : -1}
            >
              🔐 Password Check
            </button>
            <button
              ref={emailTabRef}
              onClick={() => handleTabChange('email')}
              onKeyDown={handleTabKeyDown}
              className={`pb-4 px-6 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-t ${
                activeTab === 'email'
                  ? 'border-b-2 border-cyan-400 text-cyan-400'
                  : 'text-gray-400 hover:text-cyan-400'
              }`}
              aria-selected={activeTab === 'email'}
              role="tab"
              aria-controls="email-panel"
              tabIndex={activeTab === 'email' ? 0 : -1}
            >
              ✉️ Email Check
            </button>
          </div>

          {/* Info Section */}
          <article className="grid md:grid-cols-2 gap-8 mb-12">
            <section 
              className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-lg p-8"
              aria-label="How it works"
            >
              <h2 className="text-2xl font-bold text-green-400 mb-4">How It Works</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1" aria-hidden="true">✓</span>
                  <span>We use the HaveIBeenPwned API for accurate breach detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1" aria-hidden="true">✓</span>
                  <span>Your data is never sent in plain text - we use k-anonymity model</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1" aria-hidden="true">✓</span>
                  <span>Instant results showing if data was found in breaches</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1" aria-hidden="true">✓</span>
                  <span>Recommendations if your account has been compromised</span>
                </li>
              </ul>
            </section>

            <section 
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-8"
              aria-label="Security tips"
            >
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Security Tips</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1" aria-hidden="true">•</span>
                  <span>Use unique passwords for each account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1" aria-hidden="true">•</span>
                  <span>Make passwords at least 16 characters long</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1" aria-hidden="true">•</span>
                  <span>Include uppercase, lowercase, numbers, and symbols</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1" aria-hidden="true">•</span>
                  <span>Use a password manager to securely store passwords</span>
                </li>
              </ul>
            </section>
          </article>

          {/* Content Area */}
          <section 
            id={activeTab === 'password' ? 'password-panel' : 'email-panel'}
            role="tabpanel"
            aria-labelledby={activeTab === 'password' ? 'password-tab' : 'email-tab'}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 hover:border-cyan-500/50 transition-all"
          >
            {activeTab === 'password' && <PasswordChecker token={token} onMessage={showMessage} />}
            {activeTab === 'email' && <EmailChecker token={token} onMessage={showMessage} />}
          </section>

          {/* Back Button */}
          <nav className="mt-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded px-2 py-1"
              aria-label="Return to dashboard"
            >
              ← Back to Dashboard
            </button>
          </nav>
        </div>
      </main>
    </div>
  )
}
