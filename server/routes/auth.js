const express = require('express');
const router = express.Router();
const authService = require('../src/services/authService');
const authMiddleware = require('../src/middleware/authMiddleware');

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log('Signup attempt for:', email);
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await authService.createUser(email, password);
    console.log('Signup successful for:', email);
    return res.json({ message: 'Signup successful', user: result.user });
  } catch (err) {
    console.error('Signup failed for:', email, err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log('Signin attempt for:', email);
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await authService.authenticateUser(email, password);
    console.log('Signin successful for:', email);
    return res.json({ 
      message: 'Signin successful', 
      user: result.user,
      session: result.session
    });
  } catch (err) {
    console.error('Signin failed for:', email, err.message);
    return res.status(401).json({ error: err.message });
  }
});

// Get current user information (protected route)
router.get('/user', authMiddleware.authMiddleware, async (req, res) => {
  try {
    // Return user info from JWT token
    const user = {
      id: req.user.id,
      email: req.user.email,
      last_sign_in_at: new Date().toISOString()
    };
    return res.json({ user });
  } catch (err) {
    return res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router; 