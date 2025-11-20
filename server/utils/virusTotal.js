// utils/virusTotal.js
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { URLSearchParams } = require('url');

const API = 'https://www.virustotal.com/api/v3';
const key = process.env.VT_API_KEY;

// Check for missing API Key at startup
if (!key) {
    console.error("FATAL: VT_API_KEY is not set in environment variables! VirusTotal features will fail.");
}

/**
 * Generic axios request wrapper to handle common VirusTotal API errors.
 * Logs errors (except 404) and returns null on any failure.
 */
async function vtRequest(method, endpoint, config = {}) {
    try {
        const url = `${API}${endpoint}`;
        const defaultHeaders = { 'x-apikey': key };
        
        // Ensure the API key is always included
        const headers = { ...defaultHeaders, ...config.headers };

        // Set default timeout if not specified
        const timeout = config.timeout || 15000; // 15 second timeout

        const res = await axios({
            method,
            url,
            timeout,
            ...config,
            headers: headers,
        });
        return res.data;
    } catch (e) {
        // Log all non-404 errors for debugging
        if (e.code === 'ECONNABORTED') {
            console.error(`[VirusTotal API Timeout] ${e.config.url}: Request timed out after ${e.config.timeout}ms`);
        } else if (e.response && e.response.status !== 404) {
            console.error(`[VirusTotal API Error ${e.response.status}] ${e.config.url}:`, e.response.data?.error || e.message);
        } else if (!e.response) {
            console.error('[VirusTotal Network Error]:', e.message);
        }
        
        // Return null for 404 (Not Found) or any other API error
        return null; 
    }
}

/**
 * Look up a file hash (SHA256, SHA1, or MD5) in VirusTotal.
 */
async function lookupHash(hash) {
    // If the hash is not found, vtRequest will return null
    return vtRequest('get', `/files/${hash}`);
}

/**
 * Upload a file to VirusTotal for analysis.
 */
async function uploadFile(filePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    return vtRequest('post', `/files`, {
        data: form,
        // The form boundary must be included in the headers
        headers: { ...form.getHeaders() },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    });
}

/**
 * Submit a URL for scanning/re-scanning (returns analysis ID or object).
 */
async function submitUrl(url) {
    const params = new URLSearchParams();
    params.append('url', url);
    
    return vtRequest('post', `/urls`, {
        data: params.toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
}

/**
 * Get the analysis report for a given analysis ID.
 */
async function getAnalysis(analysisIdOrResource) {
    return vtRequest('get', `/analyses/${analysisIdOrResource}`);
}

module.exports = { lookupHash, uploadFile, submitUrl, getAnalysis };