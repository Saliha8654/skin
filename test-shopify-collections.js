require('dotenv').config();
const axios = require('axios');

// Shopify configuration from environment variables
const SHOPIFY_STOREFRONT_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

// GraphQL query to get specific collection by handle
const GET_COLLECTION_BY_HANDLE = `
  query getCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;

// GraphQL query to get all collections
const GET_ALL_COLLECTIONS = `
  query getAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
        }
      }
    }
  }
`;

async function testCollection(handle) {
  try {
    console.log(`\nTesting collection: ${handle}`);
    
    const response = await axios.post(
      SHOPIFY_STOREFRONT_URL,
      {
        query: GET_COLLECTION_BY_HANDLE,
        variables: {
          handle: handle
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
        }
      }
    );

    const collection = response.data.data.collection;
    
    if (collection) {
      console.log(`✅ Collection found: "${collection.title}" (handle: ${collection.handle})`);
      console.log(`   Description: ${collection.description || 'No description'}`);
      console.log(`   Products in collection: ${collection.products.edges.length}`);
      
      if (collection.products.edges.length > 0) {
        console.log('   Sample products:');
        collection.products.edges.slice(0, 3).forEach((edge, index) => {
          const product = edge.node;
          console.log(`     ${index + 1}. ${product.title} - $${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`);
        });
      } else {
        console.log('   ❌ No products in this collection');
      }
    } else {
      console.log(`❌ Collection with handle "${handle}" not found`);
    }
    
    return collection;
  } catch (error) {
    console.error(`❌ Error testing collection ${handle}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

async function getAllCollections() {
  try {
    console.log('\nFetching all collections from your store...');
    
    const response = await axios.post(
      SHOPIFY_STOREFRONT_URL,
      {
        query: GET_ALL_COLLECTIONS,
        variables: {
          first: 50
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
        }
      }
    );

    const collections = response.data.data.collections.edges;
    console.log(`\nFound ${collections.length} collections in your store:`);
    
    collections.forEach((edge, index) => {
      const collection = edge.node;
      console.log(`${index + 1}. "${collection.title}" (handle: ${collection.handle})`);
    });
    
    return collections.map(edge => edge.node);
  } catch (error) {
    console.error('❌ Error fetching all collections:', error.message);
    return [];
  }
}

async function main() {
  console.log('Testing Shopify Collections');
  console.log('========================');
  
  // Check if required environment variables are set
  if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.log('❌ Shopify environment variables not configured');
    console.log('Please ensure SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are set in your .env file');
    return;
  }
  
  console.log(`Testing against store: ${process.env.SHOPIFY_STORE_DOMAIN}`);
  
  // Test the specific collections that are having issues
  await testCollection('step-8-eye-care');
  await testCollection('lip-care');
  
  // Also test some other common collections
  await testCollection('step-7-mask'); // This should work based on previous fixes
  await testCollection('skin-care');   // General collection
  
  // Get all collections to see what's available
  await getAllCollections();
}

main();