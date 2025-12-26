require('dotenv').config({ path: './backend/.env' });
const { extractSkincareNeeds } = require('./backend/src/services/openai');
const { recommendProductsByCollection, recommendProductsByCollections } = require('./backend/src/services/shopify');

async function testMaskRecommendations() {
  console.log('Testing Face Mask Recommendations');
  console.log('=================================');
  
  // Test case 1: Test the full pipeline for face mask
  console.log('\n1. Testing full pipeline for "face mask":');
  try {
    const messages = [
      { role: "user", content: "I want to try a face mask" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    // Test collection-based recommendation
    if (needs.collection === 'MASK') {
      const products = await recommendProductsByCollection('step-7-mask', needs);
      console.log(`   Found ${products.products.length} products for MASK collection`);
      products.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
      });
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 2: Test the general recommendation function
  console.log('\n2. Testing general recommendation for mask needs:');
  try {
    const needs = {
      skinType: 'normal',
      concerns: [],
      collection: 'MASK'
    };
    
    const products = await recommendProductsByCollections(needs);
    console.log(`   Found ${products.length} products via general recommendation`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 3: Test with specific concerns
  console.log('\n3. Testing "hydrating face mask":');
  try {
    const messages = [
      { role: "user", content: "I want a hydrating face mask" }
    ];
    const needs = extractSkincareNeeds(messages);
    console.log('   Extracted needs:', JSON.stringify(needs, null, 2));
    
    // Test collection-based recommendation with concerns
    if (needs.collection === 'MASK') {
      const products = await recommendProductsByCollection('step-7-mask', needs);
      console.log(`   Found ${products.products.length} hydrating mask products`);
      products.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
      });
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 4: Test tag-based search for masks
  console.log('\n4. Testing tag-based search for masks:');
  try {
    const needs = {
      skinType: 'normal',
      concerns: ['mask']
    };
    
    const products = await recommendProductsByCollections(needs);
    console.log(`   Found ${products.length} products via tag-based search for masks`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\n✅ Mask recommendation test completed!');
}

testMaskRecommendations();