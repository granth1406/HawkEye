import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SpinnerIcon, FileIcon, ChartIcon } from './Icons'

export default function FileScanner({ token, onMessage }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  const API_BASE = 'http://localhost:5000/api'

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleScan = async () => {
    if (!selectedFile) {
      onMessage('Please select a file', 'error')
      return
    }

    setLoading(true)
    setResult(null) // Clear previous results
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Show scanning in progress immediately
      onMessage('🔍 Scanning file...', 'info')

      const response = await fetch(`${API_BASE}/scan/file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        // Show results instantly
        setResult(data)
        setLoading(false)
        onMessage('✅ Scan complete!', 'success')
      } else {
        onMessage(data.error || data.details || 'File scan failed', 'error')
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
      <div className="space-y-2">
        <label className="block text-gray-300 text-sm mb-2 font-semibold">Select File to Scan</label>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="fileInput"
            aria-label="Choose file to scan for malware"
          />
          <label
            htmlFor="fileInput"
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-cyan-400 transition bg-gray-900/20 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                document.getElementById('fileInput').click()
              }
            }}
          >
            <FileIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
            <span className="text-gray-300">
              {selectedFile ? selectedFile.name : 'Click to select file'}
            </span>
          </label>
        </div>
        {selectedFile && (
          <div className="text-sm text-gray-400" role="status">
            Size: {(selectedFile.size / 1024).toFixed(2)} KB
          </div>
        )}
      </div>

      <button
        onClick={handleScan}
        disabled={loading || !selectedFile}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-busy={loading}
        aria-label={selectedFile ? `Scan ${selectedFile.name}` : 'Select a file first'}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <SpinnerIcon className="w-5 h-5" aria-hidden="true" /> Scanning...
          </span>
        ) : (
          'Scan File'
        )}
      </button>

      {result && (
        <div className="space-y-4 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all" role="region" aria-label="File scan results">
          {/* Verdict Card */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${
            result.verdict?.toLowerCase() === 'safe' || result.verdict?.toLowerCase() === 'undetected'
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
              {result.verdict?.toLowerCase() === 'safe' || result.verdict?.toLowerCase() === 'undetected' ? '✅' : '⚠️'}
            </div>
          </div>

          {/* Detection Stats */}
          {result.result?.data?.attributes?.last_analysis_stats && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-xs font-semibold">MALICIOUS</p>
                <p className="text-red-400 text-xl font-bold" role="status" aria-label={`Malicious detections: ${result.result.data.attributes.last_analysis_stats.malicious || 0}`}>
                  {result.result.data.attributes.last_analysis_stats.malicious || 0}
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-xs font-semibold">SUSPICIOUS</p>
                <p className="text-yellow-400 text-xl font-bold" role="status" aria-label={`Suspicious detections: ${result.result.data.attributes.last_analysis_stats.suspicious || 0}`}>
                  {result.result.data.attributes.last_analysis_stats.suspicious || 0}
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-xs font-semibold">CLEAN</p>
                <p className="text-green-400 text-xl font-bold" role="status" aria-label={`Clean engines: ${result.result.data.attributes.last_analysis_stats.undetected || 0}`}>
                  {result.result.data.attributes.last_analysis_stats.undetected || 0}
                </p>
              </div>
            </div>
          )}

          {/* File Details */}
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-3 border border-slate-700">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase">Scan ID</p>
                <p className="text-white font-mono text-sm break-all">{result.id}</p>
              </div>
            </div>
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase">File Hash (SHA-256)</p>
                <p className="text-white font-mono text-sm break-all">{result.hash}</p>
              </div>
            </div>
            {result.result?.data?.attributes && (
              <>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase">Total Engines</p>
                    <p className="text-white font-bold">
                      {(result.result.data.attributes.last_analysis_stats.malicious || 0) +
                       (result.result.data.attributes.last_analysis_stats.suspicious || 0) +
                       (result.result.data.attributes.last_analysis_stats.undetected || 0)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate('/file-scan-analysis', { state: { result, filename: selectedFile?.name } })}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="View full file analysis report"
          >
            <ChartIcon className="w-5 h-5" aria-hidden="true" /> View Full Analysis Report
          </button>
        </div>
      )}
    </div>
  )
}
