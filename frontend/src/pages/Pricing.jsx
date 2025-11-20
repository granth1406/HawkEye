import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Pricing() {
  const [user, setUser] = useState(null)
  useScrollAnimation()

  useEffect(() => {
    const storedUser = localStorage.getItem('hawkeye_user')
    setUser(storedUser)
  }, [])
  const handleGetStarted = (planName) => {
    window.location.href = '/dashboard'
  }

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for individuals getting started',
      features: [
        '5 file scans/month',
        '10 URL scans/month',
        'Unlimited password checks',
        'Basic reports',
        'Community support'
      ],
      color: 'border-gray-700'
    },
    {
      name: 'Professional',
      price: '$9.99',
      period: '/month',
      description: 'Best for serious security enthusiasts',
      features: [
        'Unlimited file scans',
        'Unlimited URL scans',
        'Unlimited password checks',
        'Advanced reports with priority',
        'Email support',
        'Real-time alerts',
        'Detailed analytics'
      ],
      color: 'border-cyan-500/50 bg-cyan-500/5',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For businesses and organizations',
      features: [
        'Everything in Professional',
        'Team management',
        'API access',
        'Custom integrations',
        '24/7 priority support',
        'Dedicated account manager',
        'Advanced threat intelligence'
      ],
      color: 'border-gray-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Simple, Transparent <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your security needs. Always secure, always protected.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`scroll-animate border rounded-lg p-8 transition-all ${plan.color} ${
                  plan.popular
                    ? 'transform md:scale-105 shadow-2xl shadow-cyan-500/20'
                    : 'bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-6">
                    <span className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400">{plan.period}</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleGetStarted(plan.name)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Get Started
                </button>

                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-gray-300 flex items-center gap-3 text-sm">
                      <span className="text-cyan-400 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-800/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, our Starter plan is completely free with limited scans per month.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and cryptocurrency payments.'
              },
              {
                q: 'Is my data secure?',
                a: 'Absolutely. We use enterprise-grade encryption and never store your files permanently.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription at any time with no cancellation fees.'
              }
            ].map((faq, index) => (
              <div key={index} className="scroll-animate border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Start Securing Your Data Today</h2>
          <p className="text-gray-300 mb-8">Join thousands of users protecting their digital assets</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all font-semibold inline-block"
            >
              Get Started Free
            </a>
            <a
              href="/features"
              className="bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-600 transition-all font-semibold inline-block"
            >
              Learn More
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
