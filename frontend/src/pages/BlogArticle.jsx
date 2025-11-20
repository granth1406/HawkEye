import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { CheckCircleIcon } from '../components/Icons'

export default function BlogArticle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  useScrollAnimation()

  useEffect(() => {
    const storedUser = localStorage.getItem('hawkeye_user')
    setUser(storedUser)
  }, [])

  useEffect(() => {
    // All articles data
    const allArticles = [
      {
        id: 1,
        title: '10 Signs Your Password Has Been Compromised',
        author: 'Security Team',
        date: 'Nov 15, 2025',
        category: 'Security Tips',
        excerpt: 'Learn the warning signs that indicate your password may have been part of a data breach and what you should do immediately...',
        icon: '🔑',
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
        icon: '🤖',
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
        icon: '🎣',
        views: 5230,
        shares: 412,
        readTime: '7 min',
        content: `<h2>What is Phishing?</h2><p>Phishing is a cyberattack technique where attackers impersonate legitimate organizations to trick individuals into revealing sensitive information or clicking malicious links. These attacks exploit human psychology and trust.</p><h2>Common Phishing Tactics</h2><p>Fake emails mimicking banks or popular services. Spoofed websites that look identical to legitimate ones. Urgent messages creating pressure to act quickly. Requests for passwords, credit card numbers, or personal data. Malicious attachments appearing as official documents.</p><h2>How to Identify Phishing</h2><p>Check sender's email address carefully. Look for spelling and grammar errors. Hover over links to see actual URL before clicking. Be suspicious of urgent or threatening messages. Verify through official channels if uncertain. Legitimate companies never ask for passwords via email.</p><h2>Protection Strategies</h2><p>Enable two-factor authentication on important accounts. Keep software updated with latest security patches. Use email filtering and spam detection. Be skeptical of unexpected attachments. Verify requests through official contact information. Mark suspicious emails as phishing.</p><h2>If You Fall for It</h2><p>Change your password immediately. Enable fraud alerts on financial accounts. Monitor credit reports for unauthorized activity. Contact your bank if financial information was shared. Report the phishing attempt to the legitimate organization.</p><h2>Business Email Compromise</h2><p>Targeted attacks on organizations. Attackers research executives and employees. Pretend to be authority figures. Request wire transfers or sensitive information. Impact can be devastating to businesses. Employee training is crucial defense.</p>`,
        trending: true
      },
      {
        id: 4,
        title: 'The Rise of Zero-Day Exploits',
        author: 'Threat Analyst',
        date: 'Nov 08, 2025',
        category: 'Threat Intelligence',
        excerpt: "Understand zero-day exploits, why they are dangerous, and how organizations can protect themselves against unknown vulnerabilities...",
        icon: '💣',
        views: 3120,
        shares: 201,
        readTime: '6 min',
        content: `<h2>What is a Zero-Day?</h2><p>A zero-day is a software vulnerability that is unknown to the vendor and has no patch available. Attackers exploit it before developers can create a fix. The name refers to the zero days developers have had to address it.</p><h2>Why They're Dangerous</h2><p>No patch available to prevent exploitation. Traditional defenses may not catch them. Attackers have complete advantage. Can affect millions of devices simultaneously. Often used by advanced threat actors and nation-states.</p><h2>Historical Examples</h2><p>Stuxnet: Targeted Iran's nuclear program using multiple zero-days. WannaCry: Exploited Windows vulnerability affecting 200,000+ computers. Heartbleed: Exposed billions of encrypted communications. Log4Shell: Allowed remote code execution in millions of applications.</p><h2>Zero-Day Market</h2><p>Underground markets buy and sell zero-day information. Governments purchase exploits for surveillance. Criminal organizations use them for targeted attacks. Prices range from thousands to millions of dollars.</p><h2>Detection Strategies</h2><p>Monitor for unusual system behavior. Deploy intrusion detection systems. Use behavioral analysis tools. Keep systems up-to-date with patches. Implement network segmentation. Disable unnecessary services. Monitor vendor security advisories closely.</p><h2>Mitigation Approach</h2><p>Assume breach mentality. Defense in depth strategy. Regular security updates. Network monitoring. Incident response planning. Employee training. Threat intelligence sharing.</p>`,
        trending: false
      },
      {
        id: 5,
        title: 'Best Practices for File Sharing and Security',
        author: 'Security Team',
        date: 'Nov 06, 2025',
        category: 'Security Tips',
        excerpt: 'Learn secure methods for sharing files while protecting sensitive data and preventing unauthorized access...',
        icon: '📁',
        views: 2890,
        shares: 156,
        readTime: '6 min',
        content: `<h2>Risks of File Sharing</h2><p>File sharing is essential but introduces security risks. Unencrypted files can be intercepted. Public shares can expose sensitive data. Malware spreads through shared documents. Poor access controls lead to unauthorized access.</p><h2>Cloud Storage Security</h2><p>Enable strong authentication and 2FA. Use end-to-end encryption. Regularly audit access permissions. Don't share links publicly. Use expiring links. Keep files updated with patches.</p><h2>Encryption Practices</h2><p>Encrypt files before uploading. Use AES-256 encryption. Store keys separately from files. Consider encrypted containers like VeraCrypt. Use full-disk encryption on personal devices.</p><h2>Secure Methods</h2><p>SFTP for enterprise. PGP encryption for email. VPNs when on public networks. Password-protected archives. Temporary file-sharing services with expiration.</p><h2>Access Control</h2><p>Implement least privilege. Use role-based access control (RBAC). Regular access reviews. Maintain audit logs. Restrict downloading. Implement time-based restrictions.</p>`,
        trending: false
      },
      {
        id: 6,
        title: 'The Future of Cybersecurity in 2026',
        author: 'Tech Lead',
        date: 'Nov 04, 2025',
        category: 'Trends',
        excerpt: 'Explore emerging cybersecurity trends and technologies that will shape the security landscape in the coming years...',
        icon: '🔮',
        views: 4150,
        shares: 298,
        readTime: '7 min',
        content: `<h2>AI and Machine Learning Revolution</h2><p>AI will revolutionize threat detection and incident response. Autonomous response systems will neutralize threats in milliseconds. Machine learning models will predict attack patterns. AI-powered security will adapt faster than human teams. Organizations must prepare for AI-driven security infrastructure.</p><h2>Quantum Computing Threats</h2><p>Quantum computers will break current encryption. RSA and ECC will become obsolete. Post-quantum cryptography standards are being adopted. Organizations must transition to quantum-safe algorithms. This is a critical multi-year migration effort.</p><h2>Zero Trust Architecture</h2><p>Perimeter security is dead. Zero Trust means verify everything. Assume breach mentality. Continuous authentication and verification. Microsegmentation of networks. Cloud-first security models becoming standard.</p><h2>Supply Chain Security</h2><p>Third-party risks are increasing. Software supply chain attacks are growing. Vendor security requirements becoming mandatory. Software bill of materials (SBOM) adoption. Dependency tracking and management critical.</p><h2>Cybersecurity Skills Gap</h2><p>Shortage of qualified security professionals. Automation needed to compensate. Entry-level training programs expanding. Universities adding security curricula. Career growth in cybersecurity accelerating.</p>`,
        trending: true
      },
      {
        id: 7,
        title: 'Ransomware Prevention: A Complete Guide',
        author: 'Security Expert',
        date: 'Nov 02, 2025',
        category: 'Threat Intelligence',
        excerpt: 'A comprehensive guide to preventing ransomware attacks and developing a strong recovery strategy for your organization...',
        icon: '🔐',
        views: 5890,
        shares: 521,
        readTime: '9 min',
        content: `<h2>Understanding Ransomware</h2><p>Ransomware encrypts your files and demands payment for decryption keys. Modern ransomware exfiltrates data before encryption, threatening to publish sensitive information. Attack scale ranges from individual computers to entire enterprises. Recovery can take weeks or months without backups.</p><h2>Attack Vectors</h2><p>Email phishing with malicious attachments. Compromised credentials granting network access. Unpatched vulnerabilities in applications. Remote Desktop Protocol (RDP) exposed to internet. USB drives and removable media. Supply chain compromise.</p><h2>Ransomware Types</h2><p>Crypto-ransomware encrypts files. Locker-ransomware locks access to systems. Wiper-ransomware destroys data. Double extortion adds data theft threat. Mobile ransomware targets smartphones. IoT device targeting increasing.</p><h2>Prevention Strategies</h2><p>Regular software updates and patches. Strong access controls. Multi-factor authentication. Network segmentation. Regular security awareness training. Email security and filtering. Endpoint detection and response (EDR).</p><h2>Backup Strategy</h2><p>Implement 3-2-1 backup rule: 3 copies, 2 different media, 1 offsite. Air-gapped backups not connected to network. Encrypted backups. Regular restore testing. Document backup procedures.</p><h2>Incident Response</h2><p>Don't pay ransom. Immediately isolate affected systems. Preserve evidence. Contact law enforcement. Notify stakeholders and regulators. Communicate with transparency. Learn from incident and improve defenses.</p>`,
        trending: true
      },
      {
        id: 8,
        title: 'Two-Factor Authentication: Why It Matters',
        author: 'Security Team',
        date: 'Oct 31, 2025',
        category: 'Security Tips',
        excerpt: 'Understand why two-factor authentication is critical for account security and how to implement it effectively...',
        icon: '🔑',
        views: 3450,
        shares: 267,
        readTime: '5 min',
        content: `<h2>Password Vulnerability</h2><p>Passwords alone are insufficient. Brute force attacks can crack weak passwords. Password reuse across sites means one breach compromises multiple accounts. Social engineering bypasses password security. Keyboard loggers steal credentials.</p><h2>What is 2FA</h2><p>Two-Factor Authentication requires two verification methods. Something you know (password). Something you have (phone, token, key). Something you are (biometric). 2FA dramatically increases account security even if password compromised.</p><h2>Authentication Methods</h2><p>SMS/Text codes (least secure). TOTP apps (Google Authenticator, Authy). Hardware keys (YubiKey, most secure). Biometric (fingerprint, face recognition). Push notifications. Backup codes for account recovery.</p><h2>Best Practices</h2><p>Enable 2FA everywhere possible. Use authenticator apps over SMS. Store backup codes securely. Test recovery methods. Use hardware keys for critical accounts. Never share authentication codes. Set up 2FA on backup email.</p><h2>SIM Swapping Attacks</h2><p>Attackers convince carriers to port your number. SMS codes go to attacker's phone. Bypass SMS-based 2FA. Protect account with carrier PIN. Use authenticator apps instead of SMS. Monitor phone account activity.</p>`,
        trending: false
      },
      {
        id: 9,
        title: 'API Security Best Practices',
        author: 'Tech Lead',
        date: 'Oct 29, 2025',
        category: 'Technology',
        excerpt: 'Learn essential API security practices to protect your applications from common vulnerabilities and attacks...',
        icon: '🔌',
        views: 2650,
        shares: 189,
        readTime: '7 min',
        content: `<h2>API Attack Surface</h2><p>APIs expose application functionality to attackers. Broken authentication allows unauthorized access. Improper access control enables privilege escalation. Sensitive data exposure through API responses. Injection attacks through API parameters. Mass assignment vulnerabilities.</p><h2>Common Vulnerabilities</h2><p>Missing authentication and authorization. Excessive data exposure in responses. Lack of rate limiting enables brute force. Broken function level access control. Security misconfiguration. Insecure deserialization attacks. Injection vulnerabilities (SQL, NoSQL, command).</p><h2>Authentication Best Practices</h2><p>Require API authentication for all endpoints. Use OAuth 2.0 or OpenID Connect. Implement strong token validation. Use HTTPS for all API traffic. Short token expiration. Token revocation mechanisms. Secure token storage.</p><h2>Input Validation</h2><p>Validate all input parameters. Whitelist acceptable values. Sanitize data to prevent injection. Check input types and formats. Enforce size limits. Reject suspicious patterns. Log validation failures.</p><h2>Rate Limiting</h2><p>Implement API rate limits. Identify clients by API key. Progressive rate limiting strategies. Temporary bans for abuse. Alert on suspicious patterns. Distinguish legitimate usage. Monitor API usage trends.</p>`,
        trending: false
      },
      {
        id: 10,
        title: 'Data Breach Response Plan',
        author: 'Incident Response',
        date: 'Oct 27, 2025',
        category: 'Threat Intelligence',
        excerpt: 'Develop a comprehensive data breach response plan to minimize damage and quickly restore operations...',
        icon: '⚠️',
        views: 4280,
        shares: 356,
        readTime: '8 min',
        content: `<h2>Why Planning Matters</h2><p>Breach response speed directly impacts damage. Organizations with plans respond 40% faster. Prepared teams minimize data exposure. Clear procedures reduce confusion. Documented processes ensure consistency. Recovery time decreases significantly. Incident costs reduce substantially.</p><h2>Response Team Structure</h2><p>Security lead coordinating response. Legal counsel managing compliance. Communications managing public messaging. IT operations handling containment. Incident commander providing oversight. Finance tracking costs. HR managing employee communications.</p><h2>Detection Phase</h2><p>Monitor security alerts continuously. Establish baseline metrics. Implement intrusion detection systems. Review logs for suspicious activity. Deploy endpoint detection tools. Security Information Event Management (SIEM). Threat intelligence integration.</p><h2>Containment Strategy</h2><p>Isolate affected systems immediately. Stop the attack spread. Preserve evidence for investigation. Prevent attacker escalation. Segment networks. Disable compromised credentials. Patch identified vulnerabilities.</p><h2>Communication and Notification</h2><p>Notify affected individuals within legal timeframe. Be transparent about what happened. Provide credit monitoring for compromised personal data. Establish notification procedures. Prepare statement templates. Designate spokesperson. Manage media inquiries.</p><h2>Legal and Regulatory</h2><p>Know applicable regulations: GDPR, HIPAA, state laws. Notify law enforcement if required. Document all incidents. Prepare privacy impact assessment. Implement corrective actions. File required reports. Learn from investigation findings.</p>`,
        trending: true
      },
      {
        id: 11,
        title: 'Cloud Security Essentials',
        author: 'Infrastructure Team',
        date: 'Oct 25, 2025',
        category: 'Technology',
        excerpt: 'Master the fundamentals of cloud security and protect your data in cloud environments...',
        icon: '☁️',
        views: 3200,
        shares: 234,
        readTime: '6 min',
        content: `<h2>Shared Responsibility Model</h2><p>Cloud providers secure infrastructure. Organizations secure data and access. Understand your provider's responsibility. Know what you must protect. IaaS requires most security effort. SaaS provides most security by provider. Misunderstanding responsibility model causes breaches.</p><h2>Cloud Provider Security</h2><p>Choose certified providers: ISO 27001, SOC 2. Review security certifications. Understand data center security. Know disaster recovery capabilities. Assess incident response procedures. Verify encryption standards. Check compliance certifications.</p><h2>Identity and Access Management</h2><p>Implement strong IAM policies. Principle of least privilege. Regular access reviews. Multi-factor authentication. Federated identity management. Single Sign-On (SSO) integration. Service account management.</p><h2>Data Protection</h2><p>Encrypt data at rest. Encrypt data in transit (TLS/SSL). Use provider-managed or customer-managed keys. Data classification policies. Sensitive data handling procedures. Regular backup encryption. Secure deletion processes.</p><h2>Network Security</h2><p>Virtual Private Cloud (VPC) isolation. Security groups and network ACLs. VPN connections. DDoS protection. Web Application Firewalls (WAF). API rate limiting. Network monitoring.</p><h2>Compliance and Governance</h2><p>Maintain compliance documentation. Regular compliance audits. Vendor assessment procedures. Data residency requirements. Audit logging enabled. Regular security patches. Configuration management.</p>`,
        trending: false
      },
      {
        id: 12,
        title: 'Social Engineering Attacks',
        author: 'Security Expert',
        date: 'Oct 23, 2025',
        category: 'Security Tips',
        excerpt: 'Learn to recognize and defend against social engineering tactics used by cybercriminals and attackers...',
        icon: '👁️',
        views: 4620,
        shares: 387,
        readTime: '6 min',
        content: `<h2>Understanding Social Engineering</h2><p>Social engineering manipulates human psychology to gain unauthorized access. Exploits trust rather than technical vulnerabilities. Often precedes other attacks. Success rates high due to human nature. Range from simple pretexting to sophisticated campaigns. Humans are the weakest link in security.</p><h2>Common Tactics</h2><p>Phishing: Fraudulent emails appearing legitimate. Pretexting: Creating false scenarios to gain trust. Baiting: Offering something enticing to trigger action. Tailgating: Following authorized personnel into restricted areas. Shoulder surfing: Observing someone entering credentials. Dumpster diving: Searching trash for sensitive information.</p><h2>Recognizing Attempts</h2><p>Verify sender identity independently. Check for spelling/grammar errors. Suspicious links and attachments. Unexpected requests for information. Urgency or pressure language. Requests for passwords or sensitive data. Too-good-to-be-true offers.</p><h2>Personal Defense</h2><p>Never share passwords. Be skeptical of requests. Verify through official channels. Don't open suspicious attachments. Use strong authentication. Think before sharing personal information. Report suspicious activity immediately.</p><h2>Business Training</h2><p>Regular security awareness training. Simulated phishing campaigns. Report mechanism for employees. Leadership demonstrates best practices. Create security culture. Consequences for risky behavior. Positive reinforcement for vigilance.</p><h2>Physical Security</h2><p>Visitor badge systems. Secure entry/exit points. Desk clear of sensitive documents. Lock screens when away. Secure document shredding. Conference room privacy. Monitor unusual activity.</p>`,
        trending: true
      }
    ]

    const foundArticle = allArticles.find(a => a.id === parseInt(id))
    setArticle(foundArticle)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-white text-2xl">Article not found</div>
          <button
            onClick={() => navigate('/blog')}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Back to Blog
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="mb-6 inline-flex items-center text-blue-400 hover:text-blue-300 transition text-sm"
        >
          ← Back to Blog
        </button>

        {/* Article Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{article.icon}</span>
            <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded-full text-xs">
              {article.category}
            </span>
            {article.trending && (
              <span className="px-2 py-0.5 bg-orange-900/50 text-orange-300 rounded-full text-xs flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3" /> Trending
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{article.title}</h1>
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400">👤</span>
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400">📅</span>
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400">⏱️</span>
              <span>{article.readTime} read</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 py-3 border-t border-b border-slate-700 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400">👁️</span>
              <span className="text-white">{article.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400">📤</span>
              <span className="text-white">{article.shares} shares</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert max-w-none">
          <div
            className="text-slate-300 text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: article.content
                .replace(/<h2>/g, '<h2 class="text-xl font-bold text-white mt-6 mb-3">')
                .replace(/<h3>/g, '<h3 class="text-lg font-semibold text-blue-300 mt-4 mb-2">')
                .replace(/<p>/g, '<p class="text-slate-300 mb-3 leading-relaxed">')
            }}
          />
        </article>

        {/* Share Section */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h3 className="text-lg font-bold text-white mb-3">Share this article</h3>
          <div className="flex gap-3 flex-wrap">
            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition flex items-center gap-2">
              📘 Facebook
            </button>
            <button className="px-3 py-1.5 bg-blue-400 hover:bg-blue-500 text-white rounded text-sm transition flex items-center gap-2">
              𝕏 Twitter
            </button>
            <button className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-sm transition flex items-center gap-2">
              🔗 LinkedIn
            </button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">More Security Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: '10 Signs Your Password Has Been Compromised', cat: 'Security Tips', id: 1 },
              { title: 'Understanding Phishing Attacks', cat: 'Security Tips', id: 3 },
              { title: 'Two-Factor Authentication: Why It Matters', cat: 'Security Tips', id: 8 },
              { title: 'Social Engineering Attacks', cat: 'Security Tips', id: 12 }
            ].map(related => (
              <div
                key={related.id}
                onClick={() => navigate(`/blog/${related.id}`)}
                className="scroll-animate p-3 bg-slate-800/50 hover:bg-slate-800 rounded cursor-pointer transition border border-slate-700 hover:border-blue-500"
              >
                <div className="text-xs text-blue-400 mb-1.5">{related.cat}</div>
                <div className="font-semibold text-white hover:text-blue-400 transition text-sm">{related.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
