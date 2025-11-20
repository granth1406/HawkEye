const express = require("express");
const { verifyToken } = require("../middleware/auth.js");
const { checkPassword, checkMultiplePasswords, getBreachDetails } = require("../controllers/passwordController.js");

const router = express.Router();

// Single password check
router.post("/check", verifyToken, checkPassword);

// Bulk password check (up to 50 passwords)
router.post("/check-multiple", verifyToken, checkMultiplePasswords);

// Get breach details (HaveIBeenPwned database info)
router.get("/breach-details", verifyToken, getBreachDetails);

module.exports = router;