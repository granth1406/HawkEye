const express = require("express");
const { scanFile } = require("../controllers/scanController.js");
const { verifyToken } = require("../middleware/auth.js");
const multer = require("multer");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Correct handlers (functions, not calls)
router.post("/file", verifyToken, upload.single("file"), scanFile);

module.exports = router;
