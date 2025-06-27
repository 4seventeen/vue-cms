const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/authMiddleware");
const authService = require("../services/authService");

// Signup controller
const signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await authService.createUser(email, password);
    return res.json({ message: "Signup successful. Please sign in." });
  } catch (err) {
    console.error(err);
    if (err.message.includes("already registered")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// Signin controller
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required" });
  }

  try {
    const result = await authService.authenticateUser(email, password);

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.user.id, email: result.user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Signin successful",
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
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
        email: req.user.email,
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
