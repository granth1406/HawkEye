import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { LockIcon, FileIcon, GlobeIcon, ArrowRightIcon, CheckCircleIcon, SearchIcon, DocumentIcon, ShieldCheckIcon, ExclamationIcon } from '../components/Icons';

export default function Home() {
  const [user, setUser] = useState(null)
  useScrollAnimation()

  useEffect(() => {
    const storedUser = localStorage.getItem('hawkeye_user')
    setUser(storedUser)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Know if Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Data</span> is Safe
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Check if your passwords have been in breaches, scan files for malware, and analyze suspicious links. Simple tools that actually work.
            </p>

            <a
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all font-semibold text-lg flex items-center gap-2"
            >
              <ArrowRightIcon className="w-5 h-5" /> Go to Dashboard
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="scroll-animate bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all">
              <LockIcon className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Breach Checker</h3>
              <p className="text-gray-400">See if your passwords appeared in known data breaches. Get notified instantly if compromised.</p>
            </div>

            <div className="scroll-animate bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all">
              <FileIcon className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Malware Scanner</h3>
              <p className="text-gray-400">Scan any file against VirusTotal's 70+ antivirus engines. Results in seconds.</p>
            </div>

            <div className="scroll-animate bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all">
              <GlobeIcon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Link Safety</h3>
              <p className="text-gray-400">Check URLs against Google Safe Browsing and VirusTotal to avoid malicious sites.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-800/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">We Offer</span>
            </h2>
            <p className="text-gray-400 text-lg">Simple tools. No bloat. Just what works.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Web Application */}
            <div className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
              <GlobeIcon className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Web Dashboard</h3>
              <p className="text-gray-400 mb-4">Check your passwords and files right here in your browser</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✓ Instant scanning</li>
                <li>✓ Scan history</li>
                <li>✓ Result details</li>
                <li>✓ No sign-up (optional)</li>
              </ul>
            </div>

            {/* REST API */}
            <div className="scroll-animate bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
              <SearchIcon className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">REST API</h3>
              <p className="text-gray-400 mb-4">Build your own security tools on top of ours</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✓ Breach checking</li>
                <li>✓ File scanning</li>
                <li>✓ URL analysis</li>
                <li>✓ Well documented</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-cyan-500/20">
                <a href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">Read Docs →</a>
              </div>
            </div>

            {/* CLI Tool */}
            <div className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
              <ShieldCheckIcon className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Command Line Tool</h3>
              <p className="text-gray-400 mb-4">Automate scanning from your terminal</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✓ Batch file scanning</li>
                <li>✓ Automation scripts</li>
                <li>✓ CI/CD integration</li>
                <li>✓ JSON output</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center scroll-animate">How It Works</h2>
          <div className="space-y-8">
            <div className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
              <div className="flex gap-4">
                <div className="bg-cyan-500/20 w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Enter Your Data</h3>
                  <p className="text-gray-400">Paste a password, upload a file, or enter a URL</p>
                </div>
              </div>
            </div>
            <div className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
              <div className="flex gap-4">
                <div className="bg-cyan-500/20 w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">We Check Multiple Databases</h3>
                  <p className="text-gray-400">Cross-reference with HaveIBeenPwned, VirusTotal, Google Safe Browsing, and more</p>
                </div>
              </div>
            </div>
            <div className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
              <div className="flex gap-4">
                <div className="bg-cyan-500/20 w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Get Your Results</h3>
                  <p className="text-gray-400">Know instantly if your password was breached, if a file is safe, or if a link is malicious</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 px-4 bg-gray-800/30 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 scroll-animate">Privacy First</h2>
          <p className="text-gray-300 text-lg mb-12 scroll-animate">We take your privacy seriously. Here's what we do:</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-lg mb-4">
                <LockIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">No File Storage</h3>
              <p className="text-gray-400">Uploaded files are scanned and immediately deleted. Never stored on our servers.</p>
            </div>
            <div className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg mb-4">
                <ExclamationIcon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">No Tracking</h3>
              <p className="text-gray-400">We don't track your activity, sell your data, or use cookies for ads.</p>
            </div>
            <div className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Open Source</h3>
              <p className="text-gray-400">Our code is open source. Anyone can audit it to verify our privacy claims.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center scroll-animate">Why Use HawkEye?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="scroll-animate flex gap-4">
              <CheckCircleIcon className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Actually Free</h3>
                <p className="text-gray-400">No premium plans. No upsells. No hidden costs. Completely free forever.</p>
              </div>
            </div>
            <div className="scroll-animate flex gap-4">
              <CheckCircleIcon className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Results</h3>
                <p className="text-gray-400">Scan results in seconds using real-time threat databases</p>
              </div>
            </div>
            <div className="scroll-animate flex gap-4">
              <GlobeIcon className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Trusted Sources</h3>
                <p className="text-gray-400">We use HaveIBeenPwned, VirusTotal, and Google Safe Browsing</p>
              </div>
            </div>
            <div className="scroll-animate flex gap-4">
              <DocumentIcon className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Multiple Ways</h3>
                <p className="text-gray-400">Web app, CLI, REST API - use however works best for you</p>
              </div>
            </div>
            <div className="scroll-animate flex gap-4">
              <DocumentIcon className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Learn From Us</h3>
                <p className="text-gray-400">Read our blog to stay updated on security threats and best practices</p>
              </div>
            </div>
            <div className="scroll-animate flex gap-4">
              <div className="text-3xl flex-shrink-0">🛠️</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Built By Us</h3>
                <p className="text-gray-400">Created by security enthusiasts who actually use these tools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2025 HawkEye. All rights reserved. Protecting the digital world, one scan at a time.</p>
        </div>
      </footer>
    </div>
  )
}
