const express = require('express');
const router = express.Router();
const { getProducts, recommendProducts } = require('../services/shopify');

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

module.exports = router;
