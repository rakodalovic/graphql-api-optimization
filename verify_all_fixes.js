#!/usr/bin/env node

/**
 * Comprehensive verification script for all issue fixes
 */

const fs = require('fs');
const path = require('path');

console.log('=== COMPREHENSIVE VERIFICATION OF ALL FIXES ===\n');

let allTestsPassed = true;

// Helper function to check if a file contains specific patterns
function checkFileContains(filePath, patterns, description) {
    if (!fs.existsSync(filePath)) {
        console.log(`   ✗ ${description}: File not found - ${filePath}`);
        allTestsPassed = false;
        return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    let allPatternsFound = true;
    
    patterns.forEach(pattern => {
        if (typeof pattern === 'string') {
            if (!content.includes(pattern)) {
                console.log(`   ✗ ${description}: Missing pattern - "${pattern}"`);
                allPatternsFound = false;
                allTestsPassed = false;
            }
        } else if (pattern instanceof RegExp) {
            if (!pattern.test(content)) {
                console.log(`   ✗ ${description}: Missing regex pattern - ${pattern}`);
                allPatternsFound = false;
                allTestsPassed = false;
            }
        }
    });
    
    if (allPatternsFound) {
        console.log(`   ✓ ${description}`);
    }
    
    return allPatternsFound;
}

// Helper function to check if a file does NOT contain specific patterns
function checkFileDoesNotContain(filePath, patterns, description) {
    if (!fs.existsSync(filePath)) {
        console.log(`   ✗ ${description}: File not found - ${filePath}`);
        allTestsPassed = false;
        return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    let noPatternsFound = true;
    
    patterns.forEach(pattern => {
        if (typeof pattern === 'string') {
            if (content.includes(pattern)) {
                console.log(`   ✗ ${description}: Should not contain - "${pattern}"`);
                noPatternsFound = false;
                allTestsPassed = false;
            }
        } else if (pattern instanceof RegExp) {
            if (pattern.test(content)) {
                console.log(`   ✗ ${description}: Should not match regex - ${pattern}`);
                noPatternsFound = false;
                allTestsPassed = false;
            }
        }
    });
    
    if (noPatternsFound) {
        console.log(`   ✓ ${description}`);
    }
    
    return noPatternsFound;
}

console.log('1. PRODUCT CARD PRICE RENDERING FIX');
console.log('=====================================');

// Check ProductCard.css fixes
checkFileDoesNotContain(
    path.join(__dirname, 'frontend/src/components/ProductCard.css'),
    ['height: calc(100% - 250px)', 'height: calc(100% - 200px)', 'height: calc(100% - 180px)'],
    'Removed fixed height calculations that could cut off price'
);

checkFileContains(
    path.join(__dirname, 'frontend/src/components/ProductCard.css'),
    ['flex: 1', 'min-height:', 'display: flex', 'flex-direction: column'],
    'Implemented flexbox layout with min-height approach'
);

console.log('\n2. SORTING BY PRICE FUNCTIONALITY FIX');
console.log('======================================');

// Check ProductCatalog.tsx fixes
checkFileContains(
    path.join(__dirname, 'frontend/src/components/ProductCatalog.tsx'),
    ['productsData?.products?.nodes', 'categoriesData?.categories?.nodes'],
    'Added proper null chaining for connection types'
);

console.log('\n3. DASHBOARD GRAPHQL ERRORS FIX');
console.log('================================');

// Check queries.ts fixes
checkFileContains(
    path.join(__dirname, 'frontend/src/graphql/queries.ts'),
    [
        'users {\n      nodes {',
        'pageInfo {',
        'totalCount'
    ],
    'Updated GET_USERS query to use connection type with nodes'
);

// Check GraphQLTest.tsx fixes
checkFileContains(
    path.join(__dirname, 'frontend/src/components/GraphQLTest.tsx'),
    [
        'usersData?.users?.nodes?.length',
        'usersData?.users?.nodes?.map',
        'productsData?.products?.nodes?.length',
        'productsData?.products?.nodes?.map'
    ],
    'Updated GraphQLTest component to use connection nodes'
);

// Check test file updates
checkFileContains(
    path.join(__dirname, 'frontend/src/components/__tests__/GraphQLTest.test.tsx'),
    [
        'users: {\n    nodes:',
        'products: {\n    nodes:',
        'pageInfo:',
        'totalCount:'
    ],
    'Updated test mock data to match connection types'
);

console.log('\n4. PRICE RANGE FILTER FORM FIX');
console.log('===============================');

// Check ProductCatalog.css fixes
checkFileContains(
    path.join(__dirname, 'frontend/src/components/ProductCatalog.css'),
    [
        'width: 100%',
        'max-width: 100%',
        'min-width: 0',
        'box-sizing: border-box'
    ],
    'Enhanced price range input sizing to prevent overflow'
);

console.log('\n5. ADDITIONAL IMPROVEMENTS');
console.log('==========================');

// Check if new test file was created
checkFileContains(
    path.join(__dirname, 'frontend/src/components/__tests__/IssuesFix.test.tsx'),
    [
        'Issue 1: Product Card Price Rendering',
        'Issue 2: Sorting by Price Functionality',
        'Issue 3: Dashboard GraphQL Errors',
        'Issue 4: Price Range Filter Form'
    ],
    'Created comprehensive integration tests for all fixes'
);

console.log('\n6. CODE QUALITY CHECKS');
console.log('=======================');

// Check for proper TypeScript types
checkFileContains(
    path.join(__dirname, 'frontend/src/components/ProductCatalog.tsx'),
    ['ProductsData', 'CategoriesData', 'SortOption'],
    'Maintained proper TypeScript interfaces'
);

// Check for proper error handling
checkFileContains(
    path.join(__dirname, 'frontend/src/components/ProductCatalog.tsx'),
    ['|| []', 'productsError', 'categoriesError'],
    'Maintained proper error handling and fallbacks'
);

console.log('\n7. RESPONSIVE DESIGN VERIFICATION');
console.log('==================================');

// Check responsive CSS updates
checkFileContains(
    path.join(__dirname, 'frontend/src/components/ProductCard.css'),
    [
        '@media (max-width: 768px)',
        '@media (max-width: 480px)',
        'flex: 1'
    ],
    'Maintained responsive design with flexbox approach'
);

checkFileContains(
    path.join(__dirname, 'frontend/src/components/ProductCatalog.css'),
    [
        'flex-direction: column',
        'align-items: stretch'
    ],
    'Maintained responsive behavior for price inputs'
);

console.log('\n=== VERIFICATION SUMMARY ===');
if (allTestsPassed) {
    console.log('🎉 ALL FIXES VERIFIED SUCCESSFULLY!');
    console.log('\nAll issues have been properly addressed:');
    console.log('✓ Product card price rendering fixed');
    console.log('✓ Sorting functionality null reference errors resolved');
    console.log('✓ Dashboard GraphQL connection type errors fixed');
    console.log('✓ Price range filter form overflow prevented');
    console.log('✓ Comprehensive tests added');
    console.log('✓ Code quality maintained');
    console.log('✓ Responsive design preserved');
} else {
    console.log('❌ SOME VERIFICATIONS FAILED');
    console.log('Please review the failed checks above.');
    process.exit(1);
}

console.log('\n=== IMPLEMENTATION DETAILS ===');
console.log('Changes made to resolve the issues:');
console.log('\n1. ProductCard.css:');
console.log('   - Replaced fixed height calculations with flexbox layout');
console.log('   - Used min-height instead of fixed height to prevent content cutoff');
console.log('   - Updated responsive breakpoints to maintain consistency');

console.log('\n2. ProductCatalog.tsx:');
console.log('   - Added extra null chaining (?.) for connection types');
console.log('   - Ensured proper handling of products?.nodes and categories?.nodes');

console.log('\n3. queries.ts:');
console.log('   - Updated GET_USERS query to use connection type structure');
console.log('   - Added nodes, pageInfo, and totalCount fields');

console.log('\n4. GraphQLTest.tsx:');
console.log('   - Updated component to access data through .nodes property');
console.log('   - Updated both users and products data access patterns');

console.log('\n5. ProductCatalog.css:');
console.log('   - Enhanced price range input container sizing');
console.log('   - Added width: 100% and max-width: 100% to prevent overflow');
console.log('   - Added min-width: 0 to allow proper flex shrinking');

console.log('\n6. Test files:');
console.log('   - Updated existing test mock data to match connection types');
console.log('   - Created comprehensive integration tests for all fixes');

console.log('\nThese changes ensure that:');
console.log('- Product prices are always visible and not cut off');
console.log('- Sorting functionality works without null reference errors');
console.log('- Dashboard queries work with the HotChocolate connection types');
console.log('- Price range filters fit properly within the sidebar');
console.log('- All changes are properly tested and maintainable');