// scan_all_uploads.js
// Scans all files in ../uploads using existing utilities (hashFile + virusTotal)
// Saves results to MongoDB (ScanReport) if MONGO_URI is set, otherwise writes reports to ./scan_reports.json

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const computeFileHash = require('../utils/hashFile');
const vt = require('../utils/virusTotal');
const ScanReport = require('../models/ScanReport');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const REPORTS_OUT = path.join(__dirname, 'scan_reports.json');

function parseVtFileVerdict(vtData) {
  try {
    const stats = vtData?.data?.attributes?.last_analysis_stats;
    if (!stats) return 'unknown';
    if (stats.malicious > 0) return 'malicious';
    if (stats.suspicious > 0) return 'suspicious';
    return 'safe';
  } catch (e) {
    console.error('Error parsing VT file verdict:', e);
    return 'unknown';
  }
}

async function pollVtFileAnalysis(id, maxRetries = 36, delay = 5000) {
  for (let i = 0; i < maxRetries; i++) {
    const analysis = await vt.getAnalysis(id);
    if (!analysis) return null; // API error or not found
    if (analysis?.data?.attributes?.status === 'completed') return analysis;
    // wait
    await new Promise((r) => setTimeout(r, delay));
  }
  return null;
}

async function scanSingle(filePath) {
  const fileName = path.basename(filePath);
  console.log(`Scanning: ${fileName}`);
  const hash = await computeFileHash(filePath);

  // Try lookup by hash first
  let vtResult = await vt.lookupHash(hash);

  if (!vtResult) {
    console.log(`No existing VT report for ${fileName} (hash: ${hash}), uploading...`);
    const uploadRes = await vt.uploadFile(filePath);
    // extract analysis id if available
    const analysisId = uploadRes?.data?.id || uploadRes?.data?.sha256;
    if (analysisId) {
      console.log(`Polling analysis for ${fileName} id=${analysisId} ...`);
      vtResult = await pollVtFileAnalysis(analysisId);
    } else {
      // upload returned null or no id
      vtResult = uploadRes;
    }
  } else {
    console.log(`Found VT report for ${fileName}`);
  }

  const verdict = parseVtFileVerdict(vtResult);

  const report = {
    type: 'file',
    target: fileName,
    hash,
    verdict,
    result: vtResult,
    createdAt: new Date()
  };

  return report;
}

async function main() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error('Uploads directory does not exist:', UPLOADS_DIR);
    process.exit(1);
  }

  if (!process.env.VT_API_KEY) {
    console.error('VT_API_KEY is not set. Set it in the environment to use VirusTotal.');
    process.exit(1);
  }

  const files = fs.readdirSync(UPLOADS_DIR).filter(f => fs.lstatSync(path.join(UPLOADS_DIR, f)).isFile());
  if (!files.length) {
    console.log('No files found in uploads directory. Nothing to scan.');
    process.exit(0);
  }

  let dbConnected = false;
  const reports = [];

  // Try connect to MongoDB if MONGO_URI is set
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      dbConnected = true;
      console.log('Connected to MongoDB');
    } catch (e) {
      console.warn('Could not connect to MongoDB, will fall back to JSON output:', e.message);
      dbConnected = false;
    }
  } else {
    console.log('MONGO_URI not set; results will be written to', REPORTS_OUT);
  }

  for (const f of files) {
    const filePath = path.join(UPLOADS_DIR, f);
    try {
      const report = await scanSingle(filePath);

      if (dbConnected) {
        // userId unknown in a bulk script
        await ScanReport.create({ userId: null, ...report });
        console.log(`Saved report to DB for ${f}: ${report.verdict}`);
      } else {
        reports.push(report);
        console.log(`Captured report for ${f}: ${report.verdict}`);
      }

      // Respect VT rate limits: small delay between files
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(`Error scanning ${f}:`, e.message || e);
    }
  }

  if (!dbConnected) {
    try {
      fs.writeFileSync(REPORTS_OUT, JSON.stringify(reports, null, 2));
      console.log('Written reports to', REPORTS_OUT);
    } catch (e) {
      console.error('Failed to write reports file:', e.message);
    }
  } else {
    await mongoose.connection.close();
    console.log('Closed MongoDB connection');
  }

  console.log('Done scanning uploads.');
}

main().catch(e => {
  console.error('Fatal error in scan_all_uploads:', e);
  process.exit(1);
});
