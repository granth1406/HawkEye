import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import UrlScanner from '../components/UrlScanner'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { GlobeIcon } from '../components/Icons'

export default function UrlScannerPage() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
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
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 p-4 rounded-lg max-w-md ${
          message.type === 'success' 
            ? 'bg-green-500/20 text-green-200 border border-green-500/50' 
            : message.type === 'info'
            ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50'
            : 'bg-red-500/20 text-red-200 border border-red-500/50'
        }`}>
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-3 flex items-center gap-3">
              <GlobeIcon className="w-12 h-12 text-blue-400" /> URL & Website <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Scanner</span>
            </h1>
            <p className="text-gray-400 text-lg">Analyze URLs for phishing, malware, and suspicious content with dual-layer protection</p>
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Detection Methods</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Google Safe Browsing API integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>VirusTotal URL scanning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Phishing website detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Real-time threat verdicts</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-cyan-500/10 border border-yellow-500/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Safety Tips</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Always verify URLs before clicking links</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Check for HTTPS and padlock icons</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Be cautious with shortened URLs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Never trust links from unknown senders</span>
                </li>
              </ul>
            </div>
          </div>

          {/* URL Scanner */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 hover:border-cyan-500/50 transition-all">
            <UrlScanner token={token} onMessage={showMessage} />
          </div>

          {/* URL Categories */}
          <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">🎯 What We Detect</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Malware', 'Phishing', 'Unwanted Software', 'Suspicious Sites', 'Trojan Drops', 'C&C Servers', 'Exploits', 'Drive-by Downloads'].map((category, i) => (
                <div key={i} className="bg-gray-700/50 rounded p-3 text-center text-sm text-gray-300">
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
