const express = require('express');
const router = express.Router();
const { getChatResponse, extractSkincareNeeds } = require('../services/openai');
const { recommendProducts } = require('../services/shopify');

// POST /api/chat/message
router.post('/message', async (req, res) => {
  try {
    const { messages, context } = req.body;

    console.log('=== CHAT MESSAGE REQUEST ===');
    console.log('Received chat message request:', { messages, context });

    if (!messages || !Array.isArray(messages)) {
      console.log('Invalid messages format - messages is required and must be an array');
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log('Messages array length:', messages.length);
    console.log('Messages content:', JSON.stringify(messages, null, 2));

    // Get AI response
    console.log('Calling getChatResponse');
    const response = await getChatResponse(messages, context);
    console.log('Received response from getChatResponse:', JSON.stringify(response, null, 2));

    // If we have enough info, get product recommendations
    let products = [];
    if (response.needsProducts) {
      console.log('Getting product recommendations');
      const needs = extractSkincareNeeds(messages);
      console.log('Extracted needs for recommendations:', needs);
      products = await recommendProducts(needs);
      console.log('Product recommendations count:', products.length);
      console.log('Product recommendations:', JSON.stringify(products.map(p => ({title: p.title, id: p.id})), null, 2));
    }

    const result = {
      message: response.message,
      needsProducts: response.needsProducts,
      products: products
    };

    console.log('Sending final response:', JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error('=== CHAT ERROR ===');
    console.error('Chat error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      message: error.message 
    });
  }
});

// POST /api/chat/start
router.post('/start', async (req, res) => {
  try {
    console.log('=== CHAT START REQUEST ===');
    const welcomeMessage = "Hi! I'm your K-beauty skin advisor 💖 Let's find out what your skin needs. Ready?\n\nFirst, what's your main skin concern right now?";
    
    const result = {
      message: welcomeMessage,
      sessionId: Date.now().toString()
    };
    
    console.log('Sending chat start response:', result);
    res.json(result);
  } catch (error) {
    console.error('=== CHAT START ERROR ===');
    console.error('Chat start error:', error);
    res.status(500).json({ error: 'Failed to start chat' });
  }
});

module.exports = router;