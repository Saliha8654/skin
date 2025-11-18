const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeSkin, generateSkincareTips } = require('../services/huggingface');
const { recommendProducts } = require('../services/shopify');

// Configure multer for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// POST /api/skin-analysis/analyze
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Analyze skin from uploaded image
    const analysis = await analyzeSkin(req.file.buffer);

    // Generate skincare tips
    const tips = generateSkincareTips(analysis.skinType, analysis.concerns);

    // Get product recommendations
    const products = await recommendProducts({
      skinType: analysis.skinType,
      concerns: analysis.concerns
    });

    res.json({
      analysis: {
        skinType: analysis.skinType,
        confidence: analysis.confidence,
        concerns: analysis.concerns
      },
      tips: tips,
      products: products
    });
  } catch (error) {
    console.error('Skin analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze skin',
      message: error.message 
    });
  }
});

module.exports = router;
