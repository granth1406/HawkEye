import React, { useState, useEffect } from 'react'
import { LockIcon, CheckCircleIcon, ExclamationIcon, DownloadIcon } from './Icons'
import TwoFactorSetup from './TwoFactorSetup'

export default function TwoFactorSettings({ token }) {
  const [twoFAStatus, setTwoFAStatus] = useState({
    twoFactorEnabled: false,
    twoFactorVerified: false,
    backupCodesRemaining: 0
  })
  const [loading, setLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [message, setMessage] = useState(null)
  const [disableLoading, setDisableLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetch2FAStatus()
  }, [token])

  const fetch2FAStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/2fa/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setTwoFAStatus(data)
    } catch (err) {
      console.error('Error fetching 2FA status:', err)
    } finally {
      setLoading(false)
    }
  }

  const disable2FA = async () => {
    if (!password) {
      showMessage('Please enter your password', 'error')
      return
    }

    setDisableLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setPassword('')
      setShowPassword(false)
      showMessage('2FA disabled successfully', 'success')
      fetch2FAStatus()
    } catch (err) {
      showMessage(err.message, 'error')
    } finally {
      setDisableLoading(false)
    }
  }

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type })
    setTimeout(() => setMessage(null), 5000)
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TwoFactorSetup
        isOpen={showSetup}
        onClose={() => {
          setShowSetup(false)
          fetch2FAStatus()
        }}
        token={token}
      />

      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-500/20 text-green-200 border border-green-500/50'
            : 'bg-red-500/20 text-red-200 border border-red-500/50'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-cyan-500/20 p-3 rounded-lg">
              <LockIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
              <p className="text-gray-400 text-sm mt-1">Add an extra layer of security to your account</p>
            </div>
          </div>
          {twoFAStatus.twoFactorEnabled && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-semibold">Enabled</span>
            </div>
          )}
        </div>

        {twoFAStatus.twoFactorEnabled ? (
          <div className="space-y-4">
            {/* 2FA Enabled Status */}
            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
              <p className="text-green-200 text-sm">
                ✓ Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app each time you log in.
              </p>
            </div>

            {/* Backup Codes */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-white text-sm font-semibold mb-2">Backup Codes Remaining</p>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-cyan-400">{twoFAStatus.backupCodesRemaining}</div>
                <p className="text-gray-400 text-sm">
                  {twoFAStatus.backupCodesRemaining > 2
                    ? 'You have plenty of backup codes left'
                    : twoFAStatus.backupCodesRemaining > 0
                    ? 'Consider regenerating backup codes soon'
                    : 'Regenerate backup codes immediately'}
                </p>
              </div>
            </div>

            {/* Disable 2FA */}
            <div className="space-y-3">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                {showPassword ? 'Cancel' : 'Disable 2FA'}
              </button>

              {showPassword && (
                <div className="bg-gray-700/30 p-4 rounded-lg space-y-3 border border-gray-600">
                  <p className="text-gray-300 text-sm font-semibold">Enter your password to disable 2FA:</p>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={disable2FA}
                    disabled={disableLoading || !password}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    {disableLoading ? 'Disabling...' : 'Confirm Disable'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Protect your account with two-factor authentication. You'll need an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy.
            </p>

            <button
              onClick={() => setShowSetup(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Enable 2FA Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
