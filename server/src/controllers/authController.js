<<<<<<< Updated upstream:server/routes/auth.js
const express = require('express');
const router = express.Router();
const { User } = require('../sequelize');

router.post('/signup', async (req, res) => {
=======
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/authMiddleware");
const authService = require("../services/authService");

// Signup controller
const signup = async (req, res) => {
>>>>>>> Stashed changes:server/src/controllers/authController.js
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
<<<<<<< Updated upstream:server/routes/auth.js
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    await User.create({ username, password });
    return res.json({ message: 'Signup successful' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
=======
    const result = await authService.createUser(username, password);
    return res.json({ message: "Signup successful. Please sign in." });
  } catch (err) {
    console.error(err);
    if (err.message === "Username already exists") {
      return res.status(409).json({ error: "Username already exists" });
    }
    return res.status(500).json({ error: "Server error" });
>>>>>>> Stashed changes:server/src/controllers/authController.js
  }
};

<<<<<<< Updated upstream:server/routes/auth.js
module.exports = router; 
=======
// Signin controller
const signin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const result = await authService.authenticateUser(username, password);

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.user.id, username: result.user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Signin successful",
      token,
      user: {
        id: result.user.id,
        username: result.user.username,
      },
    });
  } catch (err) {
    console.error(err);
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// Get current user info controller
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  signup,
  signin,
  getCurrentUser,
};
>>>>>>> Stashed changes:server/src/controllers/authController.js
