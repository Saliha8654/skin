const axios = require('axios');

// Load environment variables
require('dotenv').config();

async function checkModels() {
  try {
    // Let's try a model that's specifically designed for inference
    const model = 'google/flan-t5-small';
    const url = `https://router.huggingface.co/models/${model}`;
    
    console.log(`Testing model: ${model}`);
    console.log(`URL: ${url}`);
    
    const response = await axios.post(
      url,
      {
        inputs: "Answer the following question: What is the capital of France?",
        parameters: {
          max_new_tokens: 20,
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
    
    console.log('Success! Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Model Test Error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    
    // Let's try another model
    try {
      console.log('\nTrying a different model...');
      const model2 = 'facebook/bart-large-cnn';
      const url2 = `https://router.huggingface.co/models/${model2}`;
      
      console.log(`Testing model: ${model2}`);
      console.log(`URL: ${url2}`);
      
      const response2 = await axios.post(
        url2,
        {
          inputs: "Summarize: Artificial intelligence is a wonderful field that is developing rapidly.",
          parameters: {
            max_length: 20,
            min_length: 5
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
      
      console.log('Second model success! Response:', JSON.stringify(response2.data, null, 2));
    } catch (secondError) {
      console.error('Second model error:', secondError.response?.data || secondError.message);
      
      // Let's check if we can access any model information
      try {
        console.log('\nTrying to get general model info...');
        const modelInfoUrl = `https://huggingface.co/api/models/google/flan-t5-small`;
        const infoResponse = await axios.get(modelInfoUrl, {
          timeout: 10000
        });
        console.log('Model info:', JSON.stringify(infoResponse.data, null, 2));
      } catch (infoError) {
        console.error('Model info error:', infoError.response?.data || infoError.message);
      }
    }
  }
}

checkModels().catch(console.error);