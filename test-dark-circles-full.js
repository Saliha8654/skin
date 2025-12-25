// Full test to verify dark circles collection mapping works end-to-end
require('dotenv').config();
const { extractSkincareNeeds } = require('./backend/src/services/openai');

// Test the collection mapping from the chat route
const collectionHandleMap = {
  'OIL CLEANSER': 'step-1',
  'WATER-BASED CLEANSER': 'step-2-water-based-cleanser',
  'ALL KOREAN SKIN CARE': 'skin-care',
  'MOISTURIZER': 'step-9-moisturizer',
  'TONER': 'step-3-toner',
  'SERUM/AMPOULE': 'step-6-serum-ampoule',
  'SUN SCREEN': 'step-10-suncream',
  'MASK': 'step-7-mask',
  'EYE CARE': 'step-8-eye-care',  // This should be the handle for dark circles
  'LIP CARE': 'lip-care',
  'EXFOLIATOR': 'step-3-exfoliator',
  'AHA/BHA': 'step-3-exfoliator',
  'ESSENCE': 'step-5-essence',
  'RETINOL': 'retinol',
  'VITAMIN C': 'vitamin-c',
  'RICE': 'rice',
  'ACNE': 'acne',
  'REDNESS/INFLAMMATION': 'skin-care',
  'BRIGHTENING': 'brightening',
  'ANTI-AGEING': 'anti-ageing',
  'OVERNIGHT MASKS': 'step-7-mask',  // Updated to use mask collection
  'FACIAL OIL': 'skin-care',
  'TRAVEL KIT/MINI': 'skin-care',
  'COMBINATION SKIN': 'combination-skin',
  'OILY SKIN': 'oily-skin',
  'DRY SKIN': 'dry-skin',
  'NORMAL SKIN': 'normal-skin',
  'SENSITIVE SKIN': 'skin-care'
};

console.log('Testing end-to-end dark circles collection mapping:\n');

// Test the query
const darkCirclesQuery = [{role: 'user', content: 'I have dark circles under my eyes'}];
const needs = extractSkincareNeeds(darkCirclesQuery);

console.log('1. Extracted needs from query:');
console.log('   Query: "I have dark circles under my eyes"');
console.log('   Needs:', needs);
console.log('');

// Check collection mapping
const collectionHandle = collectionHandleMap[needs.collection] || 'skin-care';

console.log('2. Collection mapping:');
console.log('   Detected collection:', needs.collection);
console.log('   Mapped to handle:', collectionHandle);
console.log('');

// Verify EYE CARE maps correctly
if (needs.collection === 'EYE CARE') {
  console.log('✅ SUCCESS: "dark circles" correctly maps to EYE CARE collection');
  console.log('✅ SUCCESS: EYE CARE collection maps to handle:', collectionHandleMap['EYE CARE']);
  
  if (collectionHandleMap['EYE CARE'] === 'step-8-eye-care') {
    console.log('✅ SUCCESS: EYE CARE correctly maps to "step-8-eye-care" handle');
  } else {
    console.log('❌ ISSUE: EYE CARE should map to "step-8-eye-care" but maps to:', collectionHandleMap['EYE CARE']);
  }
} else {
  console.log('❌ ISSUE: "dark circles" should map to EYE CARE collection, but maps to:', needs.collection || 'none');
}

console.log('\n3. Testing other dark circles variations:');
const variations = [
  'dark circles',
  'under eye dark circles', 
  'eye cream for dark circles',
  'dark circle treatment',
  'eye care for dark circles'
];

variations.forEach((query, index) => {
  const testQuery = [{role: 'user', content: query}];
  const testNeeds = extractSkincareNeeds(testQuery);
  const testHandle = collectionHandleMap[testNeeds.collection] || 'skin-care';
  
  const success = testNeeds.collection === 'EYE CARE';
  console.log(`   ${index + 1}. "${query}" -> Collection: ${testNeeds.collection || 'none'}, Handle: ${testHandle} | ${success ? '✅' : '❌'}`);
});

console.log('\n4. All collection mappings:');
Object.entries(collectionHandleMap).forEach(([collection, handle]) => {
  if (collection.includes('EYE') || collection.includes('CIRCLE') || collection.includes('DARK')) {
    console.log(`   "${collection}" -> "${handle}"`);
  }
});