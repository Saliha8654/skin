require('dotenv').config({ path: './backend/.env' });
const { extractSkincareNeeds } = require('./backend/src/services/openai');

function testComprehensiveDetection() {
  console.log('Comprehensive Detection Test');
  console.log('==========================');
  
  // Test case 1: Just skin type
  console.log('\n1. Testing skin type only - "oily skin":');
  let messages = [{ role: "user", content: "I have oily skin" }];
  let needs = extractSkincareNeeds(messages);
  console.log('   Result:', JSON.stringify(needs, null, 2));
  
  // Test case 2: Just skin type
  console.log('\n2. Testing skin type only - "dry skin":');
  messages = [{ role: "user", content: "I have dry skin" }];
  needs = extractSkincareNeeds(messages);
  console.log('   Result:', JSON.stringify(needs, null, 2));
  
  // Test case 3: Just skin type
  console.log('\n3. Testing skin type only - "combination skin":');
  messages = [{ role: "user", content: "I have combination skin" }];
  needs = extractSkincareNeeds(messages);
  console.log('   Result:', JSON.stringify(needs, null, 2));
  
  // Test case 4: Just skin type
  console.log('\n4. Testing skin type only - "sensitive skin":');
  messages = [{ role: "user", content: "I have sensitive skin" }];
  needs = extractSkincareNeeds(messages);
  console.log('   Result:', JSON.stringify(needs, null, 2));
  
  // Test case 5: Skin type with concern
  console.log('\n5. Testing skin type with concern - "I have dry skin and want hydration":');
  messages = [{ role: "user", content: "I have dry skin and want hydration" }];
  needs = extractSkincareNeeds(messages);
  console.log('   Result:', JSON.stringify(needs, null, 2));
  
  // Test case 6: Collection type without skin type mentioned
  console.log('\n6. Testing collection without skin type - "I want an eye cream for dark circles":');
  messages = [{ role: "user", content: "I want an eye cream for dark circles" }];
  needs = extractSkincareNeeds(messages);
  console.log('   Result:', JSON.stringify(needs, null, 2));
  
  console.log('\n✅ Comprehensive detection test completed!');
}

testComprehensiveDetection();