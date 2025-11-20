import React, { useState } from 'react'
import { LockIcon, ExclamationIcon } from './Icons'

export default function TwoFactorLogin({ userId, onSuccess, onBack }) {
  const [token, setToken] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const verify2FA = async (e) => {
    e.preventDefault()

    if (!token.trim()) {
      setError('Please enter your code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/2fa/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          token: token.replace(/\s/g, ''),
          useBackupCode
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // Save token and redirect
      localStorage.setItem('hawkeye_token', data.token)
      localStorage.setItem('hawkeye_user', data.user.name)
      onSuccess(data)
    } catch (err) {
      setError(err.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-500/20 p-3 rounded-lg">
          <LockIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Two-Factor Authentication</h2>
          <p className="text-gray-400 text-sm">Enter the code from your authenticator app</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
          <ExclamationIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={verify2FA} className="space-y-4">
        {!useBackupCode ? (
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              6-Digit Code
            </label>
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-gray-700 border border-gray-600 text-white text-center text-2xl tracking-widest px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500"
              autoFocus
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Backup Code
            </label>
            <input
              type="text"
              placeholder="XXXXXXXX"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              className="w-full bg-gray-700 border border-gray-600 text-white text-center text-lg tracking-widest px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 font-mono"
              autoFocus
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (useBackupCode ? token.length < 8 : token.length !== 6)}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <button
        onClick={() => {
          setToken('')
          setError('')
          setUseBackupCode(!useBackupCode)
        }}
        className="text-center text-cyan-400 hover:text-cyan-300 text-sm w-full"
      >
        {useBackupCode ? 'Use authenticator code instead' : 'Use backup code instead'}
      </button>

      <button
        onClick={onBack}
        className="text-center text-gray-400 hover:text-gray-300 text-sm w-full"
      >
        Back to Login
      </button>
    </div>
  )
}
