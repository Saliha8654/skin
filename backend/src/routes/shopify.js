const express = require('express');
const router = express.Router();

// Shopify API configuration
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Add subscriber to Shopify
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
    
    // Shopify GraphQL API endpoint
    const shopifyUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;
    
    // GraphQL mutation to create customer
    const query = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
            acceptsMarketing
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const variables = {
      input: {
        email: email,
        acceptsMarketing: true,
        tags: ["glow-shop-family", "chatbot-subscriber"]
      }
    };
    
    const response = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('Shopify API Error:', result.errors);
      return res.status(500).json({ error: 'Failed to add subscriber to Shopify' });
    }
    
    const { customerCreate } = result.data;
    
    if (customerCreate.userErrors && customerCreate.userErrors.length > 0) {
      // If customer already exists, we can still consider it a success
      if (customerCreate.userErrors[0].message.includes('already been taken')) {
        console.log('Customer already exists, but treating as success');
        return res.json({ 
          success: true, 
          message: 'Email subscribed successfully',
          existing: true
        });
      }
      
      return res.status(400).json({ 
        error: 'Failed to create subscriber',
        details: customerCreate.userErrors
      });
    }
    
    console.log('New subscriber added to Shopify:', customerCreate.customer.email);
    
    res.json({ 
      success: true, 
      message: 'Email subscribed successfully',
      customer: customerCreate.customer
    });
    
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;