const express = require('express');
const router = express.Router();
const supabaseService = require('../services/supabaseService');

// Test route to verify Supabase connection
router.get('/test', async (req, res) => {
  try {
    const result = await supabaseService.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Supabase connection failed', 
      error: error.message 
    });
  }
});

// Get current authenticated user
router.get('/user', async (req, res) => {
  try {
    const user = await supabaseService.getCurrentUser();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Not authenticated', 
      error: error.message 
    });
  }
});

// Get all users from Supabase (admin function - returns empty for now)
router.get('/users', async (req, res) => {
  try {
    const users = await supabaseService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users', 
      error: error.message 
    });
  }
});

// Get user by ID (admin function - returns null for now)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await supabaseService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user', 
      error: error.message 
    });
  }
});

// Create a new user using Supabase Auth
router.post('/users', async (req, res) => {
  try {
    const newUser = await supabaseService.createUser(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create user', 
      error: error.message 
    });
  }
});

// Update current user metadata
router.put('/user', async (req, res) => {
  try {
    const updatedUser = await supabaseService.updateUser(req.body);
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update user', 
      error: error.message 
    });
  }
});

// Delete current user
router.delete('/user', async (req, res) => {
  try {
    await supabaseService.deleteUser();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user', 
      error: error.message 
    });
  }
});

module.exports = router; 