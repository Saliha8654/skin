require('dotenv').config({ path: './backend/.env' });
const { extractSkincareNeeds } = require('./backend/src/services/openai');
const { recommendProductsByCollections } = require('./backend/src/services/shopify');

async function testFullPipeline() {
  console.log('Testing Full Pipeline: AI Detection + Tag-Based Recommendations');
  console.log('=============================================================');
  
  // Test case 1: User mentions "dark circles"
  console.log('\n1. Testing user query: "I have dark circles under my eyes"');
  try {
    const messages = [
      { role: "user", content: "I have dark circles under my eyes" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.concerns && needs.concerns.length > 0) {
      const products = await recommendProductsByCollections(needs);
      console.log(`   Found ${products.length} products for dark circles`);
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
      });
    } else {
      console.log('   No concerns detected');
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 2: User mentions "dry lips"
  console.log('\n2. Testing user query: "My lips are very dry and chapped"');
  try {
    const messages = [
      { role: "user", content: "My lips are very dry and chapped" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.concerns && needs.concerns.length > 0) {
      const products = await recommendProductsByCollections(needs);
      console.log(`   Found ${products.length} products for dry lips`);
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
      });
    } else {
      console.log('   No concerns detected');
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 3: User mentions multiple concerns
  console.log('\n3. Testing user query: "I have acne and want to hydrate my skin"');
  try {
    const messages = [
      { role: "user", content: "I have acne and want to hydrate my skin" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.concerns && needs.concerns.length > 0) {
      const products = await recommendProductsByCollections(needs);
      console.log(`   Found ${products.length} products for acne and hydration`);
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
      });
    } else {
      console.log('   No concerns detected');
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 4: User mentions skin type and concern
  console.log('\n4. Testing user query: "I have dry skin and want anti-aging products"');
  try {
    const messages = [
      { role: "user", content: "I have dry skin and want anti-aging products" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.concerns && needs.concerns.length > 0) {
      const products = await recommendProductsByCollections(needs);
      console.log(`   Found ${products.length} products for dry skin and anti-aging`);
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
      });
    } else {
      console.log('   No concerns detected');
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\nFull pipeline test completed!');
}

testFullPipeline();