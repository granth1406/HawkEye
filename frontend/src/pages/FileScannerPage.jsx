import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import FileScanner from '../components/FileScanner'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { FileIcon } from '../components/Icons'

export default function FileScannerPage() {
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
              <FileIcon className="w-12 h-12 text-orange-400" /> Advanced <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">File Scanner</span>
            </h1>
            <p className="text-gray-400 text-lg">Scan files with 70+ antivirus engines for comprehensive malware detection</p>
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-orange-500/10 to-cyan-500/10 border border-orange-500/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">Scanning Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">✓</span>
                  <span>70+ professional antivirus engines scanning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">✓</span>
                  <span>Detects malware, trojans, worms, and ransomware</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">✓</span>
                  <span>File hash-based identification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">✓</span>
                  <span>Instant detailed analysis reports</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-cyan-500/10 border border-red-500/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-red-400 mb-4">Best Practices</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Scan files before opening from untrusted sources</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Check executable and archive files regularly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Keep your system antivirus updated</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Use secure download sources only</span>
                </li>
              </ul>
            </div>
          </div>

          {/* File Scanner */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 hover:border-cyan-500/50 transition-all">
            <FileScanner token={token} onMessage={showMessage} />
          </div>

          {/* Supported Formats */}
          <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">📋 Supported File Types</h3>
            <p className="text-gray-300 mb-4">
              We scan all file types including: executables (.exe, .dll, .app), archives (.zip, .rar, .7z), documents (.pdf, .doc, .xls), scripts (.js, .py, .sh), and more.
            </p>
            <p className="text-sm text-gray-400">
              Maximum file size: 650 MB
            </p>
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
