const fetch = require('node-fetch');

// GraphQL endpoint
const GRAPHQL_URL = 'http://localhost:5001/graphql';

// Test queries that should fail with pagination arguments
const GET_USERS_WITH_PAGINATION = `
  query GetUsers($first: Int, $after: String) {
    users(first: $first, after: $after) {
      id
      firstName
      lastName
      email
      username
      isActive
      createdAt
      updatedAt
    }
  }
`;

const GET_PRODUCTS_WITH_PAGINATION = `
  query GetProducts($first: Int, $after: String) {
    products(first: $first, after: $after) {
      id
      name
      description
      price
      stockQuantity
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Test queries without pagination arguments
const GET_USERS_WITHOUT_PAGINATION = `
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
      username
      isActive
      createdAt
      updatedAt
    }
  }
`;

const GET_PRODUCTS_WITHOUT_PAGINATION = `
  query GetProducts {
    products {
      id
      name
      description
      price
      stockQuantity
      isActive
      createdAt
      updatedAt
    }
  }
`;

async function testQuery(query, variables = {}, description) {
  console.log(`\n=== Testing: ${description} ===`);
  
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });

    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    
    if (result.errors) {
      console.log('Errors:');
      result.errors.forEach(error => {
        console.log(`  - ${error.message}`);
      });
    }
    
    if (result.data) {
      console.log('Data received successfully');
      if (result.data.users) {
        console.log(`  Users count: ${result.data.users.length}`);
      }
      if (result.data.products) {
        console.log(`  Products count: ${result.data.products.length}`);
      }
    }
    
  } catch (error) {
    console.log(`Network error: ${error.message}`);
  }
}

async function main() {
  console.log('GraphQL Pagination Issue Reproduction Script');
  console.log('============================================');
  
  // Test the failing queries (with pagination arguments)
  await testQuery(
    GET_USERS_WITH_PAGINATION, 
    { first: 10 }, 
    'GET_USERS with pagination arguments (should fail)'
  );
  
  await testQuery(
    GET_PRODUCTS_WITH_PAGINATION, 
    { first: 10 }, 
    'GET_PRODUCTS with pagination arguments (should fail)'
  );
  
  // Test the working queries (without pagination arguments)
  await testQuery(
    GET_USERS_WITHOUT_PAGINATION, 
    {}, 
    'GET_USERS without pagination arguments (should work)'
  );
  
  await testQuery(
    GET_PRODUCTS_WITHOUT_PAGINATION, 
    {}, 
    'GET_PRODUCTS without pagination arguments (should work)'
  );
}

main().catch(console.error);