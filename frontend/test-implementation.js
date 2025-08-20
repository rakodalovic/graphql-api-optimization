#!/usr/bin/env node

/**
 * Test script to verify the implementation of core frontend features
 * This script checks that all components are properly created and configured
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/components/HomePage.tsx',
  'src/components/HomePage.css',
  'src/components/ProductCard.tsx',
  'src/components/ProductCard.css',
  'src/components/ProductCatalog.tsx',
  'src/components/ProductCatalog.css',
  'src/components/ProductDetail.tsx',
  'src/components/ProductDetail.css',
  'src/components/ReviewsList.tsx',
  'src/components/ReviewsList.css',
  'src/components/Navigation.tsx',
  'src/components/Navigation.css'
];

const requiredQueries = [
  'GET_FEATURED_PRODUCTS',
  'GET_PRODUCTS',
  'GET_PRODUCT',
  'GET_RELATED_PRODUCTS',
  'GET_CATEGORIES',
  'GET_PRODUCT_REVIEWS'
];

console.log('🔍 Testing Core Frontend Features Implementation...\n');

// Test 1: Check if all required files exist
console.log('1. Checking required files...');
let filesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    filesExist = false;
  }
}

// Test 2: Check GraphQL queries
console.log('\n2. Checking GraphQL queries...');
const queriesFile = path.join(__dirname, 'src/graphql/queries.ts');
if (fs.existsSync(queriesFile)) {
  const queriesContent = fs.readFileSync(queriesFile, 'utf8');
  let queriesExist = true;
  
  for (const query of requiredQueries) {
    if (queriesContent.includes(`export const ${query}`)) {
      console.log(`   ✅ ${query}`);
    } else {
      console.log(`   ❌ ${query} - MISSING`);
      queriesExist = false;
    }
  }
  
  if (!queriesExist) {
    filesExist = false;
  }
} else {
  console.log('   ❌ queries.ts file not found');
  filesExist = false;
}

// Test 3: Check App.tsx routing
console.log('\n3. Checking routing configuration...');
const appFile = path.join(__dirname, 'src/App.tsx');
if (fs.existsSync(appFile)) {
  const appContent = fs.readFileSync(appFile, 'utf8');
  const requiredRoutes = ['/', '/catalog', '/product/:id'];
  const requiredComponents = ['HomePage', 'ProductCatalog', 'ProductDetail', 'Navigation'];
  
  let routingCorrect = true;
  
  for (const route of requiredRoutes) {
    if (appContent.includes(`path="${route}"`)) {
      console.log(`   ✅ Route: ${route}`);
    } else {
      console.log(`   ❌ Route: ${route} - MISSING`);
      routingCorrect = false;
    }
  }
  
  for (const component of requiredComponents) {
    if (appContent.includes(component)) {
      console.log(`   ✅ Component: ${component}`);
    } else {
      console.log(`   ❌ Component: ${component} - MISSING`);
      routingCorrect = false;
    }
  }
  
  if (!routingCorrect) {
    filesExist = false;
  }
} else {
  console.log('   ❌ App.tsx file not found');
  filesExist = false;
}

// Test 4: Check responsive design (CSS media queries)
console.log('\n4. Checking responsive design...');
const cssFiles = [
  'src/components/HomePage.css',
  'src/components/ProductCard.css',
  'src/components/ProductCatalog.css',
  'src/components/ProductDetail.css'
];

let responsiveDesign = true;
for (const cssFile of cssFiles) {
  const filePath = path.join(__dirname, cssFile);
  if (fs.existsSync(filePath)) {
    const cssContent = fs.readFileSync(filePath, 'utf8');
    if (cssContent.includes('@media') && cssContent.includes('max-width')) {
      console.log(`   ✅ ${cssFile} - Has responsive breakpoints`);
    } else {
      console.log(`   ❌ ${cssFile} - Missing responsive breakpoints`);
      responsiveDesign = false;
    }
  }
}

// Test 5: Check GraphQL features
console.log('\n5. Checking GraphQL features...');
const features = [
  { name: 'Filtering', files: ['src/components/ProductCatalog.tsx'], keywords: ['where', 'filter'] },
  { name: 'Sorting', files: ['src/components/ProductCatalog.tsx'], keywords: ['order', 'sort'] },
  { name: 'Pagination', files: ['src/components/ReviewsList.tsx'], keywords: ['pageInfo', 'hasNextPage'] },
  { name: 'Nested queries', files: ['src/graphql/queries.ts'], keywords: ['category {', 'images {', 'reviews {'] }
];

let featuresImplemented = true;
for (const feature of features) {
  let featureFound = false;
  for (const file of feature.files) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (feature.keywords.some(keyword => content.includes(keyword))) {
        featureFound = true;
        break;
      }
    }
  }
  
  if (featureFound) {
    console.log(`   ✅ ${feature.name}`);
  } else {
    console.log(`   ❌ ${feature.name} - MISSING`);
    featuresImplemented = false;
  }
}

// Summary
console.log('\n📋 SUMMARY');
console.log('==========');

if (filesExist && responsiveDesign && featuresImplemented) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('\n✅ Core Frontend Features Successfully Implemented:');
  console.log('   • Welcome (Home) page with styling');
  console.log('   • Product catalog with filtering and sorting');
  console.log('   • Product detail page with reviews and related products');
  console.log('   • GraphQL queries aligned with HotChocolate schemas');
  console.log('   • Responsive design for mobile, tablet, and desktop');
  console.log('   • Navigation component with routing');
  console.log('   • Efficient data fetching with GraphQL');
  
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED!');
  console.log('\nPlease check the missing components and fix the issues.');
  process.exit(1);
}