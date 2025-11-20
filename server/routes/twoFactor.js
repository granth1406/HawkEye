// server/routes/twoFactor.js
const express = require('express');
const router = express.Router();
const twoFactorController = require('../controllers/twoFactorController');
const { verifyToken } = require('../middleware/auth');

/**
 * Initialize 2FA setup (GET QR code and backup codes)
 * POST /api/2fa/initiate
 */
router.post('/initiate', verifyToken, twoFactorController.initiate2FA);

/**
 * Verify and enable 2FA
 * POST /api/2fa/verify
 */
router.post('/verify', verifyToken, twoFactorController.verify2FA);

/**
 * Verify 2FA token during login
 * POST /api/2fa/verify-login
 */
router.post('/verify-login', twoFactorController.verify2FALogin);

/**
 * Get 2FA status
 * GET /api/2fa/status
 */
router.get('/status', verifyToken, twoFactorController.get2FAStatus);

/**
 * Disable 2FA
 * POST /api/2fa/disable
 */
router.post('/disable', verifyToken, twoFactorController.disable2FA);

/**
 * Regenerate backup codes
 * POST /api/2fa/regenerate-codes
 */
router.post('/regenerate-codes', verifyToken, twoFactorController.regenerateBackupCodes);

module.exports = router;
