#!/usr/bin/env node

/**
 * Test script to verify the backend GraphQL schema fixes
 * This script will test if pagination is working correctly
 */

const { ApolloClient, InMemoryCache, gql, createHttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

// Create Apollo Client
const httpLink = createHttpLink({
  uri: 'http://localhost:5001/graphql',
  fetch: fetch
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

// Test the fixed queries
const GET_PRODUCTS_PAGINATED = gql`
  query GetProducts($first: Int, $after: String) {
    products(first: $first, after: $after) {
      nodes {
        id
        name
        price
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

const GET_CATEGORIES_PAGINATED = gql`
  query GetCategories {
    categories {
      nodes {
        id
        name
        slug
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

const INTROSPECTION_QUERY = gql`
  query IntrospectionQuery {
    __schema {
      queryType {
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
              fields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function testQuery(queryName, query, variables = {}) {
  console.log(`\n=== Testing ${queryName} ===`);
  try {
    const result = await client.query({
      query: query,
      variables: variables
    });
    
    if (result.errors && result.errors.length > 0) {
      console.log('❌ GraphQL Errors:');
      result.errors.forEach(error => {
        console.log(`   - ${error.message}`);
        if (error.locations) {
          console.log(`     Location: line ${error.locations[0].line}, column ${error.locations[0].column}`);
        }
        if (error.path) {
          console.log(`     Path: ${error.path.join('.')}`);
        }
      });
      return false;
    }
    
    if (result.data) {
      console.log('✅ Query succeeded!');
      console.log('Data structure:');
      console.log(JSON.stringify(result.data, null, 2));
      return true;
    }
    
  } catch (error) {
    console.log('❌ Network/Client Error:');
    console.log(`   - ${error.message}`);
    if (error.networkError) {
      console.log(`   - Network Error: ${error.networkError.message}`);
      if (error.networkError.statusCode) {
        console.log(`   - Status Code: ${error.networkError.statusCode}`);
      }
    }
    return false;
  }
  return false;
}

async function testIntrospection() {
  console.log('\n=== Testing Schema Introspection ===');
  try {
    const result = await client.query({
      query: INTROSPECTION_QUERY
    });
    
    if (result.data && result.data.__schema) {
      const queryFields = result.data.__schema.queryType.fields;
      const productsField = queryFields.find(f => f.name === 'products');
      const categoriesField = queryFields.find(f => f.name === 'categories');
      
      console.log('Products field type:', JSON.stringify(productsField?.type, null, 2));
      console.log('Categories field type:', JSON.stringify(categoriesField?.type, null, 2));
      
      // Check if the types have the expected pagination structure
      const hasProductsPagination = productsField?.type?.ofType?.fields?.some(f => 
        f.name === 'nodes' || f.name === 'pageInfo' || f.name === 'totalCount'
      );
      
      const hasCategoriesPagination = categoriesField?.type?.ofType?.fields?.some(f => 
        f.name === 'nodes' || f.name === 'pageInfo' || f.name === 'totalCount'
      );
      
      console.log('Products has pagination fields:', hasProductsPagination);
      console.log('Categories has pagination fields:', hasCategoriesPagination);
      
      return hasProductsPagination && hasCategoriesPagination;
    }
  } catch (error) {
    console.log('❌ Introspection failed:', error.message);
    return false;
  }
  return false;
}

async function main() {
  console.log('Backend GraphQL Schema Fix Test');
  console.log('===============================');
  
  let allTestsPassed = true;
  
  // Test pagination queries
  const productsTest = await testQuery('GET_PRODUCTS_PAGINATED', GET_PRODUCTS_PAGINATED, { first: 5 });
  const categoriesTest = await testQuery('GET_CATEGORIES_PAGINATED', GET_CATEGORIES_PAGINATED);
  const introspectionTest = await testIntrospection();
  
  allTestsPassed = productsTest && categoriesTest && introspectionTest;
  
  console.log('\n=== Test Results ===');
  console.log('Products pagination:', productsTest ? '✅ PASS' : '❌ FAIL');
  console.log('Categories pagination:', categoriesTest ? '✅ PASS' : '❌ FAIL');
  console.log('Schema introspection:', introspectionTest ? '✅ PASS' : '❌ FAIL');
  console.log('Overall result:', allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  return allTestsPassed;
}

if (require.main === module) {
  main().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test script failed:', error);
    process.exit(1);
  });
}