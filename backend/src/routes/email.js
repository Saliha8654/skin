const express = require('express');
const router = express.Router();
const { saveUserEmail } = require('../services/supabase');

// POST /api/email/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email, preferences } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const result = await saveUserEmail(email, preferences);

    res.json({ 
      success: true,
      message: 'Email saved successfully! We\'ll send you personalized skincare tips.' 
    });
  } catch (error) {
    console.error('Email save error:', error);
    res.status(500).json({ 
      error: 'Failed to save email',
      message: error.message 
    });
  }
});

module.exports = router;
