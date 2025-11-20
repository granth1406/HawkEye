require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());


// routes
const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan.js'); 
const urlRoutes = require('./routes/url');
const passwordRoutes = require('./routes/password');
const twoFactorRoutes = require('./routes/twoFactor');


// basic rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
});
app.use(limiter);

// static uploads (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/2fa', twoFactorRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// connect db and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`HawkEye server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB connection error:', err));
