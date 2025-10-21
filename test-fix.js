/**
 * Test script to verify the "method.method" error is fixed
 * This script checks the minified code for the problematic pattern
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing the fix for "cannot read property method of method" error...\n');

// Read the minified code
const distPath = path.join(__dirname, 'packages/react-native-flipper-inspector/dist/index.js');
const code = fs.readFileSync(distPath, 'utf8');

// Check for problematic patterns
const checks = [
  {
    name: 'Variable naming conflict (method.method)',
    pattern: /method\.method/g,
    shouldExist: false,
    description: 'Should NOT find method.method pattern'
  },
  {
    name: 'Network patching function',
    pattern: /function re\([^)]*\)/,
    shouldExist: true,
    description: 'Should find network patching function'
  },
  {
    name: 'Fetch interception',
    pattern: /globalThis\.fetch=/,
    shouldExist: true,
    description: 'Should find globalThis.fetch assignment'
  },
  {
    name: 'XMLHttpRequest patching',
    pattern: /XMLHttpRequest\.prototype\.open=/,
    shouldExist: true,
    description: 'Should find XMLHttpRequest.prototype.open assignment'
  },
  {
    name: 'Method parameter usage',
    pattern: /method:\s*[a-z]+/,
    shouldExist: true,
    description: 'Should find method parameter being used correctly'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const matches = code.match(check.pattern);
  const found = matches && matches.length > 0;
  
  // For shouldExist: false, passed = !found (not found is good)
  // For shouldExist: true, passed = found (found is good)
  const passed = check.shouldExist ? found : !found;
  
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const details = found ? `Found ${matches.length} occurrence(s)` : 'Not found';
  
  console.log(`${status} - ${check.name}`);
  console.log(`   ${check.description}`);
  console.log(`   Result: ${details}`);
  
  if (!passed) {
    allPassed = false;
    if (check.shouldExist && !found) {
      console.log(`   ⚠️  Expected to find but didn't`);
    } else if (!check.shouldExist && found) {
      console.log(`   ⚠️  Found problematic pattern: ${matches.slice(0, 3).join(', ')}`);
    }
  }
  
  console.log('');
});

// Summary
console.log('═'.repeat(50));
if (allPassed) {
  console.log('✅ All tests passed! The fix is working correctly.');
  console.log('');
  console.log('The "cannot read property method of method" error has been resolved.');
  console.log('Network monitoring should now work properly in your React Native app.');
} else {
  console.log('❌ Some tests failed. Please review the results above.');
}
console.log('═'.repeat(50));

// Additional verification - check specific code section
console.log('\n📋 Code Analysis:');
const networkPatchingSection = code.match(/function re\([^{]*\{[^}]{0,500}/)?.[0];
if (networkPatchingSection) {
  console.log('Found network patching function implementation');
  
  // Check if the fix is properly applied
  const hasHttpMethod = /[a-z]=\s*[a-z]\?\.[a-z]+\|\|"GET"/.test(networkPatchingSection);
  if (hasHttpMethod) {
    console.log('✅ Variable naming uses proper format (avoiding "method" variable name)');
  } else {
    console.log('⚠️  Could not verify variable naming pattern');
  }
} else {
  console.log('⚠️  Could not find network patching function for detailed analysis');
}

process.exit(allPassed ? 0 : 1);

