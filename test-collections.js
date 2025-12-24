const { getCollections, getProductsByCollection, recommendProductsByCollection } = require('./backend/src/services/shopify');

async function testCollections() {
  console.log('Testing collection functionality...');
  
  try {
    // Test getting collections
    console.log('\n1. Testing getCollections...');
    const collections = await getCollections(5);
    console.log(`Found ${collections.length} collections`);
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.title} (${collection.handle}) - ${collection.products.length} products`);
    });
    
    // Test getting products by collection (if any collections exist)
    if (collections.length > 0) {
      console.log('\n2. Testing getProductsByCollection...');
      const firstCollection = collections[0];
      console.log(`Testing with collection: ${firstCollection.title}`);
      
      const collectionProducts = await getProductsByCollection(firstCollection.handle, 3);
      console.log(`Found ${collectionProducts.products.length} products in collection '${collectionProducts.collection.title}'`);
      collectionProducts.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} - £${product.price}`);
      });
    }
    
    // Test collection-based recommendations (if any collections exist)
    if (collections.length > 0) {
      console.log('\n3. Testing recommendProductsByCollection...');
      const firstCollection = collections[0];
      console.log(`Testing recommendations for collection: ${firstCollection.title}`);
      
      const result = await recommendProductsByCollection(firstCollection.handle, {
        skinType: 'normal',
        concerns: ['hydration']
      });
      
      console.log(`Found ${result.products.length} recommended products in collection '${result.collection.title}'`);
      result.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} - £${product.price}`);
      });
    }
    
    console.log('\n✅ Collection functionality test completed successfully!');
  } catch (error) {
    console.error('❌ Error during collection functionality test:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testCollections();