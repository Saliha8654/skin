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
