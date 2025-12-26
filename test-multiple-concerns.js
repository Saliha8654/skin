require('dotenv').config({ path: './backend/.env' });
const { extractSkincareNeeds } = require('./backend/src/services/openai');
const { recommendProductsByCollections } = require('./backend/src/services/shopify');

async function testMultipleConcerns() {
  console.log('Testing Multiple Concerns Detection and Recommendations');
  console.log('====================================================');
  
  // Test case 1: Multiple concerns in one query
  console.log('\n1. Testing "oily skin type and dry lips and dark circles":');
  try {
    const messages = [
      { role: "user", content: "I have oily skin type and dry lips and dark circles under my eyes" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    // Test recommendations based on multiple concerns
    const products = await recommendProductsByCollections(needs);
    console.log(`   Found ${products.length} products for multiple concerns:`);
    products.forEach((product, index) => {
      console.log(`     ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 2: Different multiple concerns
  console.log('\n2. Testing "dry skin and acne and want face masks":');
  try {
    const messages = [
      { role: "user", content: "I have dry skin and acne and want to try face masks" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    // Test recommendations based on multiple concerns
    const products = await recommendProductsByCollections(needs);
    console.log(`   Found ${products.length} products for multiple concerns:`);
    products.forEach((product, index) => {
      console.log(`     ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 3: Complex multiple concerns
  console.log('\n3. Testing "combination skin with dark circles and dry lips and acne":');
  try {
    const messages = [
      { role: "user", content: "I have combination skin with dark circles and dry lips and acne" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    // Test recommendations based on multiple concerns
    const products = await recommendProductsByCollections(needs);
    console.log(`   Found ${products.length} products for multiple concerns:`);
    products.forEach((product, index) => {
      console.log(`     ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 4: Sensitive skin with multiple concerns
  console.log('\n4. Testing "sensitive skin and hydration and anti-aging":');
  try {
    const messages = [
      { role: "user", content: "I have sensitive skin and need hydration and anti-aging products" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    // Test recommendations based on multiple concerns
    const products = await recommendProductsByCollections(needs);
    console.log(`   Found ${products.length} products for multiple concerns:`);
    products.forEach((product, index) => {
      console.log(`     ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 5: Testing specific combination - oily skin + dark circles + lip care
  console.log('\n5. Testing "oily skin and dark circles and lip care":');
  try {
    const messages = [
      { role: "user", content: "I have oily skin and dark circles and need lip care products" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    // Test recommendations based on multiple concerns
    const products = await recommendProductsByCollections(needs);
    console.log(`   Found ${products.length} products for multiple concerns:`);
    products.forEach((product, index) => {
      console.log(`     ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n✅ Multiple concerns test completed!');
}

testMultipleConcerns();