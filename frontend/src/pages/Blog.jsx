import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { SearchIcon, FileIcon, GlobeIcon, CheckCircleIcon, LockIcon, WarningIcon, ShieldCheckIcon, InfoIcon, AnalyticsIcon, DownloadIcon } from '../components/Icons'

export default function Blog() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortBy, setSortBy] = useState('recent') // recent, popular, trending
  useScrollAnimation()

  useEffect(() => {
    const storedUser = localStorage.getItem('hawkeye_user')
    setUser(storedUser)
  }, [])

  const getArticleIcon = (iconType) => {
    const iconProps = "w-8 h-8"
    const iconMap = {
      'lock': <LockIcon className={`${iconProps} text-cyan-400`} />,
      'warning': <WarningIcon className={`${iconProps} text-yellow-400`} />,
      'info': <InfoIcon className={`${iconProps} text-blue-400`} />,
      'file': <FileIcon className={`${iconProps} text-green-400`} />,
      'analytics': <AnalyticsIcon className={`${iconProps} text-purple-400`} />,
      'shield': <ShieldCheckIcon className={`${iconProps} text-green-400`} />,
      'download': <DownloadIcon className={`${iconProps} text-pink-400`} />,
      'globe': <GlobeIcon className={`${iconProps} text-blue-400`} />
    }
    return iconMap[iconType] || <InfoIcon className={`${iconProps} text-cyan-400`} />
  }

  const articles = [
    {
      id: 1,
      title: '10 Signs Your Password Has Been Compromised',
      author: 'Security Team',
      date: 'Nov 15, 2025',
      category: 'Security Tips',
      excerpt: 'Learn the warning signs that indicate your password may have been part of a data breach and what you should do immediately...',
      icon: 'lock',
      views: 4520,
      shares: 342,
      readTime: '5 min',
      content: `<h2>Introduction</h2><p>In today's digital landscape, password breaches are becoming increasingly common. Hackers are constantly targeting databases to steal login credentials. If your password has been compromised, your accounts are at serious risk. Here are 10 critical signs that indicate your password may have been breached.</p><h2>1. Unfamiliar Account Activity</h2><p>If you notice login attempts from locations you've never visited or at unusual times, this is a major red flag. Check your account's login history and look for sessions you don't recognize.</p><h2>2. Password Reset Requests</h2><p>Receiving unexpected password reset emails or notifications that someone tried to reset your password is a strong indicator of compromise. Never ignore these warnings.</p><h2>3. Changed Account Settings</h2><p>If your recovery email, phone number, or security questions have been altered without your authorization, someone has accessed your account.</p><h2>4. Missing or Modified Data</h2><p>Discovering that files, emails, or personal information have been deleted or modified is concerning. This could indicate unauthorized access to your account.</p><h2>5. Unexpected Password Failures</h2><p>If your password suddenly stops working even though you're entering it correctly, attackers may have already changed it.</p><h2>6. Alerts from Security Services</h2><p>Services like HaveIBeenPwned or your email provider will notify you if your credentials appear in a known data breach. Take these alerts seriously.</p><h2>7. Friends Report Strange Messages</h2><p>If contacts tell you they received suspicious messages or emails from your account, your credentials may be compromised.</p><h2>8. Financial Account Anomalies</h2><p>Unauthorized transactions, missing funds, or new accounts opened in your name are signs of account compromise affecting financial services.</p><h2>9. Two-Factor Authentication Disabled</h2><p>Discovering that your 2FA has been turned off without your request indicates someone has control of your account.</p><h2>10. Browser Warnings</h2><p>Chrome, Firefox, and other browsers now warn users about compromised passwords. If you see such warnings, change your password immediately.</p><h2>What To Do If Compromised</h2><p>If you notice any of these signs: 1) Change your password immediately, 2) Enable two-factor authentication, 3) Check account recovery settings, 4) Review active sessions and log out unauthorized devices, 5) Monitor your accounts closely for future suspicious activity.</p>`,
      trending: true
    },
    {
      id: 2,
      title: 'How Machine Learning Improves Malware Detection',
      author: 'Tech Lead',
      date: 'Nov 12, 2025',
      category: 'Technology',
      excerpt: 'Discover how AI and machine learning are revolutionizing the way we detect and prevent malware threats in real-time...',
      icon: 'warning',
      views: 3890,
      shares: 289,
      readTime: '8 min',
      content: `<h2>Evolution of Detection</h2><p>Traditional signature-based matching has limitations. ML models learn patterns from thousands of samples recognizing behavioral characteristics that indicate malicious intent.</p><h2>How ML Works</h2><p>Analyzes file structure, API calls, resource usage, and network behavior. Achieves 99%+ accuracy distinguishing malicious from benign.</p><h2>Advantages</h2><p>Zero-day protection for unknown variants. Real-time instant processing. Reduced false positives. Adaptive continuous learning.</p>`,
      trending: false
    },
    {
      id: 3,
      title: 'Understanding Phishing Attacks and How to Avoid Them',
      author: 'Security Expert',
      date: 'Nov 10, 2025',
      category: 'Security Tips',
      excerpt: 'A comprehensive guide to recognizing phishing attempts and protecting your personal information from cybercriminals...',
      icon: 'info',
      views: 5230,
      shares: 456,
      readTime: '6 min',
      content: `<h2>What is Phishing?</h2><p>Phishing is social engineering where criminals impersonate organizations to trick users into revealing sensitive information.</p><h2>Common Tactics</h2><p>Email Phishing: Fake emails from banks. Spear Phishing: Targeted attacks on specific individuals. Whaling: Attacks on executives. Clone Phishing: Recreated emails with malicious links.</p><h2>How to Identify</h2><p>Check sender carefully. Hover over links to see actual URL. Look for spelling errors. Be wary of urgency. Legitimate companies never ask for passwords via email. Check for generic greetings.</p><h2>Protection</h2><p>Enable 2FA. Use password managers. Email filtering. Keep software updated. Navigate directly to websites. Verify by contacting organizations directly.</p><h2>If You Fall For It</h2><p>Change passwords immediately. Contact the organization. Monitor accounts. Place credit freeze if needed. Report to authorities and the organization.</p>`,
      trending: true
    },
    {
      id: 4,
      title: 'The Rise of Zero-Day Exploits: What You Need to Know',
      author: 'Security Team',
      date: 'Nov 8, 2025',
      category: 'Threat Intelligence',
      excerpt: 'Explore the world of zero-day vulnerabilities and how organizations are adapting their defenses to combat emerging threats...',
      icon: 'warning',
      views: 3120,
      shares: 245,
      readTime: '9 min',
      content: `<h2>Zero-Day Definition</h2><p>A security flaw unknown to the vendor and public. The term "zero-day" refers to zero days notice developers have to fix the issue before exploitation.</p><h2>Why Dangerous</h2><p>No patches exist leaving all users vulnerable. Detection is difficult without signatures. Campaigns compromise large systems before discovery. Often used in targeted attacks against high-value targets.</p><h2>Historical Examples</h2><p>Stuxnet (2010) used multiple zero-days. WannaCry (2017) utilized Windows zero-day. Log4Shell (2021) affected millions of systems.</p><h2>The Market</h2><p>Black market exists with prices ranging from thousands to millions. Creates perverse incentive for keeping exploits secret rather than disclosing responsibly.</p><h2>Detection Strategy</h2><p>Behavior-based detection systems. Machine learning to identify suspicious patterns. Advanced endpoint protection. Robust logging and monitoring. Network segmentation.</p>`,
      trending: false
    },
    {
      id: 5,
      title: 'Best Practices for File Sharing and Security',
      author: 'Tech Lead',
      date: 'Nov 5, 2025',
      category: 'Security Tips',
      excerpt: 'Learn how to safely share files while maintaining security and protecting sensitive information from unauthorized access...',
      icon: 'file',
      views: 2890,
      shares: 201,
      readTime: '7 min',
      content: `<h2>Risks of File Sharing</h2><p>File sharing is essential but introduces security risks. Unencrypted files can be intercepted. Public shares can expose sensitive data. Malware spreads through shared documents. Poor access controls lead to unauthorized access.</p><h2>Cloud Storage Security</h2><p>Enable strong authentication and 2FA. Use end-to-end encryption. Regularly audit access permissions. Don't share links publicly. Use expiring links. Keep files updated with patches.</p><h2>Encryption Practices</h2><p>Encrypt files before uploading. Use AES-256 encryption. Store keys separately from files. Consider encrypted containers like VeraCrypt. Use full-disk encryption on personal devices.</p><h2>Secure Methods</h2><p>SFTP for enterprise. PGP encryption for email. VPNs when on public networks. Password-protected archives. Temporary file-sharing services with expiration.</p><h2>Access Control</h2><p>Implement least privilege. Use role-based access control (RBAC). Regular access reviews. Maintain audit logs. Restrict downloading. Implement time-based restrictions.</p>`,
      trending: false
    },
    {
      id: 6,
      title: 'The Future of Cybersecurity in 2026',
      author: 'Security Expert',
      date: 'Nov 1, 2025',
      category: 'Trends',
      excerpt: 'Industry predictions and insights on what cybersecurity landscape will look like in the coming year based on current trends...',
      icon: 'analytics',
      views: 4150,
      shares: 378,
      readTime: '10 min',
      content: `<h2>AI and Machine Learning Revolution</h2><p>AI will revolutionize threat detection and incident response. Autonomous response systems will neutralize threats in milliseconds. Machine learning models will predict attack patterns. AI-powered security will adapt faster than human teams. Organizations must prepare for AI-driven security infrastructure.</p><h2>Quantum Computing Threats</h2><p>Quantum computers will break current encryption. RSA and ECC will become obsolete. Post-quantum cryptography standards are being adopted. Organizations must transition to quantum-safe algorithms. This is a critical multi-year migration effort.</p><h2>Zero Trust Architecture</h2><p>Perimeter security is dead. Zero Trust means verify everything. Assume breach mentality. Continuous authentication and verification. Microsegmentation of networks. Cloud-first security models becoming standard.</p><h2>Supply Chain Security</h2><p>Third-party risks are increasing. Software supply chain attacks are growing. Vendor security requirements becoming mandatory. Software bill of materials (SBOM) adoption. Dependency tracking and management critical.</p><h2>Cybersecurity Skills Gap</h2><p>Shortage of qualified security professionals. Automation needed to compensate. Entry-level training programs expanding. Universities adding security curricula. Career growth in cybersecurity accelerating.</p>`,
      trending: true
    },
    {
      id: 7,
      title: 'Ransomware Prevention: A Complete Guide',
      author: 'Security Team',
      date: 'Oct 28, 2025',
      category: 'Security Tips',
      excerpt: 'Everything you need to know about ransomware attacks and how to protect your business from this growing threat...',
      icon: 'warning',
      views: 5890,
      shares: 512,
      readTime: '11 min',
      content: `<h2>Understanding Ransomware</h2><p>Ransomware encrypts your files and demands payment for decryption keys. Modern ransomware exfiltrates data before encryption, threatening to publish sensitive information. Attack scale ranges from individual computers to entire enterprises. Recovery can take weeks or months without backups.</p><h2>Attack Vectors</h2><p>Email phishing with malicious attachments. Compromised credentials granting network access. Unpatched vulnerabilities in applications. Remote Desktop Protocol (RDP) exposed to internet. USB drives and removable media. Supply chain compromise.</p><h2>Ransomware Types</h2><p>Crypto-ransomware encrypts files. Locker-ransomware locks access to systems. Wiper-ransomware destroys data. Double extortion adds data theft threat. Mobile ransomware targets smartphones. IoT device targeting increasing.</p><h2>Prevention Strategies</h2><p>Regular software updates and patches. Strong access controls. Multi-factor authentication. Network segmentation. Regular security awareness training. Email security and filtering. Endpoint detection and response (EDR).</p><h2>Backup Strategy</h2><p>Implement 3-2-1 backup rule: 3 copies, 2 different media, 1 offsite. Air-gapped backups not connected to network. Encrypted backups. Regular restore testing. Document backup procedures.</p><h2>Incident Response</h2><p>Don't pay ransom. Immediately isolate affected systems. Preserve evidence. Contact law enforcement. Notify stakeholders and regulators. Communicate with transparency. Learn from incident and improve defenses.</p>`,
      trending: true
    },
    {
      id: 8,
      title: 'Two-Factor Authentication: Why It Matters',
      author: 'Tech Lead',
      date: 'Oct 25, 2025',
      category: 'Security Tips',
      excerpt: 'Understand the importance of two-factor authentication and how it significantly improves your account security...',
      icon: 'lock',
      views: 3450,
      shares: 298,
      readTime: '5 min',
      content: `<h2>Password Vulnerability</h2><p>Passwords alone are insufficient. Brute force attacks can crack weak passwords. Password reuse across sites means one breach compromises multiple accounts. Social engineering bypasses password security. Keyboard loggers steal credentials.</p><h2>What is 2FA</h2><p>Two-Factor Authentication requires two verification methods. Something you know (password). Something you have (phone, token, key). Something you are (biometric). 2FA dramatically increases account security even if password compromised.</p><h2>Authentication Methods</h2><p>SMS/Text codes (least secure). TOTP apps (Google Authenticator, Authy). Hardware keys (YubiKey, most secure). Biometric (fingerprint, face recognition). Push notifications. Backup codes for account recovery.</p><h2>Best Practices</h2><p>Enable 2FA everywhere possible. Use authenticator apps over SMS. Store backup codes securely. Test recovery methods. Use hardware keys for critical accounts. Never share authentication codes. Set up 2FA on backup email.</p><h2>SIM Swapping Attacks</h2><p>Attackers convince carriers to port your number. SMS codes go to attacker's phone. Bypass SMS-based 2FA. Protect account with carrier PIN. Use authenticator apps instead of SMS. Monitor phone account activity.</p><h2>Enterprise 2FA</h2><p>Mandatory enforcement improves security. Single Sign-On (SSO) integration. Conditional access policies. Risk-based authentication. Passwordless authentication emerging as alternative.</p>`,
      trending: false
    },
    {
      id: 9,
      title: 'API Security Best Practices',
      author: 'Security Expert',
      date: 'Oct 22, 2025',
      category: 'Technology',
      excerpt: 'Learn essential API security practices to protect your applications and data from unauthorized access and attacks...',
      icon: 'globe',
      views: 2650,
      shares: 187,
      readTime: '9 min',
      content: `<h2>API Attack Surface</h2><p>APIs expose application functionality to attackers. Broken authentication allows unauthorized access. Improper access control enables privilege escalation. Sensitive data exposure through API responses. Injection attacks through API parameters. Mass assignment vulnerabilities.</p><h2>Common Vulnerabilities</h2><p>Missing authentication and authorization. Excessive data exposure in responses. Lack of rate limiting enables brute force. Broken function level access control. Security misconfiguration. Insecure deserialization attacks. Injection vulnerabilities (SQL, NoSQL, command).</p><h2>Authentication Best Practices</h2><p>Require API authentication for all endpoints. Use OAuth 2.0 or OpenID Connect. Implement strong token validation. Use HTTPS for all API traffic. Short token expiration. Token revocation mechanisms. Secure token storage.</p><h2>Input Validation</h2><p>Validate all input parameters. Whitelist acceptable values. Sanitize data to prevent injection. Check input types and formats. Enforce size limits. Reject suspicious patterns. Log validation failures.</p><h2>Rate Limiting</h2><p>Implement API rate limits. Identify clients by API key. Progressive rate limiting strategies. Temporary bans for abuse. Alert on suspicious patterns. Distinguish legitimate usage. Monitor API usage trends.</p><h2>Monitoring and Testing</h2><p>Log all API access. Monitor for anomalies. Regular security testing. API security scanning. Penetration testing. Document API contracts. Version management strategy.</p>`,
      trending: false
    },
    {
      id: 10,
      title: 'Data Breach Response Plan: What Every Company Needs',
      author: 'Security Team',
      date: 'Oct 19, 2025',
      category: 'Threat Intelligence',
      excerpt: 'A step-by-step guide to creating an effective data breach response plan for your organization...',
      icon: 'shield',
      views: 4280,
      shares: 365,
      readTime: '12 min',
      content: `<h2>Why Planning Matters</h2><p>Breach response speed directly impacts damage. Organizations with plans respond 40% faster. Prepared teams minimize data exposure. Clear procedures reduce confusion. Documented processes ensure consistency. Recovery time decreases significantly. Incident costs reduce substantially.</p><h2>Response Team Structure</h2><p>Security lead coordinating response. Legal counsel managing compliance. Communications managing public messaging. IT operations handling containment. Incident commander providing oversight. Finance tracking costs. HR managing employee communications.</p><h2>Detection Phase</h2><p>Monitor security alerts continuously. Establish baseline metrics. Implement intrusion detection systems. Review logs for suspicious activity. Deploy endpoint detection tools. Security Information Event Management (SIEM). Threat intelligence integration.</p><h2>Containment Strategy</h2><p>Isolate affected systems immediately. Stop the attack spread. Preserve evidence for investigation. Prevent attacker escalation. Segment networks. Disable compromised credentials. Patch identified vulnerabilities.</p><h2>Communication and Notification</h2><p>Notify affected individuals within legal timeframe. Be transparent about what happened. Provide credit monitoring for compromised personal data. Establish notification procedures. Prepare statement templates. Designate spokesperson. Manage media inquiries.</p><h2>Legal and Regulatory</h2><p>Know applicable regulations: GDPR, HIPAA, state laws. Notify law enforcement if required. Document all incidents. Prepare privacy impact assessment. Implement corrective actions. File required reports. Learn from investigation findings.</p>`,
      trending: true
    },
    {
      id: 11,
      title: 'Cloud Security Essentials',
      author: 'Tech Lead',
      date: 'Oct 16, 2025',
      category: 'Technology',
      excerpt: 'Master the fundamentals of cloud security and learn how to secure your cloud infrastructure effectively...',
      icon: 'download',
      views: 3200,
      shares: 256,
      readTime: '8 min',
      content: `<h2>Shared Responsibility Model</h2><p>Cloud providers secure infrastructure. Organizations secure data and access. Understand your provider's responsibility. Know what you must protect. IaaS requires most security effort. SaaS provides most security by provider. Misunderstanding responsibility model causes breaches.</p><h2>Cloud Provider Security</h2><p>Choose certified providers: ISO 27001, SOC 2. Review security certifications. Understand data center security. Know disaster recovery capabilities. Assess incident response procedures. Verify encryption standards. Check compliance certifications.</p><h2>Identity and Access Management</h2><p>Implement strong IAM policies. Principle of least privilege. Regular access reviews. Multi-factor authentication. Federated identity management. Single Sign-On (SSO) integration. Service account management.</p><h2>Data Protection</h2><p>Encrypt data at rest. Encrypt data in transit (TLS/SSL). Use provider-managed or customer-managed keys. Data classification policies. Sensitive data handling procedures. Regular backup encryption. Secure deletion processes.</p><h2>Network Security</h2><p>Virtual Private Cloud (VPC) isolation. Security groups and network ACLs. VPN connections. DDoS protection. Web Application Firewalls (WAF). API rate limiting. Network monitoring.</p><h2>Compliance and Governance</h2><p>Maintain compliance documentation. Regular compliance audits. Vendor assessment procedures. Data residency requirements. Audit logging enabled. Regular security patches. Configuration management.</p>`,
      trending: false
    },
    {
      id: 12,
      title: 'Social Engineering Attacks: How to Protect Your Team',
      author: 'Security Expert',
      date: 'Oct 13, 2025',
      category: 'Security Tips',
      excerpt: 'Learn about social engineering tactics and how to train your team to recognize and prevent these manipulative attacks...',
      icon: 'info',
      views: 4620,
      shares: 398,
      readTime: '7 min',
      content: `<h2>Understanding Social Engineering</h2><p>Social engineering manipulates human psychology to gain unauthorized access. Exploits trust rather than technical vulnerabilities. Often precedes other attacks. Success rates high due to human nature. Range from simple pretexting to sophisticated campaigns. Humans are the weakest link in security.</p><h2>Common Tactics</h2><p>Phishing: Fraudulent emails appearing legitimate. Pretexting: Creating false scenarios to gain trust. Baiting: Offering something enticing to trigger action. Tailgating: Following authorized personnel into restricted areas. Shoulder surfing: Observing someone entering credentials. Dumpster diving: Searching trash for sensitive information.</p><h2>Recognizing Attempts</h2><p>Verify sender identity independently. Check for spelling/grammar errors. Suspicious links and attachments. Unexpected requests for information. Urgency or pressure language. Requests for passwords or sensitive data. Too-good-to-be-true offers.</p><h2>Personal Defense</h2><p>Never share passwords. Be skeptical of requests. Verify through official channels. Don't open suspicious attachments. Use strong authentication. Think before sharing personal information. Report suspicious activity immediately.</p><h2>Business Training</h2><p>Regular security awareness training. Simulated phishing campaigns. Report mechanism for employees. Leadership demonstrates best practices. Create security culture. Consequences for risky behavior. Positive reinforcement for vigilance.</p><h2>Physical Security</h2><p>Visitor badge systems. Secure entry/exit points. Desk clear of sensitive documents. Lock screens when away. Secure document shredding. Conference room privacy. Monitor unusual activity.</p>`,
      trending: true
    }
  ]

  const categories = ['Security Tips', 'Technology', 'Threat Intelligence', 'Trends']

  const getSortedArticles = () => {
    let filtered = selectedCategory 
      ? articles.filter(a => a.category === selectedCategory)
      : articles

    if (sortBy === 'popular') {
      return [...filtered].sort((a, b) => b.views - a.views)
    } else if (sortBy === 'trending') {
      return [...filtered].sort((a, b) => {
        if (a.trending !== b.trending) return b.trending - a.trending
        return b.views - a.views
      })
    }
    return filtered // recent (original order)
  }

  const popularArticles = articles.sort((a, b) => b.views - a.views).slice(0, 5)
  const trendingArticles = articles.filter(a => a.trending).sort((a, b) => b.shares - a.shares)

  const sortedArticles = getSortedArticles()
  const featured = sortedArticles[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Security <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-xl text-gray-400">
            Latest insights, tips, and trends in cybersecurity from our expert team
          </p>
        </div>
      </section>

      {/* Sorting and Filtering */}
      <section className="py-8 px-4 bg-gray-800/20 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                  selectedCategory === null
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All Articles
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg hover:border-cyan-500 transition-colors text-sm"
              >
                <option value="recent">Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">
            {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'} ({sortedArticles.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => navigate(`/blog/${article.id}`)}
                className="scroll-animate bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group block text-left w-full"
              >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg mb-4 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all">
                {getArticleIcon(article.icon)}
              </div>
                {article.trending && (
                  <div className="mb-3">
                    <span className="inline-block bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3" /> TRENDING
                    </span>
                  </div>
                )}
                <div className="mb-3">
                  <span className="inline-block bg-gray-700 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                
                <div className="mb-3 flex gap-3 text-xs text-gray-500">
                  <span>👁️ {(article.views / 1000).toFixed(1)}k</span>
                  <span>📤 {article.shares}</span>
                  <span>⏱️ {article.readTime}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-700">
                  <div>
                    <span>{article.author}</span>
                    <span className="mx-2">•</span>
                    <span>{article.date}</span>
                  </div>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Most Popular & Trending Sidebar */}
      <section className="py-16 px-4 bg-gray-800/20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Most Popular */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <AnalyticsIcon className="w-6 h-6 text-cyan-400" /> Most Popular
            </h2>
            <div className="space-y-4">
              {popularArticles.map((article, idx) => (
                <button
                  key={article.id}
                  onClick={() => navigate(`/blog/${article.id}`)}
                  className="flex gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition-all group w-full text-left"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="text-xs text-gray-400 mt-1">
                      👁️ {article.views.toLocaleString()} views
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircleIcon className="w-6 h-6 text-red-400" /> Trending Now
            </h2>
            <div className="space-y-4">
              {trendingArticles.map((article, idx) => (
                <button
                  key={article.id}
                  onClick={() => navigate(`/blog/${article.id}`)}
                  className="flex gap-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg hover:border-red-500/50 transition-all group w-full text-left"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-orange-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="text-xs text-gray-400 mt-1">
                      📤 {article.shares} shares
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-8">Get the latest security insights and tips delivered to your inbox weekly</p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }} className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-800/30 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Take Action?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all font-semibold inline-block"
            >
              Start Scanning Now
            </a>
            <a
              href="/pricing"
              className="bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-600 transition-all font-semibold inline-block"
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
