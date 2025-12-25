// Test script to verify collection mappings are working properly
const { extractSkincareNeeds } = require('./backend/src/services/openai');

// Test various user queries to see what collections they map to
const testQueries = [
  // Step-based collections
  "I need an oil cleanser",
  "Looking for a water-based cleanser",
  "I want a good toner",
  "Recommend essence products",
  "I need a serum or ampoule",
  "I want to try a face mask",
  "I need an eye cream",
  "Looking for moisturizer",
  "I need sunscreen",
  
  // Active ingredients
  "I want products with AHA/BHA",
  "Looking for retinol products",
  "I need rice-based skincare",
  "Recommend vitamin C products",
  
  // Skin concerns
  "I have acne and need help",
  "I have redness and inflammation",
  "I want brightening products",
  "I need anti-ageing products",
  
  // Skincare trends
  "I want overnight masks",
  "Looking for facial oils",
  "I need lip care products",
  "Recommend travel kit/minis",
  
  // Skin types
  "I have combination skin",
  "I have oily skin",
  "I have dry skin",
  "I have normal skin",
  "I have sensitive skin"
];

console.log("Testing collection mappings for various user queries:\n");

testQueries.forEach((query, index) => {
  const needs = extractSkincareNeeds([{role: 'user', content: query}]);
  console.log(`${index + 1}. Query: "${query}"`);
  console.log(`   Extracted needs:`, needs);
  console.log('');
});

// Test the collection mapping from chat.js
console.log("Testing collection handle mappings:\n");

// This is the same mapping from chat.js
const collectionHandleMap = {
  'OIL CLEANSER': 'step-1',
  'WATER-BASED CLEANSER': 'step-2-water-based-cleanser',
  'ALL KOREAN SKIN CARE': 'skin-care',
  'MOISTURIZER': 'step-9-moisturizer',
  'TONER': 'step-3-toner',
  'SERUM/AMPOULE': 'step-6-serum-ampoule',
  'SUN SCREEN': 'step-10-suncream',
  'MASK': 'step-7-mask',
  'EYE CARE': 'step-8-eye-care',
  'LIP CARE': 'lip-care',
  'EXFOLIATOR': 'step-3-exfoliator',
  'AHA/BHA': 'step-3-exfoliator',
  'ESSENCE': 'step-5-essence',
  'RETINOL': 'retinol',
  'VITAMIN C': 'vitamin-c',
  'RICE': 'rice',
  'ACNE': 'acne',
  'REDNESS/INFLAMMATION': 'redness-inflamation',
  'BRIGHTENING': 'brightening',
  'ANTI-AGEING': 'anti-ageing',
  'OVERNIGHT MASKS': 'overnight-masks',
  'FACIAL OIL': 'facial-oil',
  'TRAVEL KIT/MINI': 'travel-kit',
  'COMBINATION SKIN': 'combination-skin',
  'OILY SKIN': 'oily-skin',
  'DRY SKIN': 'dry-skin',
  'NORMAL SKIN': 'normal-skin',
  'SENSITIVE SKIN': 'redness-inflamation'
};

console.log("Collection Name -> Shopify Collection Handle:");
Object.entries(collectionHandleMap).forEach(([collectionName, handle]) => {
  console.log(`"${collectionName}" -> "${handle}"`);
});

console.log('\nTotal mapped collections:', Object.keys(collectionHandleMap).length);