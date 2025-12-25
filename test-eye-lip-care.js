// Test script to verify eye care and lip care collection mappings
const { extractSkincareNeeds } = require('./backend/src/services/openai');

console.log('Testing EYE CARE and LIP CARE collection mappings:\n');

// Test various eye care queries
const eyeCareQueries = [
  'I need eye care products',
  'eye cream for dark circles',
  'I want eye serum',
  'under eye care',
  'dark circles treatment'
];

console.log('Testing EYE CARE queries:');
eyeCareQueries.forEach((query, index) => {
  const needs = extractSkincareNeeds([{role: 'user', content: query}]);
  const success = needs.collection === 'EYE CARE';
  console.log(`  ${index + 1}. "${query}" -> Collection: ${needs.collection || 'none'} | ${success ? '✅' : '❌'}`);
});

console.log('');

// Test various lip care queries
const lipCareQueries = [
  'I need lip care products',
  'lip balm for dry lips',
  'chapped lips treatment',
  'cracked lips care',
  'dry lips'
];

console.log('Testing LIP CARE queries:');
lipCareQueries.forEach((query, index) => {
  const needs = extractSkincareNeeds([{role: 'user', content: query}]);
  const success = needs.collection === 'LIP CARE';
  console.log(`  ${index + 1}. "${query}" -> Collection: ${needs.collection || 'none'} | ${success ? '✅' : '❌'}`);
});

console.log('\nTesting collection handle mapping:');
const collectionHandleMap = {
  'OIL CLEANSER': 'step-1',
  'WATER-BASED CLEANSER': 'step-2-water-based-cleanser',
  'ALL KOREAN SKIN CARE': 'skin-care',
  'MOISTURIZER': 'step-9-moisturizer',
  'TONER': 'step-3-toner',
  'SERUM/AMPOULE': 'step-6-serum-ampoule',
  'SUN SCREEN': 'step-10-suncream',
  'MASK': 'step-7-mask',
  'EYE CARE': 'step-8-eye-care',  // Should map to eye care collection
  'LIP CARE': 'lip-care',         // Should map to lip care collection
  'EXFOLIATOR': 'step-3-exfoliator',
  'AHA/BHA': 'step-3-exfoliator',
  'ESSENCE': 'step-5-essence',
  'RETINOL': 'retinol',
  'VITAMIN C': 'vitamin-c',
  'RICE': 'rice',
  'ACNE': 'acne',
  'REDNESS/INFLAMMATION': 'skin-care',
  'BRIGHTENING': 'skin-care',
  'ANTI-AGEING': 'skin-care',
  'OVERNIGHT MASKS': 'step-7-mask',
  'FACIAL OIL': 'skin-care',
  'TRAVEL KIT/MINI': 'skin-care',
  'COMBINATION SKIN': 'combination-skin',
  'OILY SKIN': 'oily-skin',
  'DRY SKIN': 'dry-skin',
  'NORMAL SKIN': 'normal-skin',
  'SENSITIVE SKIN': 'skin-care'
};

console.log(`EYE CARE maps to: ${collectionHandleMap['EYE CARE']}`);
console.log(`LIP CARE maps to: ${collectionHandleMap['LIP CARE']}`);

// Test the complete flow
console.log('\nComplete flow test:');
const eyeNeeds = extractSkincareNeeds([{role: 'user', content: 'eye care for dark circles'}]);
const eyeHandle = collectionHandleMap[eyeNeeds.collection] || 'skin-care';
console.log(`"eye care for dark circles" -> Collection: ${eyeNeeds.collection}, Handle: ${eyeHandle}`);

const lipNeeds = extractSkincareNeeds([{role: 'user', content: 'lip care for dry lips'}]);
const lipHandle = collectionHandleMap[lipNeeds.collection] || 'skin-care';
console.log(`"lip care for dry lips" -> Collection: ${lipNeeds.collection}, Handle: ${lipHandle}`);