import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { CheckCircleIcon, ExclamationIcon, XCircleIcon, DocumentIcon, ShieldCheckIcon, SearchIcon } from '../components/Icons'

export default function FileScanAnalysis() {
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
            <p className="text-gray-400 mb-6">Please run a file scan first</p>
            <button
              onClick={() => navigate('/file-scanner')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Go to File Scanner
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getVerdictColor = (verdict) => {
    if (verdict === 'clean' || verdict === 'undetected' || verdict === 'safe') return 'text-green-400'
    if (verdict === 'malicious') return 'text-red-400'
    return 'text-yellow-400'
  }

  const getVerdictBg = (verdict) => {
    if (verdict === 'clean' || verdict === 'undetected' || verdict === 'safe') return 'bg-green-500/10 border-green-500/30'
    if (verdict === 'malicious') return 'bg-red-500/10 border-red-500/30'
    return 'bg-yellow-500/10 border-yellow-500/30'
  }

  const getEngineResults = () => {
    try {
      const analysis = result.result?.data?.attributes?.last_analysis;
      if (!analysis) return []
      return Object.entries(analysis).map(([engine, data]) => ({
        engine,
        result: data.result || 'undetected',
        category: data.category || 'N/A'
      }))
    } catch (e) {
      return []
    }
  }

  const getStats = () => {
    return result.result?.data?.attributes?.last_analysis_stats || {
      malicious: 0,
      suspicious: 0,
      undetected: 0,
      timeout: 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="scroll-animate mb-12">
          <h1 className="text-4xl font-bold mb-4">File Scan Analysis</h1>
          <p className="text-gray-400">Detailed security analysis report for your uploaded file</p>
        </div>

        {/* File Overview */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">File Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">File Name</p>
              <p className="text-white font-semibold">{result.filename}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">File Size</p>
              <p className="text-white font-semibold">{result.fileSize || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">SHA-256 Hash</p>
              <p className="text-white font-mono text-sm break-all">{result.hash || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Scan Date</p>
              <p className="text-white font-semibold">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Overall Verdict */}
        <div className={`scroll-animate ${getVerdictBg(result.verdict)} border rounded-xl p-8 mb-8`}>
          <div className="flex items-center gap-4">
            <div>
              {result.verdict === 'clean' || result.verdict === 'undetected' ? (
                <CheckCircleIcon className="w-16 h-16 text-green-400" />
              ) : result.verdict === 'malicious' ? (
                <ExclamationIcon className="w-16 h-16 text-red-400" />
              ) : (
                <XCircleIcon className="w-16 h-16 text-yellow-400" />
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Overall Verdict</p>
              <h3 className={`text-3xl font-bold capitalize ${getVerdictColor(result.verdict)}`}>
                {result.verdict || 'Unknown'}
              </h3>
            </div>
          </div>
        </div>

        {/* Detection Summary */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Detection Summary</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Total Engines</p>
              <p className="text-3xl font-bold text-cyan-400">{
                getStats().malicious + getStats().suspicious + getStats().undetected
              }</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Malicious Detections</p>
              <p className="text-3xl font-bold text-red-400">{getStats().malicious || 0}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Suspicious Detections</p>
              <p className="text-3xl font-bold text-yellow-400">{getStats().suspicious || 0}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Clean Detections</p>
              <p className="text-3xl font-bold text-green-400">{getStats().undetected || 0}</p>
            </div>
          </div>
        </div>

        {/* Engine Detections */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Engine-by-Engine Analysis ({getEngineResults().length} engines)</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {getEngineResults().length > 0 ? (
              getEngineResults().map((engine, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex justify-between items-center ${
                    engine.result === 'undetected'
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white text-sm">{engine.engine}</p>
                    <p className={`text-xs ${engine.result === 'undetected' ? 'text-green-400' : 'text-red-400'}`}>
                      {engine.result}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded flex items-center gap-1 ${
                      engine.result === 'undetected'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {engine.result === 'undetected' ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4" /> Clean
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-4 h-4" /> Threat
                      </>
                    )}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No detailed engine data available</p>
            )}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Risk Assessment</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <ShieldCheckIcon className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">File Safety Level</p>
                <p className="text-gray-400">
                  {result.verdict === 'clean' || result.verdict === 'undetected'
                    ? 'This file appears to be safe based on multiple antivirus engine scans.'
                    : 'This file has been flagged as potentially malicious by one or more security engines.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ExclamationIcon className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">Recommendation</p>
                <p className="text-gray-400">
                  {result.verdict === 'clean' || result.verdict === 'undetected'
                    ? 'Safe to use. No immediate threats detected.'
                    : 'Do not execute this file. Consider quarantining or deleting it.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <SearchIcon className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">Scan Coverage</p>
                <p className="text-gray-400">
                  This file was scanned against {result.totalEngines || 70}+ antivirus engines for comprehensive protection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional File Metadata */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">File Metadata</h2>
          <div className="space-y-4">
            {result.result?.data?.attributes && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-2">First Submission</p>
                    <p className="text-white">
                      {result.result.data.attributes.first_submission_date
                        ? new Date(result.result.data.attributes.first_submission_date * 1000).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Last Submission</p>
                    <p className="text-white">
                      {result.result.data.attributes.last_submission_date
                        ? new Date(result.result.data.attributes.last_submission_date * 1000).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Last Analysis Date</p>
                    <p className="text-white">
                      {result.result.data.attributes.last_analysis_date
                        ? new Date(result.result.data.attributes.last_analysis_date * 1000).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-2">File Type</p>
                    <p className="text-white">{result.result.data.attributes.type_description || 'Unknown'}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="scroll-animate flex gap-4 justify-center mb-12">
          <button
            onClick={() => navigate('/file-scanner')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all font-semibold"
          >
            Scan Another File
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
