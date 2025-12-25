require('dotenv').config();
const { getCollections } = require('./backend/src/services/shopify');

async function testCollections() {
  try {
    console.log('Fetching collections from Shopify store...');
    const collections = await getCollections(20);
    
    console.log('\nAvailable collections in your Shopify store:');
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. Title: "${collection.title}" | Handle: "${collection.handle}"`);
    });
    
    console.log('\nCollection mapping for reference:');
    console.log('Title -> Handle');
    collections.forEach(collection => {
      console.log(`"${collection.title}" -> "${collection.handle}"`);
    });
  } catch (error) {
    console.error('Error fetching collections:', error.message);
  }
}

testCollections();