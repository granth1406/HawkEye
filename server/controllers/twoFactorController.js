// server/controllers/twoFactorController.js
const User = require('../models/User');
const {
  generateTwoFactorSecret,
  verifyTOTPToken,
  encryptData,
  decryptData,
  verifyAndConsumeBackupCode
} = require('../utils/twoFactorAuth');

/**
 * Initialize 2FA setup - generates secret and QR code
 */
exports.initiate2FA = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is already enabled for this account' });
    }

    // Generate new 2FA secret and backup codes
    const { secret, qrCode, backupCodes } = await generateTwoFactorSecret(user.email);

    // Store temporarily (don't enable yet - user must verify)
    // In production, store in Redis cache with TTL
    const tempSecret = {
      secret,
      backupCodes,
      timestamp: Date.now()
    };

    res.json({
      qrCode,
      backupCodes,
      message: 'Scan the QR code with your authenticator app, then verify the code to enable 2FA'
    });
  } catch (err) {
    console.error('2FA initiation error:', err);
    res.status(500).json({ error: 'Failed to initiate 2FA' });
  }
};

/**
 * Verify and enable 2FA
 */
exports.verify2FA = async (req, res) => {
  try {
    const userId = req.user.id;
    const { token, backupCodes } = req.body;

    if (!token || !backupCodes || !Array.isArray(backupCodes)) {
      return res.status(400).json({ error: 'Token and backup codes are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is already enabled' });
    }

    // Get the temporary secret (in production, from Redis)
    const { secret, qrCode, backupCodes: newBackupCodes } = await generateTwoFactorSecret(user.email);

    // Verify the token against the secret
    const isValidToken = verifyTOTPToken(secret, token);
    if (!isValidToken) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Encrypt and save the secret and backup codes
    user.twoFactorSecret = encryptData(secret);
    user.twoFactorBackupCodes = backupCodes.map(code => encryptData(code));
    user.twoFactorEnabled = true;
    user.twoFactorVerified = true;

    await user.save();

    res.json({
      message: '2FA enabled successfully',
      backupCodes: backupCodes
    });
  } catch (err) {
    console.error('2FA verification error:', err);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
};

/**
 * Disable 2FA
 */
exports.disable2FA = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to disable 2FA' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.twoFactorBackupCodes = [];
    user.twoFactorVerified = false;

    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (err) {
    console.error('2FA disable error:', err);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
};

/**
 * Verify 2FA token during login
 */
exports.verify2FALogin = async (req, res) => {
  try {
    const { userId, token, useBackupCode } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ error: 'User ID and token are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is not enabled for this user' });
    }

    let isValid = false;

    if (useBackupCode) {
      // Verify backup code
      const decryptedBackupCodes = user.twoFactorBackupCodes.map(code => decryptData(code));
      isValid = verifyAndConsumeBackupCode(decryptedBackupCodes, token);

      if (isValid) {
        // Update backup codes (one was consumed)
        user.twoFactorBackupCodes = decryptedBackupCodes.map(code => encryptData(code));
        await user.save();
      }
    } else {
      // Verify TOTP token
      const decryptedSecret = decryptData(user.twoFactorSecret);
      isValid = verifyTOTPToken(decryptedSecret, token);
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const authToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: authToken,
      user: { id: user._id, name: user.name, email: user.email },
      message: '2FA verification successful'
    });
  } catch (err) {
    console.error('2FA login verification error:', err);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
};

/**
 * Get 2FA status
 */
exports.get2FAStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      twoFactorEnabled: user.twoFactorEnabled,
      twoFactorVerified: user.twoFactorVerified,
      backupCodesRemaining: user.twoFactorBackupCodes.length
    });
  } catch (err) {
    console.error('Get 2FA status error:', err);
    res.status(500).json({ error: 'Failed to get 2FA status' });
  }
};

/**
 * Regenerate backup codes
 */
exports.regenerateBackupCodes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is not enabled' });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate new backup codes
    const { generateBackupCodes } = require('../utils/twoFactorAuth');
    const newBackupCodes = generateBackupCodes();

    // Encrypt and save
    user.twoFactorBackupCodes = newBackupCodes.map(code => encryptData(code));
    await user.save();

    res.json({
      backupCodes: newBackupCodes,
      message: 'Backup codes regenerated successfully'
    });
  } catch (err) {
    console.error('Regenerate backup codes error:', err);
    res.status(500).json({ error: 'Failed to regenerate backup codes' });
  }
};
