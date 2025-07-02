const express = require('express');
const router = express.Router();
const caseController = require('../src/controllers/caseController');
const { authMiddleware } = require('../src/middleware/authMiddleware');

// All case routes require authentication
router.use(authMiddleware);

// Get all cases for the authenticated user
router.get('/cases', caseController.getAllCases);

// Get a specific case by ID (only if owned by user)
router.get('/cases/:id', caseController.getCaseById);

// Create a new case
router.post('/cases', caseController.createCase);

// Update case description (only if owned by user)
router.put('/cases/:id', caseController.updateCase);

module.exports = router; 