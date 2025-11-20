import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ShieldCheckIcon, SearchIcon, LockIcon, CheckCircleIcon } from '../components/Icons'

export default function About() {
  const [user, setUser] = useState(null)
  useScrollAnimation()

  useEffect(() => {
    const storedUser = localStorage.getItem('hawkeye_user')
    setUser(storedUser)
  }, [])
  const team = [
    { name: 'Granth Gupta', role: 'Founder & Security Lead', icon: 'lock' },
    { name: 'Chirag Bansal', role: 'Backend Engineer', icon: 'file' },
    { name: 'Bhumi Arora', role: 'Frontend Developer', icon: 'code' },
    { name: 'Chahat Gupta', role: 'Security Analyst', icon: 'shield' }
  ]

  const getTeamIcon = (iconType) => {
    const iconProps = 'w-12 h-12 mx-auto mb-4'
    if (iconType === 'lock') return <LockIcon className={`${iconProps} text-cyan-400`} />
    if (iconType === 'file') return <SearchIcon className={`${iconProps} text-green-400`} />
    if (iconType === 'shield') return <ShieldCheckIcon className={`${iconProps} text-purple-400`} />
    return <CheckCircleIcon className={`${iconProps} text-blue-400`} />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">HawkEye</span>
          </h1>
          <p className="text-xl text-gray-400">
            Dedicated to providing cutting-edge cybersecurity solutions that protect your digital assets and privacy
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We started HawkEye because we got tired of bloated security software and sketchy online tools. We wanted something simple: check if your password was breached, scan a file for malware, verify a suspicious link - and get honest results.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We're committed to keeping it simple, keeping it free, and keeping our code honest.
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-8 border border-cyan-500/20">
              <ShieldCheckIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-gray-300 text-center">
                Protecting millions of users worldwide with advanced threat detection and real-time security intelligence.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-8 border border-blue-500/20 order-2 md:order-1">
              <SearchIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-300 text-center">
                Built on HaveIBeenPwned for breach checking, VirusTotal for malware scanning, and Google Safe Browsing for link analysis.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-white mb-6\">How We Work</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We don't have proprietary algorithms or secret databases. We partner with trusted third parties so you know exactly what you're getting.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Everything we do is built on open standards. Our code is open source. No blackbox AI. No hidden tracking. Just honest security tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Core Values - CIA Triad</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'lock',
                title: 'Confidentiality',
                description: 'Protecting sensitive data from unauthorized access. Your information remains private and secure with advanced encryption and access controls.'
              },
              {
                icon: 'check',
                title: 'Integrity',
                description: 'Ensuring data accuracy and consistency. We verify that your files and information have not been altered or compromised by malicious actors.'
              },
              {
                icon: 'available',
                title: 'Availability',
                description: 'Guaranteeing reliable 24/7 access to our services. Your security tools are always available when you need them with 99.9% uptime.'
              }
            ].map((value, index) => {
              const getIcon = () => {
                if (value.icon === 'lock') return <LockIcon className="w-10 h-10 text-cyan-400 mx-auto" />
                if (value.icon === 'check') return <CheckCircleIcon className="w-10 h-10 text-green-400 mx-auto" />
                return <CheckCircleIcon className="w-10 h-10 text-blue-400 mx-auto" />
              }
              return (
                <div key={index} className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
                  <div className="mb-4">{getIcon()}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-colors">
                {getTeamIcon(member.icon)}
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-y border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '100K+', label: 'Active Users' },
              { number: '50M+', label: 'Files Scanned' },
              { number: '10M+', label: 'URLs Analyzed' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
          <p className="text-gray-400 mb-8">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div className="space-y-3 mb-8">
            <p className="text-gray-300">📧 Email: support@hawkeye.io</p>
            <p className="text-gray-300">🌐 Website: www.hawkeye.io</p>
            <p className="text-gray-300">💬 Discord: Join our community</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all font-semibold inline-block"
            >
              Start Using HawkEye
            </a>
            <a
              href="/blog"
              className="bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-600 transition-all font-semibold inline-block"
            >
              Read Our Blog
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
