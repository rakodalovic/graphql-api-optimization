#!/usr/bin/env node

/**
 * Test script to verify the Catalog Page fixes
 * This script tests all the GraphQL queries that were previously failing
 */

const { execSync } = require('child_process');

function testGraphQLQuery(queryName, query, variables = {}) {
    console.log(`\n=== Testing ${queryName} ===`);
    
    const payload = {
        query: query,
        variables: variables
    };
    
    try {
        const result = execSync(`curl -s -X POST http://localhost:5001/graphql -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`, {
            encoding: 'utf8',
            timeout: 10000
        });
        
        const response = JSON.parse(result);
        
        if (response.errors && response.errors.length > 0) {
            console.log('❌ GraphQL Errors:');
            response.errors.forEach(error => {
                console.log(`   - ${error.message}`);
                if (error.path) {
                    console.log(`     Path: ${error.path.join('.')}`);
                }
            });
            return false;
        }
        
        if (response.data) {
            console.log('✅ Query succeeded');
            console.log(`   Data structure: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
            return true;
        }
        
        console.log('❌ No data returned');
        return false;
        
    } catch (error) {
        console.log('❌ Network/Client Error:');
        console.log(`   ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('🧪 Catalog Page Fix Verification');
    console.log('================================');
    
    const tests = [
        {
            name: 'GET_PRODUCTS with pagination',
            query: `query GetProducts($first: Int) { 
                products(first: $first) { 
                    nodes { id name } 
                    pageInfo { hasNextPage hasPreviousPage } 
                    totalCount 
                } 
            }`,
            variables: { first: 5 }
        },
        {
            name: 'GET_FEATURED_PRODUCTS',
            query: `query GetFeaturedProducts($first: Int) { 
                products(where: { isFeatured: { eq: true } }, first: $first) { 
                    nodes { id name } 
                    totalCount 
                } 
            }`,
            variables: { first: 8 }
        },
        {
            name: 'GET_CATEGORIES with connection',
            query: `query GetCategories { 
                categories { 
                    nodes { id name slug } 
                    pageInfo { hasNextPage } 
                    totalCount 
                } 
            }`
        },
        {
            name: 'GET_USERS with pagination',
            query: `query GetUsers($first: Int) { 
                users(first: $first) { 
                    nodes { id firstName lastName } 
                    pageInfo { hasNextPage } 
                    totalCount 
                } 
            }`,
            variables: { first: 10 }
        },
        {
            name: 'GET_ORDERS with pagination',
            query: `query GetOrders($first: Int) { 
                orders(first: $first) { 
                    nodes { id orderNumber status } 
                    pageInfo { hasNextPage } 
                    totalCount 
                } 
            }`,
            variables: { first: 10 }
        }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    for (const test of tests) {
        const success = testGraphQLQuery(test.name, test.query, test.variables);
        if (success) {
            passedTests++;
        }
    }
    
    console.log('\n📊 Test Results');
    console.log('================');
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! Catalog Page fix is working correctly.');
        console.log('\nFixed issues:');
        console.log('1. ✅ Middleware order: Moved [UsePaging] under [UseDbContext]');
        console.log('2. ✅ Added totalCount support to GraphQL connections');
        console.log('3. ✅ All connection queries now return nodes, pageInfo, and totalCount');
        console.log('4. ✅ No more 400 Bad Request errors');
        console.log('5. ✅ No more "field does not exist" errors');
    } else {
        console.log('\n❌ Some tests failed. Please check the errors above.');
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}