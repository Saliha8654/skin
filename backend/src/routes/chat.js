const express = require('express');
const router = express.Router();
const { getChatResponse, extractSkincareNeeds } = require('../services/openai');
const { recommendProducts } = require('../services/shopify');

// POST /api/chat/message
router.post('/message', async (req, res) => {
  try {
    const { messages, context } = req.body;

    console.log('Received chat message request:', { messages, context });

    if (!messages || !Array.isArray(messages)) {
      console.log('Invalid messages format');
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Get AI response
    console.log('Calling getChatResponse');
    const response = await getChatResponse(messages, context);
    console.log('Received response from getChatResponse:', response);

    // If we have enough info, get product recommendations
    let products = [];
    if (response.needsProducts) {
      console.log('Getting product recommendations');
      const needs = extractSkincareNeeds(messages);
      products = await recommendProducts(needs);
      console.log('Product recommendations:', products);
    }

    const result = {
      message: response.message,
      needsProducts: response.needsProducts,
      products: products
    };

    console.log('Sending final response:', result);
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      message: error.message 
    });
  }
});

// POST /api/chat/start
router.post('/start', async (req, res) => {
  try {
    const welcomeMessage = "Hi! I'm your K-beauty skin advisor 💖 Let's find out what your skin needs. Ready?\n\nFirst, what's your main skin concern right now?";
    
    res.json({
      message: welcomeMessage,
      sessionId: Date.now().toString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start chat' });
  }
});

module.exports = router;