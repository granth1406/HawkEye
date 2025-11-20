import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { CheckCircleIcon, ExclamationIcon, XCircleIcon, GlobeIcon, LockIcon, SearchIcon } from '../components/Icons'

export default function UrlScanAnalysis() {
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
            <p className="text-gray-400 mb-6">Please run a URL scan first</p>
            <button
              onClick={() => navigate('/url-scanner')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Go to URL Scanner
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getVerdictColor = (verdict) => {
    if (verdict === 'clean' || verdict === 'undetected') return 'text-green-400'
    if (verdict === 'malicious') return 'text-red-400'
    return 'text-yellow-400'
  }

  const getVerdictBg = (verdict) => {
    if (verdict === 'clean' || verdict === 'undetected') return 'bg-green-500/10 border-green-500/30'
    if (verdict === 'malicious') return 'bg-red-500/10 border-red-500/30'
    return 'bg-yellow-500/10 border-yellow-500/30'
  }

  const getThreatLevel = (categories) => {
    if (!categories || categories.length === 0) return { level: 'Safe', color: 'text-green-400' }
    const threatMap = {
      'malware': { level: 'Critical', color: 'text-red-600' },
      'phishing': { level: 'Critical', color: 'text-red-600' },
      'trojan': { level: 'Critical', color: 'text-red-600' },
      'suspicious': { level: 'High', color: 'text-red-400' },
      'spam': { level: 'Medium', color: 'text-yellow-400' },
      'grayware': { level: 'Low', color: 'text-yellow-300' }
    }
    for (let cat of categories) {
      if (threatMap[cat.toLowerCase()]) return threatMap[cat.toLowerCase()]
    }
    return { level: 'Low', color: 'text-yellow-400' }
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
      undetected: 0
    }
  }

  const threatInfo = getThreatLevel(result.categories)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="scroll-animate mb-12">
          <h1 className="text-4xl font-bold mb-4">URL Scan Analysis</h1>
          <p className="text-gray-400">Comprehensive security analysis for the scanned URL</p>
        </div>

        {/* URL Information */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">URL Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-2">URL Address</p>
              <p className="text-white font-mono break-all bg-slate-700/50 p-3 rounded">{result.url}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Domain</p>
                <p className="text-white font-semibold">{result.domain || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Protocol</p>
                <p className="text-white font-semibold">{result.protocol || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Scan Date</p>
                <p className="text-white font-semibold">{new Date().toLocaleString()}</p>
              </div>
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

        {/* Threat Analysis */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Threat Analysis</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Threat Level</p>
              <p className={`text-3xl font-bold ${threatInfo.color}`}>{threatInfo.level}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Total Engines</p>
              <p className="text-3xl font-bold text-cyan-400">{result.totalEngines || '90+'}</p>
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

        {/* Threat Categories */}
        {result.categories && result.categories.length > 0 && (
          <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-6">Threat Categories</h2>
            <div className="flex flex-wrap gap-3">
              {result.categories.map((category, idx) => (
                <span
                  key={idx}
                  className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-semibold border border-red-500/30"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

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

        {/* Safety Assessment */}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Safety Assessment</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <GlobeIcon className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">Website Safety</p>
                <p className="text-gray-400">
                  {result.verdict === 'clean' || result.verdict === 'undetected'
                    ? 'This URL appears safe to visit based on multiple security engines.'
                    : 'This URL has been flagged as potentially malicious. Proceed with caution.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <LockIcon className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">SSL/TLS Status</p>
                <p className="text-gray-400">
                  {result.protocol === 'https'
                    ? 'Connection is encrypted using HTTPS protocol.'
                    : 'Connection may not be fully encrypted. Use caution when entering sensitive data.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ExclamationIcon className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">Recommendation</p>
                <p className="text-gray-400">
                  {result.verdict === 'clean' || result.verdict === 'undetected'
                    ? 'Safe to visit. No immediate threats detected.'
                    : 'Do not visit this URL. It may contain malware, phishing content, or other threats.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional URL Metadata */}
        {result.result?.data?.attributes && (
          <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-6">URL Metadata</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-2">First Submission</p>
                  <p className="text-white text-sm">
                    {result.result.data.attributes.first_submission_date
                      ? new Date(result.result.data.attributes.first_submission_date * 1000).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Last Submission</p>
                  <p className="text-white text-sm">
                    {result.result.data.attributes.last_submission_date
                      ? new Date(result.result.data.attributes.last_submission_date * 1000).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Last Analysis Date</p>
                  <p className="text-white text-sm">
                    {result.result.data.attributes.last_analysis_date
                      ? new Date(result.result.data.attributes.last_analysis_date * 1000).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Total Submissions</p>
                  <p className="text-white text-sm">
                    {result.result.data.attributes.times_submitted || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="scroll-animate bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Safe Browsing Best Practices</h2>
          <div className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Always verify URLs before clicking links from emails or messages</li>
                <li>• Look for HTTPS and a padlock icon in the address bar</li>
                <li>• Never enter passwords on suspicious websites</li>
                <li>• Keep your browser and antivirus software updated</li>
                <li>• Be cautious of phishing attempts and social engineering</li>
                <li>• Use a VPN on public Wi-Fi networks</li>
                <li>• Check for proper SSL certificates before entering sensitive data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="scroll-animate flex gap-4 justify-center mb-12">
          <button
            onClick={() => navigate('/url-scanner')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all font-semibold"
          >
            Scan Another URL
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
