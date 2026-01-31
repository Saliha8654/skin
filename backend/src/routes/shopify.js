const express = require('express');
const router = express.Router();
const { getProducts, recommendProducts, getCollections, getProductsByCollection, recommendProductsByCollection } = require('../services/shopify');

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

module.exports = router;
