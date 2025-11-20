import React, { useState } from 'react'
import { LockIcon, CheckCircleIcon, ExclamationIcon, DownloadIcon } from './Icons'

export default function TwoFactorSetup({ isOpen, onClose, token }) {
  const [step, setStep] = useState(1) // 1: show QR, 2: verify, 3: backup codes
  const [qrCode, setQrCode] = useState(null)
  const [backupCodes, setBackupCodes] = useState([])
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const initiate2FA = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/2fa/initiate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setQrCode(data.qrCode)
      setBackupCodes(data.backupCodes)
      setStep(2)
    } catch (err) {
      setError(err.message || 'Failed to initiate 2FA')
    } finally {
      setLoading(false)
    }
  }

  const verify2FA = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the 6-digit code from your authenticator')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: verificationCode,
          backupCodes: backupCodes
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setSuccess('2FA enabled successfully!')
      setStep(3)
    } catch (err) {
      setError(err.message || 'Failed to verify 2FA')
    } finally {
      setLoading(false)
    }
  }

  const downloadBackupCodes = () => {
    const content = `HawkEye 2FA Backup Codes\n\nSave these codes in a safe place. Each code can be used once if you lose access to your authenticator app.\n\n${backupCodes.join('\n')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hawkeye-backup-codes.txt'
    a.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyan-500/20 p-2 rounded-lg">
            <LockIcon className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Enable Two-Factor Authentication</h2>
            <p className="text-sm text-gray-400">Secure your account with 2FA</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
            <ExclamationIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}

        {/* Step 1: Show QR Code */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-gray-800/50 p-6 rounded-lg text-center">
              <p className="text-gray-400 mb-4">Click below to generate your QR code and backup codes</p>
              <button
                onClick={initiate2FA}
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Scan QR & Verify */}
        {step === 2 && qrCode && (
          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-3 font-semibold">1. Scan this QR code:</p>
              <div className="bg-white p-3 rounded-lg">
                <img src={qrCode} alt="2FA QR Code" className="w-full" />
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-3 font-semibold">2. Enter the 6-digit code:</p>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-gray-700 border border-gray-600 text-white text-center text-2xl tracking-widest px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={verify2FA}
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
              <p className="text-sm text-yellow-200 font-semibold mb-2">⚠️ Save Your Backup Codes</p>
              <p className="text-xs text-yellow-100">If you lose access to your authenticator app, you can use these codes to access your account. Each code works once.</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="bg-gray-700 p-2 rounded text-sm text-center font-mono text-gray-300">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={downloadBackupCodes}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <DownloadIcon className="w-5 h-5" />
              Download Codes
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {/* Close Button */}
        {step !== 3 && (
          <button
            onClick={onClose}
            className="mt-4 text-gray-400 hover:text-gray-300 text-sm w-full"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
