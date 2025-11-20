import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { CheckCircleIcon, ExclamationIcon, XCircleIcon, LockIcon, ShieldAlertIcon } from '../components/Icons'

export default function PasswordScanAnalysis() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  useScrollAnimation()

  const result = location.state?.result

  useEffect(() => {
    const storedUser = localStorage.getItem('hawkeye_user')
    setUser(storedUser)
  }, [])

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <Navbar user={user} />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">No Scan Data</h1>
            <p className="text-gray-400 mb-6">Please check a password first</p>
            <button
              onClick={() => navigate('/password-checker')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Go to Password Checker
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getStrengthColor = (strength) => {
    if (strength === 'Very Strong') return 'text-green-400'
    if (strength === 'Strong') return 'text-green-300'
    if (strength === 'Medium') return 'text-yellow-400'
    if (strength === 'Weak') return 'text-orange-400'
    return 'text-red-400'
  }

  const getStrengthBg = (strength) => {
    if (strength === 'Very Strong') return 'bg-green-500/10 border-green-500/30'
    if (strength === 'Strong') return 'bg-green-500/10 border-green-500/30'
    if (strength === 'Medium') return 'bg-yellow-500/10 border-yellow-500/30'
    if (strength === 'Weak') return 'bg-orange-500/10 border-orange-500/30'
    return 'bg-red-500/10 border-red-500/30'
  }

  const getBreachStatus = (isBreached) => {
    return isBreached ? 'text-red-400' : 'text-green-400'
  }

  const getBreachStatusBg = (isBreached) => {
    return isBreached ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'
  }

  // Calculate password strength
  const calculatePasswordStrength = () => {
    let strength = 0
    const password = result.target || ''
    
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1
    if (password.length >= 16) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[!@#$%^&*]/.test(password)) strength += 1

    if (strength <= 2) return 'Very Weak'
    if (strength <= 3) return 'Weak'
    if (strength <= 4) return 'Medium'
    if (strength <= 5) return 'Strong'
    return 'Very Strong'
  }

  const passwordStrength = calculatePasswordStrength()

  // Calculate entropy
  const calculateEntropy = () => {
    const password = result.target || ''
    let charsetSize = 0
    
    if (/[a-z]/.test(password)) charsetSize += 26
    if (/[A-Z]/.test(password)) charsetSize += 26
    if (/[0-9]/.test(password)) charsetSize += 10
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charsetSize += 32

    if (charsetSize === 0) return 0
    return Math.round(password.length * Math.log2(charsetSize))
  }

  const entropy = calculateEntropy()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="scroll-animate mb-12">
          <h1 className="text-4xl font-bold mb-4">Password Security Analysis</h1>
          <p className="text-gray-400">Detailed security assessment and recommendations for your password</p>
        </div>

        {/* Strength Verdict */}
        <div className={`scroll-animate ${getStrengthBg(passwordStrength)} border rounded-xl p-8 mb-8`}>
          <div className="flex items-center gap-4">
            <div>
              {passwordStrength === 'Very Strong' || passwordStrength === 'Strong' ? (
                <CheckCircleIcon className="w-16 h-16 text-green-400" />
              ) : passwordStrength === 'Medium' ? (
                <ExclamationIcon className="w-16 h-16 text-yellow-400" />
              ) : (
                <XCircleIcon className="w-16 h-16 text-red-400" />
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Password Strength</p>
              <h3 className={`text-3xl font-bold ${getStrengthColor(passwordStrength)}`}>
                {passwordStrength}
              </h3>
            </div>
          </div>
        </div>

        {/* Breach Status */}
        <div className={`scroll-animate ${getBreachStatusBg(result.isBreached)} border rounded-xl p-8 mb-8`}>
          <div className="flex items-center gap-4">
            <div>
              {result.isBreached ? (
                <ShieldAlertIcon className="w-16 h-16 text-red-400" />
              ) : (
                <CheckCircleIcon className="w-16 h-16 text-green-400" />
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Breach Status</p>
              <h3 className={`text-3xl font-bold ${getBreachStatus(result.isBreached)}`}>
                {result.isBreached ? 'Found in Breaches' : 'Not Found in Breaches'}
              </h3>
              {result.isBreached && result.breachCount && (
                <p className="text-sm text-gray-400 mt-2">Found in {result.breachCount} known data breaches</p>
              )}
            </div>
          </div>
        </div>

        {/* Password Analysis */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Password Composition Analysis</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Password Length</p>
              <p className="text-white font-semibold text-2xl">{result.target?.length || 0} characters</p>
              <p className="text-xs text-gray-400 mt-1">Recommended: 12+ characters</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Entropy</p>
              <p className="text-white font-semibold text-2xl">{entropy} bits</p>
              <p className="text-xs text-gray-400 mt-1">Higher entropy = stronger password</p>
            </div>
          </div>
        </div>

        {/* Character Composition */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Character Composition</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-lg border ${
                /[A-Z]/.test(result.target || '') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  {/[A-Z]/.test(result.target || '') ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">Uppercase Letters</p>
                  <p className="text-xs text-gray-400">A-Z</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                /[a-z]/.test(result.target || '') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  {/[a-z]/.test(result.target || '') ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">Lowercase Letters</p>
                  <p className="text-xs text-gray-400">a-z</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                /[0-9]/.test(result.target || '') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  {/[0-9]/.test(result.target || '') ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">Numbers</p>
                  <p className="text-xs text-gray-400">0-9</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(result.target || '') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(result.target || '') ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">Special Characters</p>
                  <p className="text-xs text-gray-400">!@#$%^&*</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vulnerability Assessment */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Vulnerability Assessment</h2>
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg border ${
                result.breached ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  {result.breached ? (
                    <ShieldAlertIcon className="w-6 h-6 text-red-400" />
                  ) : (
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">Breach Detection</p>
                  <p className="text-sm text-gray-400">
                    {result.breached
                      ? `Found in ${result.count || 'multiple'} known data breach${result.count !== 1 ? 'es' : ''}`
                      : 'Not found in any known data breaches'}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                result.target?.length && result.target.length >= 12 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  {result.target?.length && result.target.length >= 12 ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  ) : (
                    <ExclamationIcon className="w-6 h-6 text-yellow-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">Length Check</p>
                  <p className="text-sm text-gray-400">
                    {result.target?.length && result.target.length >= 12
                      ? `Password length is secure (${result.target.length} characters)`
                      : `Password is too short (${result.target?.length || 0} characters, recommend 12+)`}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                entropy >= 50 ? 'bg-green-500/10 border-green-500/20' : entropy >= 30 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  {entropy >= 50 ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  ) : entropy >= 30 ? (
                    <ExclamationIcon className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">Entropy Check</p>
                  <p className="text-sm text-gray-400">
                    {entropy >= 50
                      ? `Strong entropy (${entropy} bits)`
                      : entropy >= 30
                      ? `Moderate entropy (${entropy} bits, aim for 50+)`
                      : `Low entropy (${entropy} bits, aim for 50+)`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Security Recommendations</h2>
          <div className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">How to Create a Strong Password:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span>Use at least 12 characters, ideally 16 or more</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span>Include uppercase, lowercase, numbers, and special characters</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span>Avoid personal information (birthdate, name, address)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <span>Avoid common words and patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">5.</span>
                  <span>Use unique passwords for different accounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">6.</span>
                  <span>Consider using a password manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">7.</span>
                  <span>Enable two-factor authentication when available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Breach Information */}
        {result.isBreached && (
          <div className="scroll-animate bg-red-500/10 border border-red-500/30 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShieldAlertIcon className="w-6 h-6 text-red-400" /> Breach History
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                This password has been found in {result.breachCount || 'multiple'} known data breaches. This means:
              </p>
              <ul className="space-y-2 text-sm text-gray-300 ml-4">
                <li>• Attackers have access to this password combination</li>
                <li>• It may be used in credential stuffing attacks</li>
                <li>• Any accounts using this password are at high risk</li>
                <li>• You should change this password immediately</li>
              </ul>
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="font-semibold text-red-400 mb-2">Immediate Action Required:</p>
                <p className="text-sm text-gray-300">
                  If you've used this password on any account, change it immediately. This includes email, banking, social media, and any other important services.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Best Practices */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Password Security Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Do:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Use unique passwords for each account</li>
                <li>✓ Store passwords in a password manager</li>
                <li>✓ Use 2FA/MFA when available</li>
                <li>✓ Update passwords regularly</li>
                <li>✓ Check for breaches regularly</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Don't:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✗ Share passwords with others</li>
                <li>✗ Write passwords down on paper</li>
                <li>✗ Use personal information</li>
                <li>✗ Reuse passwords across sites</li>
                <li>✗ Use predictable patterns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="scroll-animate flex gap-4 justify-center mb-12">
          <button
            onClick={() => navigate('/password-checker')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all font-semibold"
          >
            Check Another Password
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-all font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
