const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-me';

/**
 * Generate TOTP secret and QR code
 */
async function generateTwoFactorSecret(userEmail) {
  const secret = speakeasy.generateSecret({
    name: `HawkEye (${userEmail})`,
    issuer: 'HawkEye Security',
    length: 32
  });

  // Generate QR code as data URL
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    qrCode: qrCode,
    backupCodes: generateBackupCodes()
  };
}

/**
 * Verify TOTP token
 */
function verifyTOTPToken(secret, token) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time windows (±30 seconds) for clock skew
  });
}

/**
 * Encrypt sensitive data (secret, backup codes)
 */
function encryptData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    iv
  );
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt sensitive data
 */
function decryptData(encryptedData) {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    iv
  );
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generate backup codes (10 codes, 8 characters each)
 */
function generateBackupCodes() {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }
  return codes;
}

/**
 * Verify and consume backup code
 */
function verifyAndConsumeBackupCode(backupCodes, code) {
  const index = backupCodes.findIndex(bc => bc === code);
  if (index !== -1) {
    backupCodes.splice(index, 1);
    return true;
  }
  return false;
}

module.exports = {
  generateTwoFactorSecret,
  verifyTOTPToken,
  encryptData,
  decryptData,
  generateBackupCodes,
  verifyAndConsumeBackupCode
};
