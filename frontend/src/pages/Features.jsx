import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { LockIcon, FileIcon, GlobeIcon, ShieldCheckIcon, ChartIcon, DocumentIcon } from '../components/Icons'

export default function Features() {
  const [user, setUser] = useState(null)
  useScrollAnimation()

  useEffect(() => {
    const storedUser = localStorage.getItem('hawkeye_user')
    setUser(storedUser)
  }, [])

  const getFeatureIcon = (index) => {
    const iconProps = 'w-12 h-12 mb-4'
    const icons = [
      <LockIcon key="lock" className={`${iconProps} text-cyan-400`} />,
      <FileIcon key="file" className={`${iconProps} text-orange-400`} />,
      <GlobeIcon key="globe" className={`${iconProps} text-blue-400`} />,
      <ShieldCheckIcon key="shield" className={`${iconProps} text-green-400`} />,
      <ChartIcon key="chart" className={`${iconProps} text-purple-400`} />,
      <DocumentIcon key="doc" className={`${iconProps} text-pink-400`} />
    ]
    return icons[index] || icons[0]
  }

  const features = [
    {
      title: 'Password Breach Detection',
      description: 'Check if your passwords have been compromised in known data breaches using HaveIBeenPwned API',
      details: ['Real-time breach detection', 'Check multiple passwords', 'Secure k-anonymity model', 'Instant results']
    },
    {
      title: 'Advanced File Scanning',
      description: 'Scan files with 70+ antivirus engines for comprehensive malware detection',
      details: ['70+ antivirus engines', 'Hash-based detection', 'Detailed analysis reports', 'File quarantine ready']
    },
    {
      title: 'URL & Website Analysis',
      description: 'Analyze URLs for phishing, malware, and suspicious content with dual-layer protection',
      details: ['Phishing detection', 'Malware scanning', 'Safe Browsing integration', 'Real-time verdicts']
    },
    {
      title: 'Real-time Protection',
      description: 'Get instant security alerts and threat assessments for your files and URLs',
      details: ['Instant analysis', 'Live updates', 'Threat intelligence', 'Expert reports']
    },
    {
      title: 'Detailed Reports',
      description: 'Comprehensive scanning reports with actionable insights and recommendations',
      details: ['Full analysis logs', 'Engine verdicts', 'Risk assessment', 'Download reports']
    },
    {
      title: 'Continuous Updates',
      description: 'Stay protected with continuously updated threat definitions and security patches',
      details: ['Daily updates', 'New threats', 'Security patches', 'Threat intelligence']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Powerful <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Security Features</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive protection with advanced scanning, real-time threat detection, and detailed security reports
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                {getFeatureIcon(index)}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 mb-4 text-sm">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                      <span className="text-cyan-400">✓</span> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-y border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Secure Your Digital Life?</h2>
          <p className="text-gray-300 mb-8 text-lg">Start scanning files and URLs with HawkEye today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all font-semibold"
            >
              Get Started Free
            </a>
            <a
              href="/pricing"
              className="inline-block bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-600 transition-all font-semibold"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2025 HawkEye. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
