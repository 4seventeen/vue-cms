const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

// Signup endpoint
router.post("/signup", authController.signup);

// Signin endpoint
router.post("/signin", authController.signin);

// Get current user info (protected route)
router.get("/me", authMiddleware, authController.getCurrentUser);

module.exports = router;
