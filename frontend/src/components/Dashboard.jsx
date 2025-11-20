import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import AuthForm from './AuthForm'
import TwoFactorSettings from './TwoFactorSettings'
import { BarChartIcon, FileIcon, GlobeIcon, CheckCircleIcon, ExclamationIcon, DocumentIcon, PieChartIcon, BriefcaseIcon, LockIcon } from './Icons'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Scan results distribution will be calculated from actual stats

export default function Dashboard() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('password')
  const [stats, setStats] = useState({
    filesScanned: 0,
    urlsScanned: 0,
    passwordsChecked: 0,
    threatsDetected: 0,
    cleanScans: 0,
    totalScans: 0
  })
  const [chartData, setChartData] = useState([
    { day: 'Mon', files: 0, urls: 0, passwords: 0 },
    { day: 'Tue', files: 0, urls: 0, passwords: 0 },
    { day: 'Wed', files: 0, urls: 0, passwords: 0 },
    { day: 'Thu', files: 0, urls: 0, passwords: 0 },
    { day: 'Fri', files: 0, urls: 0, passwords: 0 },
    { day: 'Sat', files: 0, urls: 0, passwords: 0 },
    { day: 'Sun', files: 0, urls: 0, passwords: 0 }
  ])
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  // Fetch stats when component mounts or token changes
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setStats({
            filesScanned: data.filesScanned,
            urlsScanned: data.urlsScanned,
            passwordsChecked: data.passwordsChecked,
            threatsDetected: data.threatsDetected,
            cleanScans: data.cleanScans,
            totalScans: data.totalScans
          })
          setChartData(data.chartData)
          setHistory(data.history)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      }
    }

    if (token) {
      fetchStats()
      // Refresh stats every 10 seconds for real-time updates
      const interval = setInterval(fetchStats, 10000)
      return () => clearInterval(interval)
    }
  }, [token])

  useEffect(() => {
    const stored = localStorage.getItem('hawkeye_token')
    const storedUser = localStorage.getItem('hawkeye_user')
    
    if (stored && storedUser) {
      setToken(stored)
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('hawkeye_token')
    localStorage.removeItem('hawkeye_user')
    setToken(null)
    setUser(null)
    showMessage('Logged out successfully', 'success')
    setTimeout(() => navigate('/'), 2000)
  }

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type })
    setTimeout(() => setMessage(null), 5000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center" role="status" aria-live="polite" aria-label="Loading dashboard">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" aria-hidden="true"></div>
        <span className="sr-only">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar user={user} onLogout={handleLogout} />

      {!token && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-30 flex items-center justify-center p-4 pt-20" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title">
          <div className="max-w-md w-full bg-gradient-to-b from-slate-800 to-slate-900 border border-cyan-500/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20 max-h-[calc(100vh-140px)] overflow-y-auto">
            <h2 id="auth-dialog-title" className="sr-only">Authentication Required</h2>
            <AuthForm onSuccess={(newToken, newUser) => {
              setToken(newToken)
              setUser(newUser)
              showMessage('Login successful!', 'success')
            }} />
          </div>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div 
          role="alert" 
          aria-live="polite" 
          aria-atomic="true"
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 p-4 rounded-lg max-w-md ${
            message.type === 'success' 
              ? 'bg-green-500/20 text-green-200 border border-green-500/50' 
              : 'bg-red-500/20 text-red-200 border border-red-500/50'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-3">
              Security <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-lg">Advanced File & URL Security Scanning</p>
          </header>

          {/* Statistics Section */}
          <section aria-label="Security statistics overview" className="mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
              {/* Total Scans */}
              <article className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/5 backdrop-blur-sm focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950">
                <div className="text-4xl mb-4 opacity-70" aria-hidden="true"><BarChartIcon className="w-8 h-8 text-cyan-400" /></div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Total Scans</p>
                <p className="text-4xl font-bold text-white">{stats.totalScans}</p>
              </article>

              {/* Files Scanned */}
              <article className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950">
                <div className="text-4xl mb-4 opacity-70" aria-hidden="true"><FileIcon className="w-8 h-8 text-blue-400" /></div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Files Scanned</p>
                <p className="text-4xl font-bold text-white">{stats.filesScanned}</p>
              </article>

              {/* URLs Scanned */}
              <article className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/5 backdrop-blur-sm focus-within:ring-2 focus-within:ring-purple-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950">
                <div className="text-4xl mb-4 opacity-70" aria-hidden="true"><GlobeIcon className="w-8 h-8 text-purple-400" /></div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">URLs Scanned</p>
                <p className="text-4xl font-bold text-white">{stats.urlsScanned}</p>
              </article>

              {/* Clean Scans */}
              <article className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/40 transition-all hover:shadow-xl hover:shadow-emerald-500/5 backdrop-blur-sm focus-within:ring-2 focus-within:ring-emerald-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950">
                <div className="text-4xl mb-4 opacity-70" aria-hidden="true"><CheckCircleIcon className="w-8 h-8 text-emerald-400" /></div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Clean Scans</p>
                <p className="text-4xl font-bold text-white">{stats.cleanScans}</p>
              </article>

              {/* Threats Detected */}
              <article className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-orange-500/40 transition-all hover:shadow-xl hover:shadow-orange-500/5 backdrop-blur-sm focus-within:ring-2 focus-within:ring-orange-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950">
                <div className="text-4xl mb-4 opacity-70" aria-hidden="true"><ExclamationIcon className="w-8 h-8 text-orange-400" /></div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Threats</p>
                <p className="text-4xl font-bold text-white">{stats.threatsDetected}</p>
              </article>
            </div>
          </section>

          {/* Charts Section */}
          <section aria-label="Scanning statistics charts" className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Weekly Activity Chart */}
            <article className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/5 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><BarChartIcon className="w-6 h-6 text-cyan-400" aria-hidden="true" /> Weekly Activity</h2>
              <div role="img" aria-label="Line chart showing scanning activity by day - Files, URLs, and Passwords scanned per day">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Line type="monotone" dataKey="files" stroke="#06b6d4" strokeWidth={2} dot={false} name="Files Scanned" />
                    <Line type="monotone" dataKey="urls" stroke="#3b82f6" strokeWidth={2} dot={false} name="URLs Scanned" />
                    <Line type="monotone" dataKey="passwords" stroke="#10b981" strokeWidth={2} dot={false} name="Passwords Checked" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* Scan Results Distribution Chart */}
            <article className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/5 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><PieChartIcon className="w-6 h-6 text-cyan-400" aria-hidden="true" /> Scan Results</h2>
              <div role="img" aria-label={`Pie chart showing scan results: ${stats.cleanScans} clean scans and ${stats.threatsDetected} threats detected`}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Clean', value: stats.cleanScans, color: '#10b981' },
                        { name: 'Threats', value: stats.threatsDetected, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[{ color: '#10b981' }, { color: '#ef4444' }].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>



          {/* Scan History */}
          <section aria-label="Scan history table" className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/5 backdrop-blur-sm mb-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><DocumentIcon className="w-6 h-6 text-cyan-400" aria-hidden="true" /> Scan History</h2>
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <caption className="sr-only">Scan history showing type, item name, status, threats detected, and date of each scan</caption>
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-200 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 text-gray-200 font-semibold">Item</th>
                      <th className="text-left py-3 px-4 text-gray-200 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-200 font-semibold">Threats</th>
                      <th className="text-left py-3 px-4 text-gray-200 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((scan) => (
                      <tr key={scan.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="inline-block bg-gray-700 text-gray-200 px-3 py-1 rounded text-xs font-semibold">
                            {scan.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{scan.name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                            scan.status === 'Clean' || scan.status === 'Safe' ? 'bg-green-500/20 text-green-300' :
                            scan.status === 'Suspicious' ? 'bg-yellow-500/20 text-yellow-300' :
                            scan.status === 'Malicious' || scan.status === 'Blocked' ? 'bg-red-500/20 text-red-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}
                          aria-label={`Status: ${scan.status}`}
                          >
                            {scan.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={scan.threats > 0 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'} aria-label={`Threats detected: ${scan.threats}`}>
                            {scan.threats}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-xs">{scan.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">No scans yet</p>
                <p className="text-gray-500 text-sm">Start scanning files and URLs to see your history</p>
              </div>
            )}
          </section>

          {/* Features Grid */}
          <section aria-label="Available security tools" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Password Checker Card */}
            <button
              onClick={() => navigate('/password-checker')}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              aria-label="Password Checker - Check if your passwords have been compromised"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><LockIcon className="w-5 h-5 text-cyan-400" aria-hidden="true" /> Data Breach Scanner</h3>
              <p className="text-gray-400 text-sm mb-4">Check if your passwords have been compromised</p>
              <span className="text-cyan-400 hover:text-cyan-300" aria-hidden="true">View Full Tool →</span>
            </button>

            {/* File Scanner Card */}
            <button
              onClick={() => navigate('/file-scanner')}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              aria-label="File Scanner - Scan files with 70+ antivirus engines"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><FileIcon className="w-5 h-5 text-cyan-400" aria-hidden="true" /> File Scanner</h3>
              <p className="text-gray-400 text-sm mb-4">Scan files with 70+ antivirus engines</p>
              <span className="text-cyan-400 hover:text-cyan-300" aria-hidden="true">View Full Tool →</span>
            </button>

            {/* URL Scanner Card */}
            <button
              onClick={() => navigate('/url-scanner')}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              aria-label="URL Scanner - Analyze URLs for phishing and malware"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><GlobeIcon className="w-5 h-5 text-cyan-400" aria-hidden="true" /> URL Scanner</h3>
              <p className="text-gray-400 text-sm mb-4">Analyze URLs for phishing and malware</p>
              <span className="text-cyan-400 hover:text-cyan-300" aria-hidden="true">View Full Tool →</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
