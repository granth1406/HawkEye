// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const emailController = require('../controllers/emailController');
const mongoose = require('mongoose');
const ScanReport = require('../models/ScanReport');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.post('/check-email-breach', verifyToken, emailController.checkEmailBreach);
router.get('/email-history', verifyToken, emailController.getEmailCheckHistory);

// Get user statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    
    // Get all scans for this user
    const scans = await ScanReport.find({ userId });
    
    // Calculate stats
    const fileScan = scans.filter(s => s.type === 'file').length;
    const urlScan = scans.filter(s => s.type === 'url').length;
    const passwordCheck = scans.filter(s => s.type === 'password').length;
    
    const threatsDetected = scans.filter(s => s.verdict === 'malicious' || s.verdict === 'suspicious').length;
    const cleanScans = scans.filter(s => s.verdict === 'safe' || s.verdict === 'unknown').length;
    
    // Get last scan
    const lastScan = scans.length > 0 ? scans[scans.length - 1].createdAt : null;
    
    // Prepare history with limit
    const history = scans.map(s => {
      const scanDate = new Date(s.createdAt);
      const now = new Date();
      const diffMs = now - scanDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      let timeDisplay;
      if (diffMins < 1) timeDisplay = 'Just now';
      else if (diffMins < 60) timeDisplay = `${diffMins}m ago`;
      else if (diffHours < 24) timeDisplay = `${diffHours}h ago`;
      else if (diffDays < 7) timeDisplay = `${diffDays}d ago`;
      else timeDisplay = scanDate.toLocaleDateString();
      
      return {
        id: s._id,
        type: s.type === 'file' ? 'File' : s.type === 'url' ? 'URL' : 'Password',
        name: s.target.length > 50 ? s.target.substring(0, 50) + '...' : s.target,
        status: s.verdict === 'safe' ? 'Clean' : s.verdict === 'unknown' ? 'Safe' : s.verdict === 'malicious' ? 'Malicious' : 'Suspicious',
        threats: s.verdict === 'malicious' ? 3 : s.verdict === 'suspicious' ? 1 : 0,
        time: timeDisplay
      };
    }).reverse().slice(0, 10);
    
    res.json({
      filesScanned: fileScan,
      urlsScanned: urlScan,
      passwordsChecked: passwordCheck,
      threatsDetected,
      cleanScans,
      totalScans: scans.length,
      history,
      chartData: generateChartData(scans)
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Generate weekly chart data
function generateChartData(scans) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Initialize with zeros
  const chartData = days.map(day => ({
    day,
    files: 0,
    urls: 0,
    passwords: 0
  }));
  
  // Group actual scans by day
  scans.forEach(scan => {
    const scanDate = new Date(scan.createdAt);
    const dayOfWeek = scanDate.getDay();
    // Convert JS getDay (0=Sunday) to our array index (0=Monday)
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    if (dayIndex >= 0 && dayIndex < 7) {
      if (scan.type === 'file') chartData[dayIndex].files += 1;
      else if (scan.type === 'url') chartData[dayIndex].urls += 1;
      else if (scan.type === 'password') chartData[dayIndex].passwords += 1;
    }
  });
  
  return chartData;
}

module.exports = router;
