const express = require('express');
const router = express.Router();
const { getChatResponse, extractSkincareNeeds } = require('../services/openai');
const { recommendProducts, recommendProductsByCollection, recommendProductsByCollections } = require('../services/shopify');

// Validate that required environment variables are present
if (!process.env.HUGGINGFACE_API_KEY) {
  console.warn('Warning: HUGGINGFACE_API_KEY is not set - chat responses will use fallback mode');
}

if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || !process.env.SHOPIFY_STORE_DOMAIN) {
  console.warn('Warning: Shopify credentials are not fully configured - product recommendations may fail');
}

// POST /api/chat/message
router.post('/message', async (req, res) => {
  try {
    const { messages, context } = req.body;

    console.log('=== CHAT MESSAGE REQUEST ===');
    console.log('Received chat message request:', { messages, context });

    // Validate request body
    if (!messages) {
      console.log('Missing messages in request body');
      return res.status(400).json({ error: 'Messages are required' });
    }

    if (!Array.isArray(messages)) {
      console.log('Invalid messages format - messages must be an array');
      return res.status(400).json({ error: 'Messages must be an array' });
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
      
      // Check if we should recommend products by collection
      if (needs.collection) {
        console.log('Recommendation by collection:', needs.collection);
        
        // Map the detected collection names to actual Shopify collection handles
        const collectionHandleMap = {
          'OIL CLEANSER': 'step-1',
          'WATER-BASED CLEANSER': 'step-2-water-based-cleanser',
          'ALL KOREAN SKIN CARE': 'skin-care',
          'MOISTURIZER': 'step-9-moisturizer',
          'TONER': 'step-3-toner',
          'SERUM/AMPOULE': 'step-6-serum-ampoule',
          'SUN SCREEN': 'step-10-suncream',
          'MASK': 'step-7-mask',
          'EYE CARE': 'step-8-eye-care',
          'LIP CARE': 'lip-care',
          'EXFOLIATOR': 'step-3-exfoliator',
          'AHA/BHA': 'aha-bha',
          'ESSENCE': 'step-5-essence',
          'RETINOL': 'retinol',
          'VITAMIN C': 'vitamin-c',
          'RICE': 'rice',
          'ACNE': 'acne',
          'REDNESS/INFLAMMATION': 'redness-inflamation',
          'BRIGHTENING': 'brightening',
          'ANTI-AGEING': 'anti-ageing',
          'OVERNIGHT MASKS': 'overnight-masks',
          'FACIAL OIL': 'facial-oil',
          'TRAVEL KIT/MINI': 'travel-kit',
          'COMBINATION SKIN': 'combination-skin',
          'OILY SKIN': 'oily-skin',
          'DRY SKIN': 'dry-skin',
          'NORMAL SKIN': 'normal-skin',
          'SENSITIVE SKIN': 'redness-inflamation'
        };
        
        const collectionHandle = collectionHandleMap[needs.collection] || 'skin-care';
        
        try {
          const collectionResult = await recommendProductsByCollection(collectionHandle, needs);
          products = collectionResult.products;
          console.log('Collection-based product recommendations count:', products.length);
        } catch (error) {
          console.error('Collection-based recommendation failed, falling back to general recommendations:', error.message);
          products = await recommendProducts(needs);
        }
      } else {
        // Use the new collection-based recommendation function that maps needs to collections
        try {
          products = await recommendProductsByCollections(needs);
        } catch (error) {
          console.error('Collection-based recommendation failed, falling back to general recommendations:', error.message);
          products = await recommendProducts(needs);
        }
      }
      
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
    
    // Send a more informative error response
    res.status(500).json({ 
      error: 'Failed to process chat message',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/chat/start
router.post('/start', async (req, res) => {
  try {
    console.log('=== CHAT START REQUEST ===');
    const welcomeMessage = "Hi, I'm GlowFairy!🧚🏻‍♀️\nI'm here to sprinkle a little magic on your skincare journey and help you find the right products for your skin's unique needs. Ready?\nFirst, what's your main skin concern right now?";
    
    // Generate a more robust session ID
    const sessionId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
    
    const result = {
      message: welcomeMessage,
      sessionId: sessionId
    };
    
    console.log('Sending chat start response:', result);
    res.json(result);
  } catch (error) {
    console.error('=== CHAT START ERROR ===');
    console.error('Chat start error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to start chat',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;