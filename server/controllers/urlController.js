const axios = require("axios");
const ScanReport = require("../models/ScanReport");

const scanUrl = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Validate URL format
  const isValidUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "URL is incorrect. Please provide a valid URL (e.g., https://example.com)" });
  }

  try {
    // ---- Google Safe Browsing ----
    const safeBrowsingRes = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_API_KEY}`,
      {
        client: {
          clientId: "HawkEye",
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }
    );

    const isSafeBrowsingThreat =
      safeBrowsingRes.data &&
      safeBrowsingRes.data.matches &&
      safeBrowsingRes.data.matches.length > 0;

    // ---- VirusTotal ----
    const { URLSearchParams } = require("url");
    const virusTotalRes = await axios.post(
      "https://www.virustotal.com/api/v3/urls",
      new URLSearchParams({ url }),
      {
        headers: {
          "x-apikey": process.env.VT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const analysisId = virusTotalRes.data.data.id;
    const analysisResult = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: { "x-apikey": process.env.VT_API_KEY },
      }
    );

    const vtStats = analysisResult.data.data.attributes.stats;
    const maliciousCount = vtStats.malicious || 0;

    let verdict = "safe";
    if (isSafeBrowsingThreat || maliciousCount > 0) {
      verdict = "malicious";
    } else if (vtStats.suspicious > 0) {
      verdict = "suspicious";
    }

    // Save report to database
    const doc = await ScanReport.create({
      userId: req.user?.id || req.userId,
      type: "url",
      target: url,
      result: {
        safeBrowsing: safeBrowsingRes.data,
        virusTotal: analysisResult.data,
      },
      verdict,
    });

    res.json({
      id: doc._id,
      verdict,
      safeBrowsing: isSafeBrowsingThreat ? "threat-found" : "clean",
      virusTotal: maliciousCount > 0 ? `${maliciousCount} detections` : "clean",
    });
  } catch (error) {
    console.error("URL scan error:", error.response?.data || error.message);
    res.status(500).json({ error: "Error scanning URL" });
  }
};

module.exports = { scanUrl };
