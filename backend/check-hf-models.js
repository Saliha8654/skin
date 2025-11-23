const axios = require('axios');

async function checkHuggingFaceModels() {
  // First, let's check if we can access the model info
  try {
    console.log('Checking model info for gpt2...');
    const modelInfoUrl = 'https://huggingface.co/api/models/gpt2';
    const infoResponse = await axios.get(modelInfoUrl, {
      timeout: 10000
    });
    console.log('Model info retrieved successfully');
    console.log('Model ID:', infoResponse.data.modelId);
    console.log('Pipeline tag:', infoResponse.data.pipeline_tag);
  } catch (infoError) {
    console.error('Model info error:', infoError.response?.data || infoError.message);
  }
  
  // Now let's try to check if our API key works
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || 'YOUR_API_KEY_HERE';
  console.log('API Key exists:', !!HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY !== 'YOUR_API_KEY_HERE');
  
  if (HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY !== 'YOUR_API_KEY_HERE') {
    try {
      console.log('Testing API key validity...');
      const whoamiUrl = 'https://huggingface.co/api/whoami-v2';
      const whoamiResponse = await axios.get(whoamiUrl, {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`
        },
        timeout: 10000
      });
      console.log('API key is valid');
      console.log('User:', whoamiResponse.data.name);
    } catch (authError) {
      console.error('API key error:', authError.response?.data || authError.message);
    }
  } else {
    console.log('No API key provided, skipping API key test');
  }
}

checkHuggingFaceModels().catch(console.error);