// Load environment variables first
require('dotenv').config({ path: './backend/.env' });

const { extractSkincareNeeds } = require('./backend/src/services/openai');

async function testCollectionDetection() {
  console.log('Testing collection detection logic...');
  
  // Test cases for different collections
  const testCases = [
    { message: "I want a vitamin c serum", expectedCollection: "VITAMIN C" },
    { message: "Recommend overnight masks", expectedCollection: "OVERNIGHT MASKS" },
    { message: "I need a moisturizer for dry skin", expectedCollection: "MOISTURIZER" },
    { message: "Show me retinol products", expectedCollection: "RETINOL" },
    { message: "I have acne concerns", expectedCollection: "ACNE" },
    { message: "I want brightening products", expectedCollection: "BRIGHTENING" },
    { message: "Water-based cleanser for combination skin", expectedCollection: "WATER-BASED CLEANSER" },
    { message: "Oil cleanser for my face", expectedCollection: "OIL CLEANSER" },
    { message: "Anti-ageing products", expectedCollection: "ANTI-AGEING" },
    { message: "Facial oil recommendations", expectedCollection: "FACIAL OIL" },
    { message: "Eye cream for dark circles", expectedCollection: "EYE CARE" },
    { message: "Lip balm for dry lips", expectedCollection: "LIP CARE" },
    { message: "AHA BHA exfoliating products", expectedCollection: "AHA/BHA" }
  ];
  
  console.log('\nRunning collection detection tests...\n');
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const messages = [{ role: 'user', content: testCase.message }];
    const needs = extractSkincareNeeds(messages);
    
    const result = needs.collection === testCase.expectedCollection ? '✅ PASS' : '❌ FAIL';
    console.log(`${i + 1}. Message: "${testCase.message}"`);
    console.log(`   Expected: ${testCase.expectedCollection}, Got: ${needs.collection} - ${result}`);
    if (needs.skinType) {
      console.log(`   Skin Type Detected: ${needs.skinType}`);
    }
    console.log('');
  }
  
  console.log('✅ Collection detection test completed!');
}

// Run the test
testCollectionDetection();