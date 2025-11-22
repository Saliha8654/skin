const axios = require('axios');

// Use Hugging Face for FREE chat (no OpenAI needed)
// Using a model that's known to be reliable with inference API
const HF_CHAT_MODEL = 'gpt2';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_CHAT_MODEL}`;

// System prompt for K-beauty skincare expert
const SYSTEM_PROMPT = `You are a friendly K-beauty skincare expert assistant. Your role is to:
- Help users identify their skin type and concerns
- Ask relevant questions about their skin, lifestyle, and preferences
- Be warm, encouraging, and use occasional emojis
- Keep responses concise and conversational (2-3 sentences max)
- After gathering enough information, recommend suitable skincare products
- Focus on Korean beauty philosophy: gentle, hydrating, multi-step routines

When asking questions, focus on:
1. Skin type (oily, dry, combination, normal, sensitive)
2. Main concerns (acne, dullness, dryness, fine lines, dark spots, sensitivity)
3. Current routine (if any)
4. Preferences (lightweight vs rich textures, fragrance-free, etc.)

After 3-4 questions, you should have enough info to make recommendations.`;

async function getChatResponse(messages, userContext = {}) {
  try {
    // Format conversation for Hugging Face
    let conversationText = "You are a K-beauty skincare expert. ";
    
    messages.forEach(msg => {
      if (msg.role === 'user') {
        conversationText += `User: ${msg.content} `;
      } else if (msg.role === 'assistant') {
        conversationText += `Assistant: ${msg.content} `;
      }
    });
    
    conversationText += "Assistant:";

    console.log('Sending request to Hugging Face API with conversation:', conversationText);
    console.log('Using API URL:', HF_API_URL);
    console.log('Using API Key (first 5 chars):', process.env.HUGGINGFACE_API_KEY?.substring(0, 5) + '...');

    // Increase timeout for Hugging Face API which can be slow
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: conversationText,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // Increased timeout to 60 seconds
      }
    );

    console.log('Received response from Hugging Face API:', JSON.stringify(response.data, null, 2));

    let botMessage = '';
    
    if (response.data && response.data[0] && response.data[0].generated_text) {
      botMessage = response.data[0].generated_text.trim();
      console.log('Extracted bot message:', botMessage);
    } else {
      console.log('No valid response from Hugging Face, using fallback');
      // Fallback response
      botMessage = getFallbackResponse(messages);
    }

    console.log('Final bot message:', botMessage);

    return {
      message: botMessage,
      needsProducts: shouldRecommendProducts(messages)
    };
  } catch (error) {
    console.error('Hugging Face Chat Error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    
    // Always fallback to predefined responses when API fails
    const fallbackMessage = getFallbackResponse(messages);
    console.log('Using fallback message:', fallbackMessage);
    
    return {
      message: fallbackMessage,
      needsProducts: shouldRecommendProducts(messages)
    };
  }
}

// Fallback responses when API fails
function getFallbackResponse(messages) {
  const userMessages = messages.filter(m => m.role === 'user');
  const lastMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';
  
  console.log('Generating fallback response for', userMessages.length, 'user messages');
  
  // Question 1: Initial greeting
  if (userMessages.length === 0) {
    return "Hi! I'm your K-beauty skin advisor 💖 Let's find out what your skin needs. Ready?\n\nFirst, what's your main skin concern right now?";
  }
  
  // Question 2: After first answer
  if (userMessages.length === 1) {
    if (lastMessage.includes('acne') || lastMessage.includes('pimple')) {
      return "I understand, acne can be frustrating! 😊 What's your skin type? Is it oily, dry, combination, or sensitive?";
    } else if (lastMessage.includes('dry') || lastMessage.includes('dryness')) {
      return "Dry skin needs extra love! 💧 Do you prefer lightweight or rich, creamy products?";
    } else if (lastMessage.includes('oil') || lastMessage.includes('oily')) {
      return "Got it! Oily skin needs balance. ✨ What type of products do you usually prefer - gel-based or cream-based?";
    } else {
      return "Thanks for sharing! 😊 What's your skin type? Is it oily, dry, combination, or sensitive?";
    }
  }
  
  // Question 3: After second answer  
  if (userMessages.length === 2) {
    return "Perfect! One last question - do you have any specific ingredient preferences? For example, fragrance-free, natural, or specific actives like niacinamide or vitamin C? 🌿";
  }
  
  // After 3+ questions: Recommend products
  if (userMessages.length >= 3) {
    return "Wonderful! Based on what you've told me, I have some perfect K-beauty recommendations for you! ✨ Let me show you products that will work beautifully for your skin. Check them out below! 💖";
  }
  
  return "Tell me more about your skin concerns, and I'll find the perfect products for you! 😊";
}

// Determine if we have enough info to recommend products
function shouldRecommendProducts(messages) {
  // Check if user has answered at least 3 questions
  const userMessages = messages.filter(m => m.role === 'user');
  const result = userMessages.length >= 3;
  console.log('Should recommend products:', result, '(user messages:', userMessages.length, ')');
  return result;
}

// Extract skincare needs from conversation
function extractSkincareNeeds(messages) {
  const conversation = messages.map(m => m.content).join(' ').toLowerCase();
  
  const needs = {
    skinType: null,
    concerns: [],
    preferences: []
  };

  // Detect skin type
  if (conversation.includes('oily')) needs.skinType = 'oily';
  else if (conversation.includes('dry')) needs.skinType = 'dry';
  else if (conversation.includes('combination')) needs.skinType = 'combination';
  else if (conversation.includes('sensitive')) needs.skinType = 'sensitive';
  else needs.skinType = 'normal';

  // Detect concerns
  if (conversation.includes('acne') || conversation.includes('pimple')) needs.concerns.push('acne');
  if (conversation.includes('dull') || conversation.includes('brightness')) needs.concerns.push('dullness');
  if (conversation.includes('dry') || conversation.includes('hydrat')) needs.concerns.push('hydration');
  if (conversation.includes('aging') || conversation.includes('wrinkle')) needs.concerns.push('anti-aging');
  if (conversation.includes('dark spot') || conversation.includes('hyperpigmentation')) needs.concerns.push('dark-spots');

  console.log('Extracted skincare needs:', needs);
  return needs;
}

module.exports = {
  getChatResponse,
  extractSkincareNeeds
};