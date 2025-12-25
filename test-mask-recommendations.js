// Load environment variables first
require('dotenv').config({ path: './backend/.env' });

const { extractSkincareNeeds } = require('./backend/src/services/openai');
const { recommendProductsByCollection, getCollections } = require('./backend/src/services/shopify');

async function testMaskRecommendations() {
  console.log('Testing mask product recommendations...');
  
  // First, let's see all available collections
  try {
    console.log('\n1. Fetching all collections...');
    const collections = await getCollections(20);
    console.log(`Found ${collections.length} collections:`);
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.title} (${collection.handle}) - ${collection.products.length} products`);
    });
    
    // Test mask detection
    console.log('\n2. Testing "face mask" detection...');
    const messages = [{ role: 'user', content: "face mask" }];
    const needs = extractSkincareNeeds(messages);
    console.log(`Detected collection: ${needs.collection}`);
    
    // Test recommendations from the general skin-care collection
    console.log('\n3. Testing recommendations from skin-care collection (current mapping for masks)...');
    const skinCareProducts = await recommendProductsByCollection('skin-care', needs);
    console.log(`Found ${skinCareProducts.products.length} products in skin-care collection for mask query:`);
    skinCareProducts.products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} - £${product.price}`);
    });
    
    // Test recommendations from other collections that might have masks
    console.log('\n4. Testing recommendations from step-3-exfoliator collection (might have masks)...');
    const exfoliatorProducts = await recommendProductsByCollection('step-3-exfoliator', needs);
    console.log(`Found ${exfoliatorProducts.products.length} products in step-3-exfoliator collection for mask query:`);
    exfoliatorProducts.products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} - £${product.price}`);
    });
    
    // Test recommendations from new-arrival collection
    console.log('\n5. Testing recommendations from new-arrival collection...');
    const newArrivalProducts = await recommendProductsByCollection('new-arrival', needs);
    console.log(`Found ${newArrivalProducts.products.length} products in new-arrival collection for mask query:`);
    newArrivalProducts.products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} - £${product.price}`);
    });
    
  } catch (error) {
    console.error('Error testing mask recommendations:', error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('\n✅ Mask recommendation test completed!');
}

// Run the test
testMaskRecommendations();