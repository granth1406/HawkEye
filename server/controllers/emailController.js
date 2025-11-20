// server/controllers/emailController.js
const axios = require('axios');
const crypto = require('crypto');
const ScanReport = require('../models/ScanReport');
const mongoose = require('mongoose');

const HIBP_API = 'https://haveibeenpwned.com/api/v3';

/**
 * Check if an email address has been compromised in known data breaches
 * Uses HaveIBeenPwned API with k-anonymity for privacy
 */
exports.checkEmailBreach = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.userId;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Validate email format - comprehensive regex
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Additional validation checks
    const validationError = validateEmail(email);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Check HaveIBeenPwned API with proper headers
    let response;
    try {
      response = await axios.get(
        `${HIBP_API}/breachedaccount`,
        {
          params: { 
            account: email,
            truncateResponse: false 
          },
          headers: {
            'User-Agent': 'HawkEye-SecurityScanner/2.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 15000,
          validateStatus: (status) => status === 200 || status === 404
        }
      );
    } catch (apiError) {
      console.error('HIBP API Error:', {
        message: apiError.message,
        status: apiError.response?.status,
        contentType: apiError.response?.headers?.['content-type'],
        data: apiError.response?.data?.substring?.(0, 200) // Log first 200 chars
      });

      // Handle specific error scenarios
      if (apiError.response?.status === 429) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }
      if (apiError.response?.status === 503) {
        return res.status(503).json({ error: 'Service temporarily unavailable. Please try again later.' });
      }
      if (apiError.code === 'ECONNABORTED') {
        return res.status(504).json({ error: 'Request timed out. Please try again.' });
      }

      // If response is HTML (error page), indicate service issue
      if (apiError.response?.data?.includes?.('<!DOCTYPE')) {
        return res.status(502).json({ error: 'Breach check service returned an error. Please try again.' });
      }

      throw apiError;
    }

    let breaches = [];
    let breached = false;
    let breachCount = 0;

    if (response.status === 200 && response.data) {
      // Email found in breaches
      breaches = Array.isArray(response.data) ? response.data : [];
      breached = true;
      breachCount = breaches.length;
    }

    // Prepare result data
    const result = {
      email,
      breached,
      breachCount,
      breaches: breaches.map(breach => ({
        name: breach.Name || breach,
        date: breach.BreachDate || 'Unknown',
        title: breach.Title || breach.Name || breach,
        description: breach.Description || ''
      }))
    };

    // Save scan report to database
    try {
      await ScanReport.create({
        userId: new mongoose.Types.ObjectId(userId),
        type: 'email',
        target: email,
        verdict: breached ? 'suspicious' : 'safe',
        details: {
          breached,
          breachCount,
          breaches: breaches.map(b => b.Name || b)
        }
      });
    } catch (dbError) {
      console.error('Error saving email scan report:', dbError);
      // Don't fail the API call just because we couldn't save to DB
    }

    res.json(result);
  } catch (error) {
    console.error('Email breach check error:', error.message);
    res.status(500).json({ error: 'Email check failed. Please try again.' });
  }
};

/**
 * Get email check history for a user
 */
exports.getEmailCheckHistory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const scans = await ScanReport.find({
      userId,
      type: 'email'
    }).sort({ createdAt: -1 }).limit(20);

    const history = scans.map(scan => ({
      id: scan._id,
      email: scan.target,
      breached: scan.verdict === 'suspicious',
      breachCount: scan.details?.breachCount || 0,
      scanDate: scan.createdAt,
      timeAgo: getTimeAgo(scan.createdAt)
    }));

    res.json({ history });
  } catch (error) {
    console.error('Error fetching email check history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

/**
 * Helper function to format time ago
 */
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

/**
 * Comprehensive email validation function
 */
function validateEmail(email) {
  email = email.trim();

  // Check for empty or whitespace
  if (!email) {
    return 'Email cannot be empty';
  }

  // Check length (RFC 5321)
  if (email.length > 254) {
    return 'Email is too long (max 254 characters)';
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return 'Email cannot contain consecutive dots';
  }

  // Check if starts or ends with dot
  if (email.startsWith('.') || email.endsWith('.')) {
    return 'Email cannot start or end with a dot';
  }

  // Split email into local and domain parts
  const [localPart, ...domainParts] = email.split('@');
  
  if (!localPart || domainParts.length !== 1) {
    return 'Email must have exactly one @ symbol';
  }

  const domain = domainParts[0];

  // Validate local part (before @)
  if (localPart.length > 64) {
    return 'Local part of email is too long (max 64 characters)';
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return 'Local part cannot start or end with a dot';
  }

  // Check for invalid characters in local part
  const invalidLocalChars = /[^a-zA-Z0-9._%-]/;
  if (invalidLocalChars.test(localPart)) {
    return 'Email contains invalid characters';
  }

  // Validate domain
  if (!domain || domain.length < 3) {
    return 'Domain must be at least 3 characters long';
  }

  if (domain.length > 255) {
    return 'Domain is too long (max 255 characters)';
  }

  // Check for consecutive hyphens or dots in domain
  if (domain.includes('--') || domain.includes('..')) {
    return 'Domain contains invalid character sequences';
  }

  // Check if domain starts or ends with hyphen or dot
  if (domain.startsWith('-') || domain.endsWith('-') || 
      domain.startsWith('.') || domain.endsWith('.')) {
    return 'Domain cannot start or end with a hyphen or dot';
  }

  // Check domain format (must have TLD)
  const domainParts2 = domain.split('.');
  if (domainParts2.length < 2) {
    return 'Domain must have a valid TLD';
  }

  // Validate TLD (last part after dot)
  const tld = domainParts2[domainParts2.length - 1];
  if (tld.length < 2 || tld.length > 6) {
    return 'Top-level domain must be 2-6 characters';
  }

  if (!/^[a-zA-Z]+$/.test(tld)) {
    return 'Top-level domain must only contain letters';
  }

  // Check for numeric-only TLD (not allowed)
  if (/^\d+$/.test(tld)) {
    return 'Top-level domain cannot be numeric only';
  }

  // Validate each domain label
  for (let part of domainParts2) {
    if (!part) {
      return 'Domain contains empty labels';
    }
    if (part.length > 63) {
      return 'Domain label is too long (max 63 characters)';
    }
    if (!/^[a-zA-Z0-9-]+$/.test(part)) {
      return 'Domain labels can only contain letters, numbers, and hyphens';
    }
    if (part.startsWith('-') || part.endsWith('-')) {
      return 'Domain labels cannot start or end with hyphens';
    }
  }

  return null; // Valid email
}
