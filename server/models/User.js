const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, default: null }, 
  googleId: { type: String, default: null }, 
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  
  // 2FA Fields
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: null }, // encrypted TOTP secret
  twoFactorBackupCodes: [{ type: String }], // encrypted backup codes
  twoFactorVerified: { type: Boolean, default: false }, // has user verified 2FA setup
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

