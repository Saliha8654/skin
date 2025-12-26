require('dotenv').config({ path: './backend/.env' });
const { extractSkincareNeeds } = require('./backend/src/services/openai');
const { recommendProductsByCollection } = require('./backend/src/services/shopify');

async function testLipCare() {
  console.log('Testing Lip Care Detection and Recommendations');
  console.log('==============================================');
  
  // Test case 1: Basic "lip care" query
  console.log('\n1. Testing "lip care" detection:');
  try {
    const messages = [
      { role: "user", content: "I want lip care products" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.collection === 'LIP CARE') {
      console.log('   ✅ Lip care collection detected');
      
      // Test the actual recommendations
      const products = await recommendProductsByCollection('lip-care', needs);
      console.log(`   Found ${products.products.length} lip care products:`);
      products.products.forEach((product, index) => {
        console.log(`     ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
      });
    } else {
      console.log(`   ❌ Expected LIP CARE, got ${needs.collection}`);
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 2: "lip balm" query
  console.log('\n2. Testing "lip balm" detection:');
  try {
    const messages = [
      { role: "user", content: "I need a good lip balm" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.collection === 'LIP CARE') {
      console.log('   ✅ Lip balm correctly mapped to LIP CARE collection');
    } else {
      console.log(`   ❌ Expected LIP CARE, got ${needs.collection}`);
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 3: "dry lips" query
  console.log('\n3. Testing "dry lips" detection:');
  try {
    const messages = [
      { role: "user", content: "My lips are dry and chapped" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.collection === 'LIP CARE') {
      console.log('   ✅ Dry lips correctly mapped to LIP CARE collection');
    } else {
      console.log(`   ❌ Expected LIP CARE, got ${needs.collection}`);
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 4: Direct lip care collection test
  console.log('\n4. Testing direct lip care collection access:');
  try {
    const needs = {
      skinType: 'normal',
      concerns: ['dry-lips'],
      collection: 'LIP CARE'
    };
    
    const products = await recommendProductsByCollection('lip-care', needs);
    console.log(`   Found ${products.products.length} products in lip care collection:`);
    products.products.forEach((product, index) => {
      console.log(`     ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n✅ Lip care detection test completed!');
}

testLipCare();