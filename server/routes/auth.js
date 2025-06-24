const express = require('express');
const router = express.Router();
const { User } = require('../sequelize');

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    await User.create({ username, password });
    return res.json({ message: 'Signup successful' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 