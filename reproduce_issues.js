#!/usr/bin/env node

/**
 * Script to reproduce the reported issues
 */

const fs = require('fs');
const path = require('path');

console.log('=== Reproducing Issues ===\n');

console.log('1. Product Card Price Rendering Issue:');
console.log('   - Checking ProductCard.css for potential border overlap issues...');

// Check ProductCard.css for potential issues
const productCardCssPath = path.join(__dirname, 'frontend/src/components/ProductCard.css');
if (fs.existsSync(productCardCssPath)) {
    const cssContent = fs.readFileSync(productCardCssPath, 'utf8');
    
    // Look for potential issues with height calculations and borders
    if (cssContent.includes('height: calc(100% - 250px)')) {
        console.log('   ✗ Found potential issue: Fixed height calculation in product-info may cause price cutoff');
    }
    
    if (cssContent.includes('overflow: hidden') && cssContent.includes('product-info')) {
        console.log('   ✗ Found potential issue: overflow:hidden on product-info may cut off price text');
    }
} else {
    console.log('   ✗ ProductCard.css not found');
}

console.log('\n2. Sorting by Price Issue:');
console.log('   - Checking ProductCatalog component for sorting logic...');

const productCatalogPath = path.join(__dirname, 'frontend/src/components/ProductCatalog.tsx');
if (fs.existsSync(productCatalogPath)) {
    const catalogContent = fs.readFileSync(productCatalogPath, 'utf8');
    
    // Check if the component properly handles null data
    if (catalogContent.includes('productsData?.products.nodes') && 
        catalogContent.includes('products.length > 0')) {
        console.log('   ✗ Found potential issue: Code assumes products.nodes exists but may be null during sorting');
    }
    
    if (catalogContent.includes('const products = productsData?.products.nodes || [];')) {
        console.log('   ✓ Found proper null handling for products.nodes');
    }
} else {
    console.log('   ✗ ProductCatalog.tsx not found');
}

console.log('\n3. Dashboard GraphQL Errors:');
console.log('   - Checking GraphQL queries for connection type usage...');

const queriesPath = path.join(__dirname, 'frontend/src/graphql/queries.ts');
if (fs.existsSync(queriesPath)) {
    const queriesContent = fs.readFileSync(queriesPath, 'utf8');
    
    // Check GET_USERS query
    const getUsersMatch = queriesContent.match(/export const GET_USERS = gql`\s*query GetUsers \{[\s\S]*?\}/);
    if (getUsersMatch) {
        const getUsersQuery = getUsersMatch[0];
        if (getUsersQuery.includes('users {') && !getUsersQuery.includes('nodes {')) {
            console.log('   ✗ Found issue: GET_USERS query missing "nodes" wrapper for connection type');
        } else if (getUsersQuery.includes('users {') && getUsersQuery.includes('nodes {')) {
            console.log('   ✓ GET_USERS query properly uses nodes wrapper');
        }
    }
    
    // Check GET_PRODUCTS query  
    const getProductsMatch = queriesContent.match(/export const GET_PRODUCTS = gql`[\s\S]*?products\([\s\S]*?\{[\s\S]*?\}/);
    if (getProductsMatch) {
        const getProductsQuery = getProductsMatch[0];
        if (getProductsQuery.includes('nodes {')) {
            console.log('   ✓ GET_PRODUCTS query properly uses nodes wrapper');
        } else {
            console.log('   ✗ GET_PRODUCTS query missing nodes wrapper');
        }
    }
} else {
    console.log('   ✗ queries.ts not found');
}

console.log('\n4. Price Range Filter Form Overflow:');
console.log('   - Checking ProductCatalog.css for sidebar layout issues...');

const catalogCssPath = path.join(__dirname, 'frontend/src/components/ProductCatalog.css');
if (fs.existsSync(catalogCssPath)) {
    const catalogCssContent = fs.readFileSync(catalogCssPath, 'utf8');
    
    // Check for fixed sidebar width and price input styling
    if (catalogCssContent.includes('grid-template-columns: 280px 1fr')) {
        console.log('   ✓ Found fixed sidebar width: 280px');
    }
    
    if (catalogCssContent.includes('.price-range-inputs')) {
        console.log('   ✓ Found price-range-inputs styling');
        
        // Check if inputs are properly sized
        if (catalogCssContent.includes('flex: 1') && catalogCssContent.includes('box-sizing: border-box')) {
            console.log('   ✓ Price inputs use flex: 1 and border-box sizing');
        } else {
            console.log('   ✗ Price inputs may not be properly sized for container');
        }
    }
    
    // Check responsive behavior
    if (catalogCssContent.includes('@media (max-width: 480px)') && 
        catalogCssContent.includes('flex-direction: column')) {
        console.log('   ✓ Found responsive behavior for price inputs on mobile');
    }
} else {
    console.log('   ✗ ProductCatalog.css not found');
}

console.log('\n=== Issue Reproduction Complete ===');
console.log('\nNext steps:');
console.log('1. Fix ProductCard CSS to prevent price cutoff');
console.log('2. Fix ProductCatalog sorting null reference error');
console.log('3. Fix GraphQL queries to use connection types with nodes');
console.log('4. Ensure price range form fits properly in sidebar');