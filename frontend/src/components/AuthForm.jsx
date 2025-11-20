import React, { useState, useEffect } from 'react'
import TwoFactorLogin from './TwoFactorLogin'

export default function AuthForm({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [message, setMessage] = useState(null)
  const [requiresTwoFA, setRequiresTwoFA] = useState(false)
  const [pendingUserId, setPendingUserId] = useState(null)
  
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const API_BASE = 'http://localhost:5000/api'

  // Initialize Google Sign-In
  useEffect(() => {
    // Check if google is available
    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: '644527663270-d4erqlnrqu1ajcgith07dorpupo2ilq4.apps.googleusercontent.com',
          callback: handleGoogleLogin,
          error_callback: () => {
            console.error('Google Sign-In initialization error. Please ensure http://localhost:3002 is added as an authorized origin in Google Cloud Console.');
          }
        });

        // Render the Sign-In button
        const googleButtonElement = document.getElementById('google-signin-button');
        if (googleButtonElement) {
          window.google.accounts.id.renderButton(googleButtonElement, {
            theme: 'outline',
            size: 'large',
            width: '100%'
          });
        }
      } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error);
        showMessage('Google Sign-In is not available. Please try email/password login.', 'error');
      }
    }
  }, [activeTab]);

  const handleGoogleLogin = async (response) => {
    try {
      setLoading(true);
      const googleToken = response.credential;

      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleToken })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('hawkeye_token', data.token);
        localStorage.setItem('hawkeye_user', data.user.email);
        showMessage('Google login successful!', 'success');
        onSuccess(data.token, data.user.email);
      } else {
        showMessage(data.error || 'Google login failed', 'error');
      }
    } catch (error) {
      showMessage('Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!regName || !regEmail || !regPassword) {
      showMessage('Please fill in all fields', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        showMessage('Account created! Now login with your credentials.', 'success')
        setRegName('')
        setRegEmail('')
        setRegPassword('')
        setActiveTab('login')
      } else {
        showMessage(data.error || 'Registration failed', 'error')
      }
    } catch (error) {
      showMessage('Error: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      showMessage('Please enter email and password', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Check if 2FA is required
        if (data.requiresTwoFactor) {
          setRequiresTwoFA(true)
          setPendingUserId(data.userId)
          showMessage('Enter your 2FA code to continue', 'info')
        } else {
          localStorage.setItem('hawkeye_token', data.token)
          localStorage.setItem('hawkeye_user', data.user.email)
          setLoginEmail('')
          setLoginPassword('')
          onSuccess(data.token, data.user.email)
        }
      } else {
        showMessage(data.error || 'Login failed', 'error')
      }
    } catch (error) {
      showMessage('Error: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Show 2FA login if required */}
      {requiresTwoFA && pendingUserId ? (
        <TwoFactorLogin
          userId={pendingUserId}
          onSuccess={(data) => {
            setRequiresTwoFA(false)
            setPendingUserId(null)
            setLoginEmail('')
            setLoginPassword('')
            onSuccess(data.token, data.user.email)
          }}
          onBack={() => {
            setRequiresTwoFA(false)
            setPendingUserId(null)
          }}
        />
      ) : (
        <div className="space-y-4">
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-200 border border-green-500/50 shadow-lg shadow-green-500/10'
                : 'bg-red-500/20 text-red-200 border border-red-500/50 shadow-lg shadow-red-500/10'
            }`}>
              {message.text}
            </div>
          )}

        <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 px-4 py-2 font-semibold transition-all rounded text-sm ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 px-4 py-2 font-semibold transition-all rounded text-sm ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Tab */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-gray-300 text-xs mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all hover:border-gray-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-xs mb-1 font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all hover:border-gray-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="text-gray-400 text-xs">Or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Google Sign-In Button */}
            <div id="google-signin-button" className="w-full"></div>
          </form>
        )}

        {/* Register Tab */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-gray-300 text-xs mb-1 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all hover:border-gray-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-xs mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all hover:border-gray-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-xs mb-1 font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all hover:border-gray-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="text-gray-400 text-xs">Or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Google Sign-In Button */}
            <div id="google-signin-button" className="w-full"></div>
          </form>
        )}
        </div>
      )}
    </div>
  )
}
