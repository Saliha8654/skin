require('dotenv').config({ path: './backend/.env' });
const { recommendProductsByCollection } = require('./backend/src/services/shopify');

async function testCollectionRecommendations() {
  console.log('Testing Collection-Based Recommendations with Tag Fallback');
  console.log('========================================================');
  
  // Test case 1: EYE CARE collection with dark circles concern
  console.log('\n1. Testing EYE CARE collection with dark circles concern:');
  try {
    const needs = {
      concerns: ['dark circles']
    };
    const products = await recommendProductsByCollection('step-8-eye-care', needs);
    console.log(`   Found ${products.products.length} products in EYE CARE collection for dark circles`);
    products.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 2: LIP CARE collection with dry lips concern
  console.log('\n2. Testing LIP CARE collection with dry lips concern:');
  try {
    const needs = {
      concerns: ['dry lips']
    };
    const products = await recommendProductsByCollection('lip-care', needs);
    console.log(`   Found ${products.products.length} products in LIP CARE collection for dry lips`);
    products.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 3: MASK collection with face mask concern
  console.log('\n3. Testing MASK collection with face mask concern:');
  try {
    const needs = {
      concerns: ['mask']
    };
    const products = await recommendProductsByCollection('step-7-mask', needs);
    console.log(`   Found ${products.products.length} products in MASK collection for face masks`);
    products.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 4: Testing with no specific needs (should return collection products)
  console.log('\n4. Testing EYE CARE collection with no specific needs:');
  try {
    const products = await recommendProductsByCollection('step-8-eye-care', {});
    console.log(`   Found ${products.products.length} products in EYE CARE collection (no specific needs)`);
    products.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\nTest completed!');
}

testCollectionRecommendations();