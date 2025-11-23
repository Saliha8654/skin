const axios = require('axios');

async function testHuggingFaceAPI() {
  // Using the new router endpoint with full model identifier
  const HF_API_URL = 'https://router.huggingface.co/models/openai-community/gpt2';
  // Replace with your actual API key
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || 'YOUR_API_KEY_HERE';
  
  console.log('Testing Hugging Face API connectivity...');
  console.log('API URL:', HF_API_URL);
  console.log('API Key exists:', !!HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY !== 'YOUR_API_KEY_HERE');
  
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: "The future of AI is",
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
    
    // Try a different model if gpt2 doesn't work
    if (error.response?.status === 404) {
      console.log('\nTrying with facebook/blenderbot-400M-distill...');
      await testAlternativeModel();
    }
  }
}

async function testAlternativeModel() {
  const HF_API_URL = 'https://router.huggingface.co/models/facebook/blenderbot-400M-distill';
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || 'YOUR_API_KEY_HERE';
  
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: "Hello, how are you?",
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
    
    console.log('Alternative model success! Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Alternative model error:', error.response?.data || error.message);
    
    // Try one more model
    if (error.response?.status === 404) {
      console.log('\nTrying with microsoft/DialoGPT-medium...');
      await testThirdModel();
    }
  }
}

async function testThirdModel() {
  const HF_API_URL = 'https://router.huggingface.co/models/microsoft/DialoGPT-medium';
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || 'YOUR_API_KEY_HERE';
  
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: "Hello, how are you?",
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
    
    console.log('Third model success! Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Third model error:', error.response?.data || error.message);
  }
}

testHuggingFaceAPI().catch(console.error);