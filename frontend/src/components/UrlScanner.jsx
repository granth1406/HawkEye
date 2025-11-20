import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SpinnerIcon, GlobeIcon, SearchIcon } from './Icons'

export default function UrlScanner({ token, onMessage }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  const API_BASE = 'http://localhost:5000/api'

  const handleScan = async (e) => {
    e.preventDefault()
    if (!url) {
      onMessage('Please enter a URL', 'error')
      return
    }

    setLoading(true)
    setResult(null) // Clear previous results
    
    try {
      onMessage('🔍 Scanning URL...', 'info')

      const response = await fetch(`${API_BASE}/url/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setLoading(false)
        onMessage('✅ Scan complete!', 'success')
      } else {
        onMessage(data.error || 'URL scan failed', 'error')
        setLoading(false)
      }
    } catch (error) {
      onMessage('Error: ' + error.message, 'error')
      setLoading(false)
    }
  }

  const getVerdictColor = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'safe':
        return 'text-green-400'
      case 'suspicious':
        return 'text-yellow-400'
      case 'malicious':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleScan} className="space-y-4">
        <div>
          <label htmlFor="url-input" className="block text-gray-300 text-sm mb-2 font-semibold">Enter URL to Scan</label>
          <input
            id="url-input"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
            aria-label="URL to scan for malware and phishing"
            aria-describedby="url-help"
          />
          <p id="url-help" className="text-xs text-gray-400 mt-1">Enter a full URL starting with http:// or https://</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <SpinnerIcon className="w-5 h-5" aria-hidden="true" /> Scanning...
            </span>
          ) : (
            'Scan URL'
          )}
        </button>
      </form>

      {result && (
        <div className="space-y-4 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all" role="region" aria-label="URL scan results">
          {/* Verdict Card */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${
            result.verdict?.toLowerCase() === 'safe'
              ? 'bg-green-500/10 border-green-500/30'
              : result.verdict?.toLowerCase() === 'malicious'
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}
          role="status"
          aria-live="polite"
          >
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase">Scan Result</p>
              <p className={`text-2xl font-bold ${getVerdictColor(result.verdict)}`}>
                {result.verdict?.toUpperCase() || 'UNKNOWN'}
              </p>
            </div>
            <div className="text-4xl" aria-hidden="true">
              {result.verdict?.toLowerCase() === 'safe' ? '✅' : '⚠️'}
            </div>
          </div>

          {/* Security Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs font-semibold uppercase">Safe Browsing</p>
              <p className={`text-lg font-bold flex items-center gap-1 ${result.safeBrowsing === 'clean' ? 'text-green-400' : 'text-red-400'}`} role="status" aria-label={`Safe Browsing status: ${result.safeBrowsing === 'clean' ? 'Clean' : 'Threat'}`}>
                <span aria-hidden="true">{result.safeBrowsing === 'clean' ? '✓' : '⚠'}</span> {result.safeBrowsing === 'clean' ? 'Clean' : 'Threat'}
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs font-semibold uppercase">VirusTotal</p>
              <p className={`text-lg font-bold flex items-center gap-1 ${result.virusTotal === 'clean' || result.virusTotal === 'Clean' ? 'text-green-400' : 'text-red-400'}`} role="status" aria-label={`VirusTotal status: ${result.virusTotal}`}>
                <span aria-hidden="true">{result.virusTotal === 'clean' || result.virusTotal === 'Clean' ? '✓' : '⚠'}</span> {result.virusTotal === 'clean' || result.virusTotal === 'Clean' ? 'Clean' : result.virusTotal}
              </p>
            </div>
          </div>

          {/* URL Details */}
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-3 border border-slate-700">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Scanned URL</p>
              <p className="text-white font-mono text-sm break-all bg-slate-800/50 p-2 rounded border border-slate-600">{result.target || result.url}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase">Scan ID</p>
                <p className="text-white font-mono text-xs break-all">{result.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase">Scan Date</p>
                <p className="text-white text-xs">
                  {result.createdAt ? new Date(result.createdAt).toLocaleString() : 'Just now'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate('/url-scan-analysis', { state: { result } })}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="View full URL analysis report"
          >
            <SearchIcon className="w-5 h-5" aria-hidden="true" /> View Full Analysis Report
          </button>
        </div>
      )}
    </div>
  )
}
