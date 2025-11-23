const axios = require('axios');

// Load environment variables
require('dotenv').config();

async function testHuggingFace() {
  // Using a model that's known to work with the inference API
  const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2';
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
  
  console.log('Testing Hugging Face API connectivity...');
  console.log('API URL:', HF_API_URL);
  console.log('API Key exists:', !!HUGGINGFACE_API_KEY);
  
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: "The answer to life, the universe, and everything is",
        parameters: {
          max_new_tokens: 20,
          temperature: 0.7,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('Success! Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Hugging Face API Test Error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
  }
}

testHuggingFace().catch(console.error);