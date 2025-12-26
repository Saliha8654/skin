require('dotenv').config({ path: './backend/.env' });
const { extractSkincareNeeds } = require('./backend/src/services/openai');
const { recommendProductsByCollection } = require('./backend/src/services/shopify');

async function testSkinTypeDetection() {
  console.log('Testing Skin Type Detection and Collection Mapping');
  console.log('================================================');
  
  // Test case 1: Oily skin
  console.log('\n1. Testing "oily skin" detection:');
  try {
    const messages = [
      { role: "user", content: "I have oily skin and want to find good products" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.collection) {
      const collectionHandle = needs.collection.replace(/\s+/g, '-').toLowerCase();
      console.log(`   Mapped to collection: ${needs.collection} -> ${collectionHandle}`);
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 2: Dry skin
  console.log('\n2. Testing "dry skin" detection:');
  try {
    const messages = [
      { role: "user", content: "My skin is very dry and flaky" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.collection) {
      const collectionHandle = needs.collection.replace(/\s+/g, '-').toLowerCase();
      console.log(`   Mapped to collection: ${needs.collection} -> ${collectionHandle}`);
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 3: Combination skin
  console.log('\n3. Testing "combination skin" detection:');
  try {
    const messages = [
      { role: "user", content: "I have combination skin with oily T-zone" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.collection) {
      const collectionHandle = needs.collection.replace(/\s+/g, '-').toLowerCase();
      console.log(`   Mapped to collection: ${needs.collection} -> ${collectionHandle}`);
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 4: Sensitive skin
  console.log('\n4. Testing "sensitive skin" detection:');
  try {
    const messages = [
      { role: "user", content: "I have sensitive skin that gets irritated easily" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.collection) {
      const collectionHandle = needs.collection.replace(/\s+/g, '-').toLowerCase();
      console.log(`   Mapped to collection: ${needs.collection} -> ${collectionHandle}`);
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 5: Normal skin
  console.log('\n5. Testing "normal skin" detection:');
  try {
    const messages = [
      { role: "user", content: "I have normal skin and looking for general skincare" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    if (needs.collection) {
      const collectionHandle = needs.collection.replace(/\s+/g, '-').toLowerCase();
      console.log(`   Mapped to collection: ${needs.collection} -> ${collectionHandle}`);
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 6: Testing collection-based recommendations for skin types
  console.log('\n6. Testing collection-based recommendations for dry skin:');
  try {
    const needs = {
      skinType: 'dry',
      concerns: ['hydration'],
      collection: 'DRY SKIN'
    };
    
    const products = await recommendProductsByCollection('dry-skin', needs);
    console.log(`   Found ${products.products.length} products for dry skin collection`);
    products.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n✅ Skin type detection test completed!');
}

testSkinTypeDetection();