// scanController.js
const fs = require('fs');
const computeFileHash = require('../utils/hashFile');
const vt = require('../utils/virusTotal');
const ScanReport = require('../models/ScanReport'); // Assuming this model is correct

/**
 * Parses the VirusTotal file analysis report to determine a simple verdict.
 */
function parseVtFileVerdict(vtData) {
    try {
        // The API response is nested under data.attributes.last_analysis_stats
        const stats = vtData?.data?.attributes?.last_analysis_stats;
        if (!stats) return 'unknown';

        if (stats.malicious > 0) return 'malicious';
        if (stats.suspicious > 0) return 'suspicious';
        
        // If safe, return a good verdict
        return 'safe';
    } catch (e) {
        console.error("Error parsing VT file verdict:", e);
        return 'unknown';
    }
}

/**
 * Polls the VirusTotal analysis endpoint until the report is completed or max retries are reached.
 */
async function pollVtFileAnalysis(id, maxRetries = 36, delay = 5000) {
    for (let i = 0; i < maxRetries; i++) {
        const analysis = await vt.getAnalysis(id);
        
        // Return analysis if status is completed
        if (analysis?.data?.attributes?.status === 'completed') return analysis;
        
        // If analysis is null, something went wrong (e.g., API key, rate limit), stop polling.
        if (!analysis) return null; 

        await new Promise(r => setTimeout(r, delay));
    }
    // Return null if analysis timed out
    return null; 
}

/**
 * Main handler for scanning an uploaded file.
 */
const scanFile = async (req, res) => {
    // req.file is populated by a middleware like 'multer'
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    console.log(`[SCAN] Starting file scan: ${req.file.originalname}`);
    
    try {
        // 1️⃣ Compute file hash
        console.log(`[SCAN] Computing hash for file...`);
        const hash = await computeFileHash(filePath);
        console.log(`[SCAN] File hash (SHA256): ${hash}`);

        let vtResult = null;
        let analysisId = null;

        // 2️⃣ Lookup by hash first (fastest)
        console.log(`[SCAN] Looking up hash in VirusTotal cache...`);
        vtResult = await vt.lookupHash(hash);
        
        if (vtResult) {
            console.log(`[SCAN] ✅ Hash found in cache`);
        } else {
            console.log(`[SCAN] Hash not in cache, uploading file to VirusTotal...`);
            const uploadRes = await vt.uploadFile(filePath);
            
            // FIX: Check if upload was successful before trying to poll
            if (uploadRes) {
                console.log(`[SCAN] ✅ File uploaded successfully`);
                // Analysis ID can be under 'data.id' depending on the VT API response
                analysisId = uploadRes?.data?.id || uploadRes?.id; 
                console.log(`[SCAN] Analysis ID: ${analysisId}`);
            } else {
                console.log(`[SCAN] ❌ File upload failed, using null result`);
            }
            
            if (analysisId) {
                // Poll only if a valid analysisId was obtained
                console.log(`[SCAN] Polling VirusTotal for analysis results...`);
                vtResult = await pollVtFileAnalysis(analysisId);
                if (vtResult) {
                    console.log(`[SCAN] ✅ Analysis complete`);
                } else {
                    console.log(`[SCAN] ⚠️  Analysis polling timed out`);
                }
            } else {
                // If upload failed or no ID was returned, use the failed response object/null
                vtResult = uploadRes; 
            }
        }

        const verdict = parseVtFileVerdict(vtResult);
        console.log(`[SCAN] Verdict: ${verdict}`);

        // 3️⃣ Save report and respond
        console.log(`[SCAN] Saving scan report to database...`);
        const doc = await ScanReport.create({
            userId: req.user?.id || req.userId,
            type: 'file',
            target: req.file.originalname,
            hash,
            result: vtResult,
            verdict
        });

        // Clean up the temporary file
        fs.unlinkSync(filePath);
        console.log(`[SCAN] ✅ Scan completed successfully`);

        res.json({ id: doc._id, verdict, result: vtResult, hash });

    } catch (err) {
        console.error("[SCAN] ❌ Error during file scan:", err.message);
        // Ensure file is deleted even if error occurs
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 
        res.status(500).json({ error: 'File scan failed', details: err.message });
    }
};

module.exports = { scanFile };