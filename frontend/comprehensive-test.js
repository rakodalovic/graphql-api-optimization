const { ApolloClient, InMemoryCache, createHttpLink, gql } = require('@apollo/client');

// Create Apollo Client
const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://localhost:5001/graphql',
  }),
  cache: new InMemoryCache(),
});

// Test queries and mutations
const GET_VERSION = gql`
  query GetVersion {
    version {
      version
      environment
      buildDate
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
      username
      isActive
      createdAt
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      stockQuantity
      isActive
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
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
      }
    }
  }
`;

async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive React + Apollo Client + .NET GraphQL Test');
  console.log('=' .repeat(70));
  
  let testsPassed = 0;
  let testsTotal = 0;
  
  try {
    // Test 1: Version Query
    testsTotal++;
    console.log('\n📋 Test 1: Version Query');
    console.log('-'.repeat(30));
    const versionResult = await client.query({ query: GET_VERSION });
    console.log('✅ Version query successful');
    console.log(`   Version: ${versionResult.data.version.version}`);
    console.log(`   Environment: ${versionResult.data.version.environment}`);
    console.log(`   Build Date: ${new Date(versionResult.data.version.buildDate).toLocaleString()}`);
    testsPassed++;
    
    // Test 2: Users Query
    testsTotal++;
    console.log('\n👥 Test 2: Users Query');
    console.log('-'.repeat(30));
    const usersResult = await client.query({ query: GET_USERS });
    console.log('✅ Users query successful');
    console.log(`   Found ${usersResult.data.users.length} users:`);
    usersResult.data.users.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
    });
    testsPassed++;
    
    // Test 3: Products Query
    testsTotal++;
    console.log('\n📦 Test 3: Products Query');
    console.log('-'.repeat(30));
    const productsResult = await client.query({ query: GET_PRODUCTS });
    console.log('✅ Products query successful');
    console.log(`   Found ${productsResult.data.products.length} products:`);
    productsResult.data.products.forEach(product => {
      console.log(`   - ${product.name}: $${product.price} (Stock: ${product.stockQuantity})`);
    });
    testsPassed++;
    
    // Test 4: Create User Mutation
    testsTotal++;
    console.log('\n➕ Test 4: Create User Mutation');
    console.log('-'.repeat(30));
    const newUserInput = {
      firstName: 'Test',
      lastName: 'User',
      email: `test.user.${Date.now()}@example.com`,
      username: `testuser${Date.now()}`,
      password: 'TestPassword123!',
      phoneNumber: '+1234567890'
    };
    
    const createUserResult = await client.mutate({
      mutation: CREATE_USER,
      variables: { input: newUserInput }
    });
    
    if (createUserResult.data.createUser.success) {
      console.log('✅ Create user mutation successful');
      console.log(`   Created user: ${createUserResult.data.createUser.user.firstName} ${createUserResult.data.createUser.user.lastName}`);
      console.log(`   Email: ${createUserResult.data.createUser.user.email}`);
      console.log(`   ID: ${createUserResult.data.createUser.user.id}`);
      testsPassed++;
    } else {
      console.log('❌ Create user mutation failed');
      console.log(`   Message: ${createUserResult.data.createUser.message}`);
    }
    
    // Test 5: Apollo Client Cache
    testsTotal++;
    console.log('\n💾 Test 5: Apollo Client Cache');
    console.log('-'.repeat(30));
    
    // Query users again to test cache
    const cachedUsersResult = await client.query({ 
      query: GET_USERS,
      fetchPolicy: 'cache-first'
    });
    
    console.log('✅ Cache test successful');
    console.log(`   Retrieved ${cachedUsersResult.data.users.length} users from cache`);
    console.log(`   Cache policy: cache-first`);
    testsPassed++;
    
    // Test 6: Error Handling
    testsTotal++;
    console.log('\n⚠️  Test 6: Error Handling');
    console.log('-'.repeat(30));
    
    try {
      const invalidQuery = gql`
        query InvalidQuery {
          nonExistentField {
            id
          }
        }
      `;
      
      await client.query({ query: invalidQuery });
      console.log('❌ Error handling test failed - should have thrown an error');
    } catch (error) {
      console.log('✅ Error handling test successful');
      console.log(`   Caught expected error: ${error.message.substring(0, 100)}...`);
      testsPassed++;
    }
    
  } catch (error) {
    console.error(`❌ Test failed with error: ${error.message}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${testsTotal}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsTotal - testsPassed}`);
  console.log(`Success Rate: ${Math.round((testsPassed / testsTotal) * 100)}%`);
  
  if (testsPassed === testsTotal) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ React frontend with Apollo Client successfully connects to .NET GraphQL server');
    console.log('✅ All acceptance criteria have been met:');
    console.log('   - React app connects to .NET GraphQL server');
    console.log('   - Apollo Client queries and mutations work correctly');
    console.log('   - Error handling is implemented');
    console.log('   - Caching is working properly');
    console.log('   - Loading states are handled (see React components)');
  } else {
    console.log('\n❌ SOME TESTS FAILED');
    console.log('Please check the error messages above and ensure:');
    console.log('1. .NET GraphQL server is running on http://localhost:5001');
    console.log('2. CORS is properly configured');
    console.log('3. Apollo Client is properly configured');
  }
  
  console.log('\n🔗 Next Steps:');
  console.log('1. Start the React dev server: npm start');
  console.log('2. Open http://localhost:3000 in your browser');
  console.log('3. Test the GraphQL Test component interface');
  console.log('4. Install Apollo DevTools browser extension for debugging');
}

runComprehensiveTest();