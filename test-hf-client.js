const { HfInference } = require('@huggingface/inference');

// Load environment variables
require('dotenv').config();

// Initialize the Hugging Face Inference client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function testHuggingFaceClient() {
  try {
    console.log('Testing Hugging Face Inference Client...');
    
    // Test with a model that's known to work with the inference API
    console.log('Testing text generation with microsoft/DialoGPT-medium...');
    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: 'Hello, how are you today?',
      parameters: {
        max_new_tokens: 50
      }
    });
    
    console.log('Success! Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Hugging Face Client Error:', error.message);
    
    // Try with a text classification model as fallback
    try {
      console.log('\nTrying text classification with distilbert-base-uncased-finetuned-sst-2-english...');
      const response2 = await hf.textClassification({
        model: 'distilbert-base-uncased-finetuned-sst-2-english',
        inputs: 'I love this product!'
      });
      
      console.log('Classification success! Response:', JSON.stringify(response2, null, 2));
    } catch (secondError) {
      console.error('Classification error:', secondError.message);
      
      // Try with a question answering model
      try {
        console.log('\nTrying question answering with deepset/roberta-base-squad2...');
        const response3 = await hf.questionAnswering({
          model: 'deepset/roberta-base-squad2',
          inputs: {
            question: 'What is the capital of France?',
            context: 'France is a country in Europe. The capital of France is Paris.'
          }
        });
        
        console.log('QA success! Response:', JSON.stringify(response3, null, 2));
      } catch (thirdError) {
        console.error('QA error:', thirdError.message);
      }
    }
  }
}

testHuggingFaceClient().catch(console.error);