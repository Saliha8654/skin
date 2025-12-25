// Test script to verify dark circles collection mapping
const { extractSkincareNeeds } = require('./backend/src/services/openai');

// Test dark circles query
const darkCirclesQuery = [{role: 'user', content: 'I have dark circles under my eyes'}];

const needs = extractSkincareNeeds(darkCirclesQuery);

console.log('Testing "dark circles" query:');
console.log('Extracted needs:', needs);
console.log('');

// Check if it maps to EYE CARE collection
if (needs.collection === 'EYE CARE') {
  console.log('✅ SUCCESS: "dark circles" correctly maps to EYE CARE collection');
} else {
  console.log('❌ ISSUE: "dark circles" does not map to EYE CARE collection');
  console.log(`   Current collection mapping: ${needs.collection || 'none'}`);
}

// Also check if it maps to dark-circles concern
if (needs.concerns.includes('dark-circles')) {
  console.log('✅ SUCCESS: "dark circles" also maps to dark-circles concern');
} else {
  console.log('ℹ️  "dark circles" concern not detected');
}

// Test other variations
const testQueries = [
  { query: 'I want eye cream for dark circles', expectedCollection: 'EYE CARE' },
  { query: 'under eye dark circles', expectedCollection: 'EYE CARE' },
  { query: 'eye care for dark circles', expectedCollection: 'EYE CARE' }
];

console.log('\nTesting other variations:');
testQueries.forEach((test, index) => {
  const testMessage = [{role: 'user', content: test.query}];
  const testNeeds = extractSkincareNeeds(testMessage);
  const success = testNeeds.collection === test.expectedCollection;
  
  console.log(`${index + 1}. Query: "${test.query}"`);
  console.log(`   Collection: ${testNeeds.collection || 'none'} | ${success ? '✅' : '❌'}`);
});