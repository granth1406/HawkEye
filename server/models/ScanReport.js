const mongoose = require('mongoose');

const ScanReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['file', 'url', 'password'], required: true },
    target: { type: String, required: true },
    hash: { type: String },
    result: { type: Object },
    verdict: { type: String, enum: ['safe','suspicious','malicious','unknown'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScanReport', ScanReportSchema);