// controllers/passwordController.js
const crypto = require('crypto');
const axios = require('axios');
const ScanReport = require('../models/ScanReport');

/**
 * Check password against HaveIBeenPwned Pwned Passwords API
 * Uses k-anonymity model for privacy
 */
exports.checkPassword = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'No password provided' });

  try {
    // Generate SHA-1 hash of password
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);
    
    // Query HaveIBeenPwned API with k-anonymity
    const resp = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'User-Agent': 'HawkEye-SecurityScanner/1.0'
      },
      timeout: 10000
    });

    // Parse response and find matching suffix
    const lines = resp.data.split('\r\n');
    const foundLine = lines.find(line => line.split(':')[0] === suffix);
    const breachCount = foundLine ? parseInt(foundLine.split(':')[1]) : 0;

    // Determine verdict
    const verdict = breachCount > 0 ? 'malicious' : 'safe';
    const severity = breachCount === 0 
      ? 'low'
      : breachCount < 10
      ? 'medium'
      : breachCount < 100
      ? 'high'
      : 'critical';

    // Get userId from authenticated request
    const userId = req.user?.id || req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Save scan report
    await ScanReport.create({ 
      userId,
      type: 'password', 
      target: 'password-check', 
      result: { 
        breachCount,
        severity,
        passwordStrength: getPasswordStrength(password)
      }, 
      verdict 
    });

    res.json({ 
      breached: breachCount > 0, 
      breachCount,
      severity,
      verdict,
      message: breachCount > 0 
        ? `This password has been found in ${breachCount} data breaches. Do not use it!`
        : 'This password has not been found in any known data breaches.',
      recommendations: getPasswordRecommendations(password, breachCount)
    });
  } catch (err) {
    console.error('Password check error:', err);
    res.status(500).json({ error: 'Password check failed', details: err.message });
  }
};

/**
 * Check multiple passwords at once
 */
exports.checkMultiplePasswords = async (req, res) => {
  const { passwords } = req.body;
  
  if (!passwords || !Array.isArray(passwords) || passwords.length === 0) {
    return res.status(400).json({ error: 'No passwords provided' });
  }

  if (passwords.length > 50) {
    return res.status(400).json({ error: 'Maximum 50 passwords per request' });
  }

  try {
    const userId = req.user?.id || req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const results = [];

    for (const password of passwords) {
      try {
        const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
        const prefix = sha1.slice(0, 5);
        const suffix = sha1.slice(5);
        
        const resp = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
          headers: { 'User-Agent': 'HawkEye-SecurityScanner/1.0' },
          timeout: 10000
        });

        const lines = resp.data.split('\r\n');
        const foundLine = lines.find(line => line.split(':')[0] === suffix);
        const breachCount = foundLine ? parseInt(foundLine.split(':')[1]) : 0;

        results.push({
          password: maskPassword(password),
          breached: breachCount > 0,
          breachCount,
          severity: getSeverity(breachCount),
          verdict: breachCount > 0 ? 'malicious' : 'safe'
        });
      } catch (err) {
        console.error(`Error checking password:`, err);
        results.push({
          password: maskPassword(password),
          error: 'Failed to check password',
          verdict: 'unknown'
        });
      }
    }

    // Save bulk scan
    await ScanReport.create({
      userId,
      type: 'password',
      target: 'bulk-password-check',
      result: {
        total: passwords.length,
        breached: results.filter(r => r.breached).length,
        safe: results.filter(r => !r.breached && !r.error).length,
        results
      },
      verdict: results.some(r => r.breached) ? 'malicious' : 'safe'
    });

    res.json({
      total: passwords.length,
      breached: results.filter(r => r.breached).length,
      safe: results.filter(r => !r.breached && !r.error).length,
      results
    });
  } catch (err) {
    console.error('Bulk password check error:', err);
    res.status(500).json({ error: 'Bulk password check failed' });
  }
};

/**
 * Get breach details (requires premium API key from HaveIBeenPwned)
 */
exports.getBreachDetails = async (req, res) => {
  try {
    // This requires HIBP premium account
    // For now, return general information
    res.json({
      message: 'Breach details API requires premium HaveIBeenPwned account',
      info: 'You can check individual breaches at https://haveibeenpwned.com/PwnedWebsites'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get breach details' });
  }
};

/**
 * Helper: Calculate password strength
 */
function getPasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (password.length >= 16) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  if (strength <= 6) return 'strong';
  return 'very-strong';
}

/**
 * Helper: Get severity based on breach count
 */
function getSeverity(count) {
  if (count === 0) return 'low';
  if (count < 10) return 'medium';
  if (count < 100) return 'high';
  return 'critical';
}

/**
 * Helper: Get recommendations
 */
function getPasswordRecommendations(password, breachCount) {
  const recommendations = [];

  if (breachCount > 0) {
    recommendations.push('❌ Do not use this password - it has been compromised');
    recommendations.push('Create a new unique password for each account');
  }

  const strength = getPasswordStrength(password);
  if (strength === 'weak') {
    recommendations.push('Use a longer password (12+ characters recommended)');
    recommendations.push('Include uppercase, lowercase, numbers, and symbols');
  }

  if (!/[A-Z]/.test(password)) {
    recommendations.push('Add uppercase letters (A-Z)');
  }
  if (!/[0-9]/.test(password)) {
    recommendations.push('Add numbers (0-9)');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    recommendations.push('Add special characters (!@#$%^&*)');
  }

  if (recommendations.length === 0) {
    recommendations.push('✓ This is a strong password that has not been compromised');
  }

  return recommendations;
}

/**
 * Helper: Mask password in responses
 */
function maskPassword(password) {
  if (password.length <= 3) return '*'.repeat(password.length);
  return password.charAt(0) + '*'.repeat(password.length - 2) + password.charAt(password.length - 1);
}

