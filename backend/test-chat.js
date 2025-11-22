const { getChatResponse } = require('./src/services/openai');

async function testChat() {
  console.log('Testing chat functionality...');
  
  // Test 1: Initial greeting
  console.log('\n=== Test 1: Initial greeting ===');
  const test1 = await getChatResponse([]);
  console.log('Result:', test1);
  
  // Test 2: First user message
  console.log('\n=== Test 2: First user message ===');
  const test2 = await getChatResponse([
    { role: 'user', content: 'I have oily skin and acne' }
  ]);
  console.log('Result:', test2);
  
  // Test 3: Second user message
  console.log('\n=== Test 3: Second user message ===');
  const test3 = await getChatResponse([
    { role: 'user', content: 'I have oily skin and acne' },
    { role: 'assistant', content: 'I understand, acne can be frustrating! 😊 What\'s your skin type? Is it oily, dry, combination, or sensitive?' },
    { role: 'user', content: 'It\'s very oily' }
  ]);
  console.log('Result:', test3);
  
  // Test 4: Third user message
  console.log('\n=== Test 4: Third user message ===');
  const test4 = await getChatResponse([
    { role: 'user', content: 'I have oily skin and acne' },
    { role: 'assistant', content: 'I understand, acne can be frustrating! 😊 What\'s your skin type? Is it oily, dry, combination, or sensitive?' },
    { role: 'user', content: 'It\'s very oily' },
    { role: 'assistant', content: 'Got it! Oily skin needs balance. ✨ What type of products do you usually prefer - gel-based or cream-based?' },
    { role: 'user', content: 'I prefer gel-based products' }
  ]);
  console.log('Result:', test4);
}

testChat().catch(console.error);