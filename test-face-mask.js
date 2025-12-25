// Load environment variables first
require('dotenv').config({ path: './backend/.env' });

const { extractSkincareNeeds } = require('./backend/src/services/openai');

async function testFaceMaskDetection() {
  console.log('Testing "face mask" collection detection...');
  
  const messages = [{ role: 'user', content: "face mask" }];
  const needs = extractSkincareNeeds(messages);
  
  console.log('Extracted skincare needs:', JSON.stringify(needs, null, 2));
  
  if (needs.collection === 'MASK') {
    console.log('✅ "face mask" correctly detected as MASK collection');
  } else {
    console.log(`❌ "face mask" detected as ${needs.collection} instead of MASK`);
  }
  
  // Test other mask-related phrases
  const testPhrases = [
    "face mask",
    "sheet mask", 
    "mask sheet",
    "masks",
    "clay mask",
    "peel off mask"
  ];
  
  console.log('\nTesting various mask phrases:');
  for (const phrase of testPhrases) {
    const testMessages = [{ role: 'user', content: phrase }];
    const testNeeds = extractSkincareNeeds(testMessages);
    const result = testNeeds.collection === 'MASK' ? '✅' : '❌';
    console.log(`${result} "${phrase}" -> ${testNeeds.collection}`);
  }
}

// Run the test
testFaceMaskDetection();