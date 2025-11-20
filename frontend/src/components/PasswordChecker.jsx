import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SpinnerIcon, LockIcon, ExclamationIcon, CheckCircleIcon } from './Icons'

export default function PasswordChecker({ token, onMessage }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  const API_BASE = 'http://localhost:5000/api'

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!password) {
      onMessage('Please enter a password', 'error')
      return
    }

    setLoading(true)
    setResult(null) // Clear previous results
    
    try {
      onMessage('Checking password...', 'info')

      const response = await fetch(`${API_BASE}/password/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setLoading(false)
        onMessage('Check complete!', 'success')
      } else {
        onMessage(data.error || 'Password check failed', 'error')
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
          <label htmlFor="password-input" className="block text-gray-300 text-sm mb-2 font-semibold">Enter Password to Check</label>
          <input
            id="password-input"
            type="password"
            placeholder="Enter password to check"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
            aria-label="Password to check for breaches"
            aria-describedby="password-help"
          />
          <p id="password-help" className="text-xs text-gray-400 mt-1">Your password is only used for checking and never stored.</p>
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
            'Check Password'
          )}
        </button>
      </form>

      {result && (
        <div className="space-y-4 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all" role="region" aria-label="Password check results">
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
                {result.count || 0}
              </p>
              <p className="text-xs text-gray-400 mt-1">occurrences</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 text-center">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Status</p>
              <p className={`text-lg font-bold ${result.breached ? 'text-red-400' : 'text-green-400'}`}>
                {result.verdict?.toUpperCase() || 'SAFE'}
              </p>
            </div>
          </div>

          {/* Warning */}
          {result.breached && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3" role="alert">
              <ExclamationIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <p className="text-red-200 font-semibold text-sm mb-1">Immediate Action Required</p>
                <p className="text-red-100/80 text-xs">
                  This password has been found in {result.count} known data breach{result.count !== 1 ? 'es' : ''}. Change this password immediately on all accounts.
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => navigate('/password-scan-analysis', { state: { result } })}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="View full password analysis report"
          >
            <LockIcon className="w-5 h-5" aria-hidden="true" /> View Full Analysis Report
          </button>
        </div>
      )}
    </div>
  )
}
