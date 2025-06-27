const jwt = require("jsonwebtoken");

// For Supabase, we need to use their JWT secret
// This should be your Supabase JWT secret from your project settings
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "your-supabase-jwt-secret";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // Verify the Supabase JWT token
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    
    // Set user info from JWT token
    req.user = {
      id: decoded.sub, // Supabase uses 'sub' for user ID
      email: decoded.email,
    };
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = { authMiddleware, SUPABASE_JWT_SECRET };
