const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://your-vercel-app.vercel.app',
    `https://${process.env.SHOPIFY_STORE_DOMAIN}` || 'https://your-shopify-store.myshopify.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const chatRoutes = require('./routes/chat');
const skinAnalysisRoutes = require('./routes/skinAnalysis');
const shopifyRoutes = require('./routes/shopify');
const emailRoutes = require('./routes/email');

// Use routes
app.use('/api/chat', chatRoutes);
app.use('/api/skin-analysis', skinAnalysisRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/email', emailRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Skincare AI Chatbot API is running' });
});

// Test Hugging Face API connectivity
app.get('/api/test-hf', async (req, res) => {
  try {
    const axios = require('axios');
    const HF_CHAT_MODEL = 'microsoft/DialoGPT-medium';
    const HF_API_URL = `https://router.huggingface.co/models/${HF_CHAT_MODEL}`;
    
    console.log('Testing Hugging Face API connectivity...');
    console.log('API URL:', HF_API_URL);
    console.log('API Key exists:', !!process.env.HUGGINGFACE_API_KEY);
    
    if (!process.env.HUGGINGFACE_API_KEY) {
      return res.status(500).json({ error: 'Hugging Face API key not configured' });
    }
    
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: "Hello, how are you today?",
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    res.json({
      status: 'success',
      message: 'Hugging Face API is accessible',
      response: response.data
    });
  } catch (error) {
    console.error('Hugging Face API Test Error:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Hugging Face API',
      error: error.response?.data || error.message,
      status: error.response?.status
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});