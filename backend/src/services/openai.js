const axios = require('axios');

// Use Hugging Face for FREE chat (no OpenAI needed)
// Using the new router endpoint with a model that should work
const HF_CHAT_MODEL = 'gpt2';
const HF_API_URL = `https://router.huggingface.co/models/${HF_CHAT_MODEL}`;

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
  // IMPORTANT: Never let Hugging Face failures break the chatbot.
  // If there is no API key, or any HF request fails, we ALWAYS fall back
  // to the scripted conversation defined in getFallbackResponse.

  // 1) If no HF key is configured (common on Render / local), skip network calls
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.warn('HUGGINGFACE_API_KEY is not set - using fallback chat responses only');
    const fallbackMessage = getFallbackResponse(messages);
    return {
      message: fallbackMessage,
      needsProducts: shouldRecommendProducts(messages)
    };
  }

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
    
    // Do NOT propagate the error. Always use fallback message.
    const fallbackMessage = getFallbackResponse(messages);
    console.log('Using fallback message due to HF error:', fallbackMessage);
    
    return {
      message: fallbackMessage,
      needsProducts: shouldRecommendProducts(messages)
    };
  }
}

// Alternative model for Hugging Face API
async function getChatResponseWithAlternativeModel(messages, userContext = {}) {
  try {
    const ALT_HF_CHAT_MODEL = 'facebook/blenderbot-400M-distill';
    const ALT_HF_API_URL = `https://router.huggingface.co/models/${ALT_HF_CHAT_MODEL}`;
    
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

    console.log('Sending request to alternative Hugging Face API with conversation:', conversationText);
    console.log('Using API URL:', ALT_HF_API_URL);

    const response = await axios.post(
      ALT_HF_API_URL,
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
        timeout: 60000
      }
    );

    console.log('Received response from alternative Hugging Face API:', JSON.stringify(response.data, null, 2));

    let botMessage = '';
    
    if (response.data && response.data[0] && response.data[0].generated_text) {
      botMessage = response.data[0].generated_text.trim();
      console.log('Extracted bot message:', botMessage);
    } else {
      console.log('No valid response from alternative Hugging Face model, using fallback');
      botMessage = getFallbackResponse(messages);
    }

    return {
      message: botMessage,
      needsProducts: shouldRecommendProducts(messages)
    };
  } catch (error) {
    console.error('Alternative Hugging Face Chat Error:', error.response?.data || error.message);
    const fallbackMessage = getFallbackResponse(messages);
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
  
  // Check if user is asking about specific collections/products
  const hasCollectionQuery = lastMessage.includes('cleanser') || 
                            lastMessage.includes('cleansing') || 
                            lastMessage.includes('face wash') || 
                            lastMessage.includes('toner') || 
                            lastMessage.includes('serum') || 
                            lastMessage.includes('essence') || 
                            lastMessage.includes('moisturizer') || 
                            lastMessage.includes('moisturiser') || 
                            lastMessage.includes('cream') || 
                            lastMessage.includes('sunscreen') || 
                            lastMessage.includes('spf') || 
                            lastMessage.includes('mask') || 
                            lastMessage.includes('masks') || 
                            lastMessage.includes('eye cream') || 
                            lastMessage.includes('lip balm') || 
                            lastMessage.includes('lip care') || 
                            lastMessage.includes('aha') || 
                            lastMessage.includes('bha') || 
                            lastMessage.includes('retinol') || 
                            lastMessage.includes('rice') || 
                            lastMessage.includes('vitamin c') || 
                            lastMessage.includes('vit c') || 
                            lastMessage.includes('acne') || 
                            lastMessage.includes('redness') || 
                            lastMessage.includes('brighten') || 
                            lastMessage.includes('brightening') || 
                            lastMessage.includes('anti-age') || 
                            lastMessage.includes('ageing') || 
                            lastMessage.includes('aging') || 
                            lastMessage.includes('overnight mask') || 
                            lastMessage.includes('sleeping mask') || 
                            lastMessage.includes('facial oil') || 
                            lastMessage.includes('face oil') || 
                            lastMessage.includes('travel kit') || 
                            lastMessage.includes('mini') || 
                            lastMessage.includes('sheet mask') || 
                            lastMessage.includes('product') || 
                            lastMessage.includes('recommend');
  
  // Question 1: Initial greeting
  if (userMessages.length === 0) {
    return "Hi! I'm your K-beauty skin advisor 💖 Let's find out what your skin needs. Ready?\n\nFirst, what's your main skin concern right now? (For example: acne, dark circles, dry lips, dullness, aging, etc.)";
  }
  
  // Question 2: After first answer
  if (userMessages.length === 1) {
    if (lastMessage.includes('acne') || lastMessage.includes('pimple') || lastMessage.includes('breakout')) {
      return "I understand, acne can be frustrating! 😊 What's your skin type? Is it oily, dry, combination, or sensitive?";
    } else if (lastMessage.includes('dark circle') || lastMessage.includes('under eye') || lastMessage.includes('eye bag')) {
      return "Dark circles can be tough! 👀 What's your skin type? Is it oily, dry, combination, or sensitive?";
    } else if (lastMessage.includes('dry lip') || lastMessage.includes('chapped lip') || lastMessage.includes('lip')) {
      return "Dry lips need special care! 💋 Do you also have any other skin concerns, or just focusing on lip care?";
    } else if (lastMessage.includes('dry') || lastMessage.includes('dryness')) {
      return "Dry skin needs extra love! 💧 Do you prefer lightweight or rich, creamy products?";
    } else if (lastMessage.includes('oil') || lastMessage.includes('oily')) {
      return "Got it! Oily skin needs balance. ✨ What type of products do you usually prefer - gel-based or cream-based?";
    } else if (lastMessage.includes('dull') || lastMessage.includes('brightness')) {
      return "Let's bring back that glow! ✨ What's your skin type? Is it oily, dry, combination, or sensitive?";
    } else if (lastMessage.includes('aging') || lastMessage.includes('wrinkle') || lastMessage.includes('fine line')) {
      return "Anti-aging is important! ⏰ What's your skin type? Is it oily, dry, combination, or sensitive?";
    } else if (hasCollectionQuery) {
      // If user is asking about specific product types, go straight to recommendations
      return "Perfect! I can recommend some amazing products for you! ✨ Let me know your skin type (oily, dry, combination, sensitive) and any specific concerns you have, and I'll find the perfect items from our collection for you!";
    } else {
      return "Thanks for sharing! 😊 What's your skin type? Is it oily, dry, combination, or sensitive?";
    }
  }
  
  // Question 3: After second answer  
  if (userMessages.length === 2) {
    if (hasCollectionQuery) {
      // If user asked about specific products, recommend now
      return "Amazing! Based on what you're looking for, I have some perfect K-beauty recommendations for you! ✨ Let me show you the best products that match your needs. Check them out below! 💖";
    } else {
      return "Perfect! One last question - do you have any other specific concerns or ingredient preferences? For example: dark spots, pores, texture, fragrance-free, natural ingredients, etc. 🌿";
    }
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
  
  // Check if last message contains collection-related queries
  const lastMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';
  const hasCollectionQuery = lastMessage.includes('cleanser') || 
                            lastMessage.includes('cleansing') || 
                            lastMessage.includes('face wash') || 
                            lastMessage.includes('toner') || 
                            lastMessage.includes('serum') || 
                            lastMessage.includes('essence') || 
                            lastMessage.includes('moisturizer') || 
                            lastMessage.includes('moisturiser') || 
                            lastMessage.includes('cream') || 
                            lastMessage.includes('sunscreen') || 
                            lastMessage.includes('spf') || 
                            lastMessage.includes('mask') || 
                            lastMessage.includes('masks') || 
                            lastMessage.includes('eye cream') || 
                            lastMessage.includes('lip balm') || 
                            lastMessage.includes('lip care') || 
                            lastMessage.includes('aha') || 
                            lastMessage.includes('bha') || 
                            lastMessage.includes('retinol') || 
                            lastMessage.includes('rice') || 
                            lastMessage.includes('vitamin c') || 
                            lastMessage.includes('vit c') || 
                            lastMessage.includes('acne') || 
                            lastMessage.includes('redness') || 
                            lastMessage.includes('brighten') || 
                            lastMessage.includes('brightening') || 
                            lastMessage.includes('anti-age') || 
                            lastMessage.includes('ageing') || 
                            lastMessage.includes('aging') || 
                            lastMessage.includes('overnight mask') || 
                            lastMessage.includes('sleeping mask') || 
                            lastMessage.includes('facial oil') || 
                            lastMessage.includes('face oil') || 
                            lastMessage.includes('travel kit') || 
                            lastMessage.includes('mini') || 
                            lastMessage.includes('sheet mask') || 
                            lastMessage.includes('product') || 
                            lastMessage.includes('recommend');
  
  // If user asked about specific collections/products, recommend earlier
  let result = false;
  if (hasCollectionQuery && userMessages.length >= 1) {
    result = true; // If user asks about specific products, recommend after first message
  } else {
    result = userMessages.length >= 3; // Otherwise, wait for 3 messages
  }
  
  console.log('Should recommend products:', result, '(user messages:', userMessages.length, ', hasCollectionQuery:', hasCollectionQuery, ')');
  return result;
}

// Extract skincare needs from conversation
function extractSkincareNeeds(messages) {
  const conversation = messages.map(m => m.content).join(' ').toLowerCase();
  
  const needs = {
    skinType: null,
    concerns: [],
    preferences: [],
    collection: null // Added collection field
  };

  // Detect skin type (check for complete words to avoid partial matches)
  const lowerConversation = conversation.toLowerCase();
  
  if (lowerConversation.includes('oily skin') || lowerConversation.includes('oily face') || lowerConversation.includes('oily') && !lowerConversation.includes('combination')) {
    needs.skinType = 'oily';
    needs.collection = 'OILY SKIN';
  }
  else if (lowerConversation.includes('dry skin') || lowerConversation.includes('dry face') || lowerConversation.includes('dry') && !lowerConversation.includes('combination')) {
    needs.skinType = 'dry';
    needs.collection = 'DRY SKIN';
  }
  else if (lowerConversation.includes('combination skin') || lowerConversation.includes('combination face') || lowerConversation.includes('combination')) {
    needs.skinType = 'combination';
    needs.collection = 'COMBINATION SKIN';
  }
  else if (lowerConversation.includes('sensitive skin') || lowerConversation.includes('sensitive face') || lowerConversation.includes('sensitive')) {
    needs.skinType = 'sensitive';
    needs.collection = 'SENSITIVE SKIN';
  }
  else {
    needs.skinType = 'normal';
    needs.collection = 'NORMAL SKIN';
  }

  // Detect skincare trend collections (most specific first)
  if (conversation.includes('overnight mask') || conversation.includes('sleeping mask')) {
    needs.collection = 'OVERNIGHT MASKS';
  }
  // Detect active ingredient collections
  else if (conversation.includes('aha') || conversation.includes('bha') || conversation.includes('exfoliat')) {
    needs.collection = 'AHA/BHA';
  } else if (conversation.includes('retinol') || conversation.includes('retinoids') || conversation.includes('retin-a')) {
    needs.collection = 'RETINOL';
  } else if (conversation.includes('rice') || conversation.includes('rice water') || conversation.includes('sake')) {
    needs.collection = 'RICE';
  } else if (conversation.includes('vitamin c') || conversation.includes('vit c') || conversation.includes('ascorbic')) {
    needs.collection = 'VITAMIN C';
  }
  
  // Detect skin concern collections
  else if (conversation.includes('acne') || conversation.includes('pimple') || conversation.includes('breakout')) {
    needs.collection = 'ACNE';
  } else if (conversation.includes('redness') || conversation.includes('inflammation') || conversation.includes('irritat')) {
    needs.collection = 'REDNESS/INFLAMMATION';
  } else if (conversation.includes('brighten') || conversation.includes('brightening') || conversation.includes('glow')) {
    needs.collection = 'BRIGHTENING';
  } else if (conversation.includes('anti-age') || conversation.includes('ageing') || conversation.includes('aging') || conversation.includes('wrinkle')) {
    needs.collection = 'ANTI-AGEING';
  }
  
  // Detect collection mentions based on product types (more specific before general)
  else if (conversation.includes('water cleanser') || conversation.includes('water-based cleanser') || conversation.includes('cleansing') || conversation.includes('face wash') || conversation.includes('washing')) {
    needs.collection = 'WATER-BASED CLEANSER';
  } 
  else if(conversation.includes('oil cleanser') || conversation.includes('oil-based cleanser') || conversation.includes('cleansing oil') || conversation.includes('cleansing balm')) {
    needs.collection = 'OIL CLEANSER';
  } else if (conversation.includes('toner') || conversation.includes('treatments')) {
    needs.collection = 'TONER';
  } else if (conversation.includes('serum') || conversation.includes('essence') || conversation.includes('ampoule')) {
    needs.collection = 'SERUM/AMPOULE';
  } else if (conversation.includes('eye care') || conversation.includes('eye cream')  || conversation.includes('dark circles') || conversation.includes('under eye') || conversation.includes('eye serum')) {
    needs.collection = 'EYE CARE';
  } else if (conversation.includes('lip care') || conversation.includes('dry lips')  || conversation.includes('cracked lips')  || conversation.includes('chapped lips')|| conversation.includes('lip balm') || conversation.includes('lip')) {
    needs.collection = 'LIP CARE';
  } else if (conversation.includes('moisturizer') || conversation.includes('moisturiser') || conversation.includes('cream') || conversation.includes('lotion') || conversation.includes('gel')) {
    needs.collection = 'MOISTURIZER';
  } else if (conversation.includes('sunscreen') || conversation.includes('sun block') || conversation.includes('spf') || conversation.includes('sun protection')) {
    needs.collection = 'SUN SCREEN';
  } else if (conversation.includes('facial oil') || conversation.includes('face oil') || conversation.includes('face serum oil')) {
    needs.collection = 'FACIAL OIL';
  } else if (conversation.includes('travel kit') || conversation.includes('mini') || conversation.includes('travel size')) {
    needs.collection = 'TRAVEL KIT/MINI';
  } else if (conversation.includes('sheet mask') || conversation.includes('mask sheet') || conversation.includes('masks') || conversation.includes('face mask') || conversation.includes('peel off') || conversation.includes('clay mask')) {
    needs.collection = 'MASK';
  }

  // Detect concerns - Enhanced with more specific matching
  // Acne and blemishes
  if (conversation.includes('acne') || conversation.includes('pimple') || conversation.includes('breakout') || conversation.includes('blemish')) {
    needs.concerns.push('acne');
  }
  
  // Dullness and brightness
  if (conversation.includes('dull') || conversation.includes('brightness') || conversation.includes('radiance') || conversation.includes('glow')) {
    needs.concerns.push('dullness');
  }
  
  // Dryness and hydration
  if (conversation.includes('dry') || conversation.includes('hydrat') || conversation.includes('moisture') || conversation.includes('dehydrat')) {
    needs.concerns.push('hydration');
  }
  
  // Aging and wrinkles
  if (conversation.includes('aging') || conversation.includes('wrinkle') || conversation.includes('fine line') || conversation.includes('anti-aging')) {
    needs.concerns.push('anti-aging');
  }
  
  // Dark spots and hyperpigmentation
  if (conversation.includes('dark spot') || conversation.includes('hyperpigmentation') || conversation.includes('pigmentation') || conversation.includes('uneven tone')) {
    needs.concerns.push('dark-spots');
  }
  
  // Dark circles - NEW
  if (conversation.includes('dark circle') || conversation.includes('under eye') || conversation.includes('eye bag') || conversation.includes('puffy eye')) {
    needs.concerns.push('dark-circles');
  }
  
  // Dry lips - NEW
  if (conversation.includes('dry lip') || conversation.includes('chapped lip') || conversation.includes('cracked lip') || conversation.includes('lip care')) {
    needs.concerns.push('dry-lips');
  }
  
  // Redness and sensitivity
  if (conversation.includes('redness') || conversation.includes('irritation') || conversation.includes('inflammation') || conversation.includes('red face')) {
    needs.concerns.push('redness');
  }
  
  // Pores
  if (conversation.includes('large pore') || conversation.includes('pore') || conversation.includes('blackhead') || conversation.includes('whitehead')) {
    needs.concerns.push('pores');
  }
  
  // Sun damage
  if (conversation.includes('sun damage') || conversation.includes('sun spot') || conversation.includes('photo aging') || conversation.includes('uv damage')) {
    needs.concerns.push('sun-damage');
  }
  
  // Texture and roughness
  if (conversation.includes('rough') || conversation.includes('texture') || conversation.includes('bumpy') || conversation.includes('uneven skin')) {
    needs.concerns.push('texture');
  }
  
  // Scarring
  if (conversation.includes('scar') || conversation.includes('acne mark') || conversation.includes('post-inflammatory')) {
    needs.concerns.push('scarring');
  }

  console.log('Extracted skincare needs:', needs);
  return needs;
}

module.exports = {
  getChatResponse,
  extractSkincareNeeds
};