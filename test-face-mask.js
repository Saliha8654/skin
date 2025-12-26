require('dotenv').config({ path: './backend/.env' });
const { extractSkincareNeeds } = require('./backend/src/services/openai');
const { recommendProductsByCollection } = require('./backend/src/services/shopify');

async function testFaceMaskDetection() {
  console.log('Testing Face Mask Detection and Recommendations');
  console.log('===============================================');
  
  // Test case 1: Basic face mask query
  console.log('\n1. Testing "face mask" detection:');
  try {
    const messages = [
      { role: "user", content: "I want to try a face mask" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 2: Sheet mask query
  console.log('\n2. Testing "sheet mask" detection:');
  try {
    const messages = [
      { role: "user", content: "I want to try a sheet mask" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 3: Clay mask query
  console.log('\n3. Testing "clay mask" detection:');
  try {
    const messages = [
      { role: "user", content: "I want to try a clay mask" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 4: Overnight mask query
  console.log('\n4. Testing "overnight mask" detection:');
  try {
    const messages = [
      { role: "user", content: "I want to try an overnight mask" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 5: Get products from mask collection directly
  console.log('\n5. Testing direct mask collection access:');
  try {
    const products = await recommendProductsByCollection('step-7-mask', {});
    console.log(`   Found ${products.products.length} products in mask collection`);
    products.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 6: Testing with hydration concern for masks
  console.log('\n6. Testing "hydrating face mask":');
  try {
    const messages = [
      { role: "user", content: "I want a hydrating face mask" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.collection) {
      console.log(`   Collection detected: ${needs.collection}`);
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n✅ Face mask detection test completed!');
}

testFaceMaskDetection();