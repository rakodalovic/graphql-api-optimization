#!/usr/bin/env node

/**
 * Test script to verify all fixes are working
 */

const fs = require('fs');
const path = require('path');

console.log('=== Testing All Fixes ===\n');

console.log('1. Testing Product Card Price Rendering Fix:');
const productCardCssPath = path.join(__dirname, 'frontend/src/components/ProductCard.css');
if (fs.existsSync(productCardCssPath)) {
    const cssContent = fs.readFileSync(productCardCssPath, 'utf8');
    
    // Check if fixed height calculations are removed
    if (!cssContent.includes('height: calc(100% - 250px)') && 
        !cssContent.includes('height: calc(100% - 200px)') &&
        !cssContent.includes('height: calc(100% - 180px)')) {
        console.log('   ✓ Fixed height calculations removed');
    } else {
        console.log('   ✗ Fixed height calculations still present');
    }
    
    // Check if flexbox approach is used
    if (cssContent.includes('flex: 1') && cssContent.includes('min-height')) {
        console.log('   ✓ Flexbox approach implemented with min-height');
    } else {
        console.log('   ✗ Flexbox approach not properly implemented');
    }
    
    // Check if product-link uses flex
    if (cssContent.includes('display: flex') && cssContent.includes('flex-direction: column')) {
        console.log('   ✓ Product link uses flexbox layout');
    } else {
        console.log('   ✗ Product link layout not updated');
    }
} else {
    console.log('   ✗ ProductCard.css not found');
}

console.log('\n2. Testing ProductCatalog Sorting Fix:');
const productCatalogPath = path.join(__dirname, 'frontend/src/components/ProductCatalog.tsx');
if (fs.existsSync(productCatalogPath)) {
    const catalogContent = fs.readFileSync(productCatalogPath, 'utf8');
    
    // Check for proper null chaining
    if (catalogContent.includes('productsData?.products?.nodes') && 
        catalogContent.includes('categoriesData?.categories?.nodes')) {
        console.log('   ✓ Added proper null chaining for connection types');
    } else {
        console.log('   ✗ Null chaining not properly implemented');
    }
} else {
    console.log('   ✗ ProductCatalog.tsx not found');
}

console.log('\n3. Testing Dashboard GraphQL Query Fix:');
const queriesPath = path.join(__dirname, 'frontend/src/graphql/queries.ts');
if (fs.existsSync(queriesPath)) {
    const queriesContent = fs.readFileSync(queriesPath, 'utf8');
    
    // Check if GET_USERS query uses nodes structure
    const getUsersMatch = queriesContent.match(/export const GET_USERS = gql`[\s\S]*?`;/);
    if (getUsersMatch) {
        const getUsersQuery = getUsersMatch[0];
        if (getUsersQuery.includes('users {') && getUsersQuery.includes('nodes {') && 
            getUsersQuery.includes('pageInfo {') && getUsersQuery.includes('totalCount')) {
            console.log('   ✓ GET_USERS query updated to use connection type with nodes');
        } else {
            console.log('   ✗ GET_USERS query not properly updated');
        }
    }
} else {
    console.log('   ✗ queries.ts not found');
}

const graphqlTestPath = path.join(__dirname, 'frontend/src/components/GraphQLTest.tsx');
if (fs.existsSync(graphqlTestPath)) {
    const testContent = fs.readFileSync(graphqlTestPath, 'utf8');
    
    // Check if component uses nodes structure
    if (testContent.includes('usersData?.users?.nodes?.length') && 
        testContent.includes('usersData?.users?.nodes?.map') &&
        testContent.includes('productsData?.products?.nodes?.length') &&
        testContent.includes('productsData?.products?.nodes?.map')) {
        console.log('   ✓ GraphQLTest component updated to use connection nodes');
    } else {
        console.log('   ✗ GraphQLTest component not properly updated');
    }
} else {
    console.log('   ✗ GraphQLTest.tsx not found');
}

console.log('\n4. Testing Price Range Filter Form Fix:');
const catalogCssPath = path.join(__dirname, 'frontend/src/components/ProductCatalog.css');
if (fs.existsSync(catalogCssPath)) {
    const catalogCssContent = fs.readFileSync(catalogCssPath, 'utf8');
    
    // Check for proper container sizing
    if (catalogCssContent.includes('width: 100%') && 
        catalogCssContent.includes('max-width: 100%') &&
        catalogCssContent.includes('min-width: 0')) {
        console.log('   ✓ Price range inputs properly sized to prevent overflow');
    } else {
        console.log('   ✗ Price range inputs sizing not properly implemented');
    }
    
    // Check responsive behavior
    if (catalogCssContent.includes('flex-direction: column') && 
        catalogCssContent.includes('@media (max-width: 480px)')) {
        console.log('   ✓ Responsive behavior maintained for mobile');
    } else {
        console.log('   ✗ Responsive behavior not properly maintained');
    }
} else {
    console.log('   ✗ ProductCatalog.css not found');
}

console.log('\n=== Fix Testing Complete ===');
console.log('\nSummary of Changes Made:');
console.log('1. ProductCard.css: Replaced fixed height calculations with flexbox and min-height');
console.log('2. ProductCatalog.tsx: Added proper null chaining for connection types');
console.log('3. queries.ts: Updated GET_USERS query to use connection type with nodes');
console.log('4. GraphQLTest.tsx: Updated component to access data through nodes property');
console.log('5. ProductCatalog.css: Enhanced price range input sizing to prevent overflow');

console.log('\nThese changes should resolve:');
console.log('- Product card price being cut off by bottom border');
console.log('- Sorting functionality throwing "Cannot read properties of null" errors');
console.log('- Dashboard GraphQL errors about missing fields on connection types');
console.log('- Price range filter form overflowing outside sidebar');