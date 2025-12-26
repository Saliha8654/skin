require('dotenv').config({ path: './backend/.env' });
const { recommendProductsByCollections } = require('./backend/src/services/shopify');

async function testTagRecommendations() {
  console.log('Testing Tag-Based Recommendations');
  console.log('================================');
  
  // Test case 1: Dark circles concern
  console.log('\n1. Testing "dark circles" concern:');
  try {
    const darkCirclesNeeds = {
      concerns: ['dark circles']
    };
    const darkCirclesProducts = await recommendProductsByCollections(darkCirclesNeeds);
    console.log(`   Found ${darkCirclesProducts.length} products for dark circles`);
    darkCirclesProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 2: Dry lips concern
  console.log('\n2. Testing "dry lips" concern:');
  try {
    const dryLipsNeeds = {
      concerns: ['dry lips']
    };
    const dryLipsProducts = await recommendProductsByCollections(dryLipsNeeds);
    console.log(`   Found ${dryLipsProducts.length} products for dry lips`);
    dryLipsProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 3: Multiple concerns
  console.log('\n3. Testing multiple concerns (acne and hydration):');
  try {
    const multiNeeds = {
      concerns: ['acne', 'hydration']
    };
    const multiProducts = await recommendProductsByCollections(multiNeeds);
    console.log(`   Found ${multiProducts.length} products for acne and hydration`);
    multiProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test case 4: Skin type + concern
  console.log('\n4. Testing skin type + concern (dry skin + anti-aging):');
  try {
    const combinedNeeds = {
      skinType: 'dry',
      concerns: ['anti-aging']
    };
    const combinedProducts = await recommendProductsByCollections(combinedNeeds);
    console.log(`   Found ${combinedProducts.length} products for dry skin and anti-aging`);
    combinedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} ${product.currency}`);
    });
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  console.log('\nTest completed!');
}

testTagRecommendations();