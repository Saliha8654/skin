const express = require('express');
const router = express.Router();
const { getProducts, recommendProducts, getCollections, getProductsByCollection, recommendProductsByCollection } = require('../services/shopify');
const axios = require('axios');

// GET /api/shopify/products
router.get('/products', async (req, res) => {
  try {
    const { skinType, concerns } = req.query;
    
    const filters = {};
    if (skinType) filters.skinType = skinType;
    if (concerns) filters.concerns = concerns.split(',');

    const products = await getProducts(filters);

    res.json({ products });
  } catch (error) {
    console.error('Shopify products error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      message: error.message 
    });
  }
});

// POST /api/shopify/recommend
router.post('/recommend', async (req, res) => {
  try {
    const { skinType, concerns } = req.body;

    if (!skinType) {
      return res.status(400).json({ error: 'Skin type is required' });
    }

    const products = await recommendProducts({
      skinType,
      concerns: concerns || []
    });

    res.json({ products });
  } catch (error) {
    console.error('Product recommendation error:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations',
      message: error.message 
    });
  }
});

// GET /api/shopify/collections
router.get('/collections', async (req, res) => {
  try {
    const { limit } = req.query;
    const collections = await getCollections(limit ? parseInt(limit) : 10);
    res.json({ collections });
  } catch (error) {
    console.error('Shopify collections error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch collections',
      message: error.message 
    });
  }
});

// GET /api/shopify/collections/:handle/products
router.get('/collections/:handle/products', async (req, res) => {
  try {
    const { handle } = req.params;
    const { limit } = req.query;
    
    const collectionData = await getProductsByCollection(handle, limit ? parseInt(limit) : 10);
    res.json(collectionData);
  } catch (error) {
    console.error('Shopify products by collection error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products from collection',
      message: error.message 
    });
  }
});

// POST /api/shopify/recommend-by-collection
router.post('/recommend-by-collection', async (req, res) => {
  try {
    const { collectionHandle, skinType, concerns } = req.body;

    if (!collectionHandle) {
      return res.status(400).json({ error: 'Collection handle is required' });
    }

    const result = await recommendProductsByCollection(collectionHandle, {
      skinType,
      concerns: concerns || []
    });

    res.json(result);
  } catch (error) {
    console.error('Collection-based product recommendation error:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations by collection',
      message: error.message 
    });
  }
});

// POST /api/shopify/add-subscriber - Add subscriber to Shopify
router.post('/add-subscriber', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Shopify Admin API endpoint
    const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
    const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    console.log('Shopify Config:', {
      domain: SHOPIFY_STORE_DOMAIN,
      tokenExists: !!SHOPIFY_ADMIN_ACCESS_TOKEN,
      tokenLength: SHOPIFY_ADMIN_ACCESS_TOKEN?.length
    });
    
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Shopify configuration missing' });
    }
    
    const shopifyUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/customers.json`;
    
    console.log('Making request to:', shopifyUrl);
    
    // Create customer object
    const customerData = {
      customer: {
        email: email,
        accepts_marketing: true,
        tags: "glow-shop-family,chatbot-subscriber"
      }
    };
    
    console.log('Sending customer data:', JSON.stringify(customerData, null, 2));
    
    const response = await axios.post(
      shopifyUrl,
      customerData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Admin-Api-AccessToken': SHOPIFY_ADMIN_ACCESS_TOKEN,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Shopify API Response Status:', response.status);
    console.log('Shopify API Response Data:', JSON.stringify(response.data, null, 2));
    
    console.log('New subscriber added to Shopify:', response.data.customer.email);
    
    res.json({ 
      success: true, 
      message: 'Email subscribed successfully',
      customer: response.data.customer
    });
    
  } catch (error) {
    console.error('Error adding subscriber:', {
      message: error.message,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
      responseHeaders: error.response?.headers
    });
    
    // If it's a duplicate customer error, treat as success
    if (error.response?.data?.errors?.email?.includes('has already been taken')) {
      console.log('Email already exists in Shopify, treating as success');
      return res.json({ 
        success: true, 
        message: 'Email already subscribed',
        existing: true
      });
    }
    
    // Handle unauthorized errors specifically
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Authentication error - check your Shopify Admin Access Token');
      return res.status(401).json({ 
        error: 'Authentication failed - please check your Shopify Admin Access Token',
        details: 'Token may be expired, invalid, or lack customer write permissions'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to add subscriber to Shopify',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;
