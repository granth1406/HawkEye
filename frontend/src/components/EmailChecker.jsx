import React, { useState } from 'react'
import { SpinnerIcon, ExclamationIcon, CheckCircleIcon } from './Icons'

export default function EmailChecker({ token, onMessage }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const API_BASE = 'http://localhost:5000/api'

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!email) {
      onMessage('Please enter an email address', 'error')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      onMessage('Please enter a valid email address', 'error')
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      onMessage('Checking email...', 'info')

      const response = await fetch(`${API_BASE}/auth/check-email-breach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setLoading(false)
        onMessage('Check complete!', 'success')
      } else {
        onMessage(data.error || 'Email check failed', 'error')
        setLoading(false)
      }
    } catch (error) {
      onMessage('Error: ' + error.message, 'error')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <label htmlFor="email-input" className="block text-gray-300 text-sm mb-2 font-semibold">Enter Email Address</label>
          <input
            id="email-input"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
            aria-label="Email address to check for data breaches"
            aria-describedby="email-help"
          />
          <p id="email-help" className="text-xs text-gray-400 mt-1">We check if your email appeared in known data breaches.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <SpinnerIcon className="w-5 h-5" aria-hidden="true" /> Checking...
            </span>
          ) : (
            'Check Email'
          )}
        </button>
      </form>

      {result && (
        <div className="space-y-4 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all" role="region" aria-label="Email check results">
          {/* Verdict Card */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${
            result.breached
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-green-500/10 border-green-500/30'
          }`}
          role="status"
          aria-live="polite"
          >
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase">Breach Status</p>
              <p className={`text-2xl font-bold ${result.breached ? 'text-red-400' : 'text-green-400'}`}>
                {result.breached ? 'FOUND IN BREACH' : 'NOT BREACHED'}
              </p>
            </div>
            <div className="text-4xl" aria-hidden="true">
              {result.breached ? (
                <ExclamationIcon className="w-12 h-12 text-red-400" />
              ) : (
                <CheckCircleIcon className="w-12 h-12 text-green-400" />
              )}
            </div>
          </div>

          {/* Breach Count Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-lg p-4 border text-center ${
              result.breached
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-green-500/10 border-green-500/20'
            }`}>
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Breach Count</p>
              <p className={`text-3xl font-bold ${result.breached ? 'text-red-400' : 'text-green-400'}`}>
                {result.breachCount || 0}
              </p>
              <p className="text-xs text-gray-400 mt-1">breaches found</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 text-center">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Status</p>
              <p className={`text-lg font-bold ${result.breached ? 'text-red-400' : 'text-green-400'}`}>
                {result.breached ? 'COMPROMISED' : 'SAFE'}
              </p>
            </div>
          </div>

          {/* Breaches List */}
          {result.breached && result.breaches && result.breaches.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-200 font-semibold text-sm mb-3">Breaches This Email Was Found In:</p>
              <div className="space-y-2">
                {result.breaches.map((breach, index) => (
                  <div key={index} className="bg-red-500/5 border border-red-500/20 rounded p-2 text-xs text-red-100">
                    <p className="font-semibold">{breach.name || breach}</p>
                    {breach.date && (
                      <p className="text-red-200/70 text-xs mt-1">Compromised: {breach.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning */}
          {result.breached && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3" role="alert">
              <ExclamationIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <p className="text-red-200 font-semibold text-sm mb-1">Action Required</p>
                <p className="text-red-100/80 text-xs">
                  This email has been found in {result.breachCount} data breach{result.breachCount !== 1 ? 'es' : ''}. Consider changing passwords on all accounts using this email.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
