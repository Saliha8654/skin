// Load environment variables first
require('dotenv').config({ path: './backend/.env' });

const { extractSkincareNeeds } = require('./backend/src/services/openai');
const { recommendProductsByCollection } = require('./backend/src/services/shopify');

async function testFaceMaskFix() {
  console.log('Testing face mask collection fix...');
  
  // Test mask detection
  console.log('\n1. Testing "face mask" detection...');
  const messages = [{ role: 'user', content: "face mask" }];
  const needs = extractSkincareNeeds(messages);
  console.log(`Detected collection: ${needs.collection}`);
  
  // Test recommendations from the correct mask collection
  console.log('\n2. Testing recommendations from step-7-mask collection (new mapping for masks)...');
  const maskProducts = await recommendProductsByCollection('step-7-mask', needs);
  console.log(`Found ${maskProducts.products.length} products in step-7-mask collection for mask query:`);
  maskProducts.products.forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.title} - £${product.price}`);
  });
  
  // Test other mask-related queries
  console.log('\n3. Testing "sheet mask" detection...');
  const sheetMaskMessages = [{ role: 'user', content: "sheet mask" }];
  const sheetMaskNeeds = extractSkincareNeeds(sheetMaskMessages);
  console.log(`Detected collection: ${sheetMaskNeeds.collection}`);
  
  console.log('\n4. Testing recommendations from step-7-mask for sheet mask...');
  const sheetMaskProducts = await recommendProductsByCollection('step-7-mask', sheetMaskNeeds);
  console.log(`Found ${sheetMaskProducts.products.length} products in step-7-mask collection for sheet mask query:`);
  sheetMaskProducts.products.forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.title} - £${product.price}`);
  });
  
  console.log('\n✅ Face mask fix test completed!');
}

// Run the test
testFaceMaskFix();