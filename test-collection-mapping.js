// Load environment variables first
require('dotenv').config({ path: './backend/.env' });

const { extractSkincareNeeds } = require('./backend/src/services/openai');
const { recommendProductsByCollection } = require('./backend/src/services/shopify');

async function testCollectionMapping() {
  console.log('Testing collection mapping logic...');
  
  // Test the collection handle mapping
  const collectionHandleMap = {
    'OIL CLEANSER': 'step-1',
    'WATER-BASED CLEANSER': 'step-2-water-based-cleanser',
    'ALL KOREAN SKIN CARE': 'skin-care',
    'MOISTURIZER': 'skin-care',
    'TONER': 'skin-care',
    'SERUM/AMPOULE': 'skin-care',
    'SUN SCREEN': 'skin-care',
    'MASK': 'skin-care',
    'EYE CARE': 'skin-care',
    'LIP CARE': 'skin-care',
    'AHA/BHA': 'step-3-exfoliator',
    'RETINOL': 'skin-care',
    'VITAMIN C': 'skin-care',
    'RICE': 'skin-care',
    'ACNE': 'skin-care',
    'REDNESS/INFLAMMATION': 'skin-care',
    'BRIGHTENING': 'skin-care',
    'ANTI-AGEING': 'skin-care',
    'OVERNIGHT MASKS': 'skin-care',
    'FACIAL OIL': 'skin-care',
    'TRAVEL KIT/MINI': 'skin-care'
  };
  
  console.log('\nTesting collection name to handle mapping...\n');
  
  // Test cases for different collections
  const testCases = [
    { message: "I want a vitamin c serum", expectedCollection: "VITAMIN C", expectedHandle: "skin-care" },
    { message: "Recommend overnight masks", expectedCollection: "OVERNIGHT MASKS", expectedHandle: "skin-care" },
    { message: "I need a moisturizer for dry skin", expectedCollection: "MOISTURIZER", expectedHandle: "skin-care" },
    { message: "Show me retinol products", expectedCollection: "RETINOL", expectedHandle: "skin-care" },
    { message: "I have acne concerns", expectedCollection: "ACNE", expectedHandle: "skin-care" },
    { message: "I want brightening products", expectedCollection: "BRIGHTENING", expectedHandle: "skin-care" },
    { message: "Water-based cleanser for combination skin", expectedCollection: "WATER-BASED CLEANSER", expectedHandle: "step-2-water-based-cleanser" },
    { message: "Oil cleanser for my face", expectedCollection: "OIL CLEANSER", expectedHandle: "step-1" },
    { message: "Anti-ageing products", expectedCollection: "ANTI-AGEING", expectedHandle: "skin-care" },
    { message: "Facial oil recommendations", expectedCollection: "FACIAL OIL", expectedHandle: "skin-care" },
    { message: "Eye cream for dark circles", expectedCollection: "EYE CARE", expectedHandle: "skin-care" },
    { message: "Lip balm for dry lips", expectedCollection: "LIP CARE", expectedHandle: "skin-care" },
    { message: "AHA BHA exfoliating products", expectedCollection: "AHA/BHA", expectedHandle: "step-3-exfoliator" }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const messages = [{ role: 'user', content: testCase.message }];
    const needs = extractSkincareNeeds(messages);
    
    const detectedCollection = needs.collection;
    const expectedHandle = collectionHandleMap[detectedCollection] || 'skin-care';
    const isCollectionCorrect = detectedCollection === testCase.expectedCollection;
    const isHandleCorrect = expectedHandle === testCase.expectedHandle;
    
    const collectionResult = isCollectionCorrect ? '✅' : '❌';
    const handleResult = isHandleCorrect ? '✅' : '❌';
    
    console.log(`${i + 1}. Message: "${testCase.message}"`);
    console.log(`   Detected Collection: ${detectedCollection} (Expected: ${testCase.expectedCollection}) - ${collectionResult}`);
    console.log(`   Mapped Handle: ${expectedHandle} (Expected: ${testCase.expectedHandle}) - ${handleResult}`);
    if (needs.skinType) {
      console.log(`   Skin Type Detected: ${needs.skinType}`);
    }
    console.log('');
  }
  
  // Test actual product recommendations with a specific collection
  console.log('Testing actual product recommendations...\n');
  
  try {
    console.log('Testing OIL CLEANSER collection (mapped to step-1)...');
    const oilCleanserProducts = await recommendProductsByCollection('step-1', { skinType: 'normal', concerns: [] });
    console.log(`Found ${oilCleanserProducts.products.length} products in OIL CLEANSER collection:`);
    oilCleanserProducts.products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} - £${product.price}`);
    });
    
    console.log('\nTesting WATER-BASED CLEANSER collection (mapped to step-2-water-based-cleanser)...');
    const waterCleanserProducts = await recommendProductsByCollection('step-2-water-based-cleanser', { skinType: 'normal', concerns: [] });
    console.log(`Found ${waterCleanserProducts.products.length} products in WATER-BASED CLEANSER collection:`);
    waterCleanserProducts.products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} - £${product.price}`);
    });
    
    console.log('\nTesting EXFOLIATOR collection (mapped to step-3-exfoliator for AHA/BHA)...');
    const exfoliatorProducts = await recommendProductsByCollection('step-3-exfoliator', { skinType: 'normal', concerns: [] });
    console.log(`Found ${exfoliatorProducts.products.length} products in EXFOLIATOR collection:`);
    exfoliatorProducts.products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} - £${product.price}`);
    });
    
  } catch (error) {
    console.error('Error testing product recommendations:', error.message);
  }
  
  console.log('\n✅ Collection mapping test completed!');
}

// Run the test
testCollectionMapping();