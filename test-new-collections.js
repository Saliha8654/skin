// Load environment variables first
require('dotenv').config({ path: './backend/.env' });

const { recommendProductsByCollections } = require('./backend/src/services/shopify');

async function testNewCollectionRecommendations() {
  console.log('Testing new collection-based recommendation functionality...');
  console.log('Shopify Domain:', process.env.SHOPIFY_STORE_DOMAIN);
  console.log('Shopify Token exists:', !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
  
  try {
    // Test 1: Recommend products for oily skin
    console.log('\n1. Testing recommendations for oily skin...');
    const oilySkinProducts = await recommendProductsByCollections({
      skinType: 'oily',
      concerns: ['acne']
    });
    console.log(`Found ${oilySkinProducts.length} products for oily skin with acne concerns:`);
    oilySkinProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - £${product.price}`);
    });
    
    // Test 2: Recommend products for dry skin
    console.log('\n2. Testing recommendations for dry skin...');
    const drySkinProducts = await recommendProductsByCollections({
      skinType: 'dry',
      concerns: ['hydration']
    });
    console.log(`Found ${drySkinProducts.length} products for dry skin with hydration concerns:`);
    drySkinProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - £${product.price}`);
    });
    
    // Test 3: Recommend products for anti-aging
    console.log('\n3. Testing recommendations for anti-aging...');
    const antiAgingProducts = await recommendProductsByCollections({
      skinType: 'normal',
      concerns: ['anti-aging']
    });
    console.log(`Found ${antiAgingProducts.length} products for anti-aging:`);
    antiAgingProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - £${product.price}`);
    });
    
    // Test 4: Recommend products for brightening
    console.log('\n4. Testing recommendations for brightening...');
    const brighteningProducts = await recommendProductsByCollections({
      skinType: 'normal',
      concerns: ['dullness']
    });
    console.log(`Found ${brighteningProducts.length} products for brightening:`);
    brighteningProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - £${product.price}`);
    });
    
    console.log('\n✅ New collection-based recommendation functionality test completed successfully!');
  } catch (error) {
    console.error('❌ Error during new collection-based recommendation test:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testNewCollectionRecommendations();