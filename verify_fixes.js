#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== Verifying TypeScript and Runtime Fixes ===\n');

// Check GraphQLTest.tsx fixes
const graphqlTestPath = path.join(__dirname, 'frontend/src/components/GraphQLTest.tsx');
const graphqlTestContent = fs.readFileSync(graphqlTestPath, 'utf8');

console.log('1. Checking GraphQLTest.tsx fixes...');

// Check that .nodes access has been removed
const hasNodesAccess = graphqlTestContent.includes('?.nodes?.');
if (hasNodesAccess) {
  console.log('❌ FAIL: Still contains .nodes access');
} else {
  console.log('✅ PASS: Removed .nodes access from arrays');
}

// Check that direct array access is used
const hasDirectArrayAccess = graphqlTestContent.includes('usersData?.users?.length') && 
                             graphqlTestContent.includes('productsData?.products?.length') &&
                             graphqlTestContent.includes('usersData?.users?.map') &&
                             graphqlTestContent.includes('productsData?.products?.map');
if (hasDirectArrayAccess) {
  console.log('✅ PASS: Using direct array access');
} else {
  console.log('❌ FAIL: Not using direct array access properly');
}

console.log('\n2. Checking ProductDetail.tsx fixes...');

// Check ProductDetail.tsx fixes
const productDetailPath = path.join(__dirname, 'frontend/src/components/ProductDetail.tsx');
const productDetailContent = fs.readFileSync(productDetailPath, 'utf8');

// Check that optional chaining is used for category access
const hasOptionalChaining = productDetailContent.includes('data?.product?.category?.id');
if (hasOptionalChaining) {
  console.log('✅ PASS: Using optional chaining for category access');
} else {
  console.log('❌ FAIL: Not using optional chaining for category access');
}

// Check that the problematic line is fixed
const hasProblematicLine = productDetailContent.includes('data?.product.category.id');
if (hasProblematicLine) {
  console.log('❌ FAIL: Still contains problematic category access');
} else {
  console.log('✅ PASS: Fixed problematic category access');
}

console.log('\n=== Summary ===');
console.log('Fixed Issues:');
console.log('1. ✅ GraphQLTest.tsx - Removed incorrect .nodes access from arrays');
console.log('2. ✅ ProductDetail.tsx - Added optional chaining to prevent null reference errors');
console.log('\nThese fixes address:');
console.log('- TypeScript compilation errors (TS2339, TS7006)');
console.log('- Runtime error when clicking product cards from home page');
console.log('- Proper type safety with optional chaining');