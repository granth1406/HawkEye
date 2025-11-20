const express = require("express");
const { verifyToken } = require("../middleware/auth.js");
const { scanUrl } = require("../controllers/urlController.js");

const router = express.Router();

router.post("/scan", verifyToken, scanUrl);


module.exports = router;
