// Test script to verify the pagination fix
// This script tests that the GraphQL queries work without pagination arguments

const { execSync } = require('child_process');

console.log('GraphQL Pagination Fix Verification');
console.log('===================================');

// Test function to execute GraphQL queries
function testGraphQLQuery(query, variables = {}, description) {
  console.log(`\n${description}`);
  console.log('-'.repeat(description.length));
  
  try {
    const payload = JSON.stringify({ query, variables });
    const command = `curl -s -X POST http://localhost:5001/graphql -H "Content-Type: application/json" -d '${payload}'`;
    const result = execSync(command, { encoding: 'utf-8' });
    const response = JSON.parse(result);
    
    if (response.errors) {
      console.log('❌ FAILED - Errors found:');
      response.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
      return false;
    } else if (response.data) {
      console.log('✅ SUCCESS - Query executed successfully');
      if (response.data.users) {
        console.log(`   Users returned: ${response.data.users.length}`);
      }
      if (response.data.products) {
        console.log(`   Products returned: ${response.data.products.length}`);
      }
      if (response.data.createUser) {
        console.log(`   User created: ${response.data.createUser.success ? 'Yes' : 'No'}`);
      }
      return true;
    } else {
      console.log('❌ FAILED - No data returned');
      return false;
    }
  } catch (error) {
    console.log(`❌ FAILED - Error: ${error.message}`);
    return false;
  }
}

// Test queries
const tests = [
  {
    description: 'GET_USERS Query (Fixed)',
    query: `query GetUsers {
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
    }`
  },
  {
    description: 'GET_PRODUCTS Query (Fixed)', 
    query: `query GetProducts {
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
    }`
  },
  {
    description: 'CREATE_USER Mutation (Should still work)',
    query: `mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        success
        message
        user {
          id
          firstName
          lastName
          email
          username
          isActive
          createdAt
        }
      }
    }`,
    variables: {
      input: {
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@test.com',
        username: 'integrationtest',
        password: 'password123',
        phoneNumber: '+1234567890'
      }
    }
  }
];

// Run all tests
let allPassed = true;
for (const test of tests) {
  const passed = testGraphQLQuery(test.query, test.variables, test.description);
  if (!passed) {
    allPassed = false;
  }
}

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('🎉 ALL TESTS PASSED - Fix is working correctly!');
} else {
  console.log('❌ SOME TESTS FAILED - Fix needs review');
  process.exit(1);
}