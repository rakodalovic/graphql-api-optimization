const { ApolloClient, InMemoryCache, createHttpLink, gql } = require('@apollo/client');

// Create Apollo Client
const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://localhost:5001/graphql',
  }),
  cache: new InMemoryCache(),
});

// Test query
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
    }
  }
`;

async function testConnection() {
  try {
    console.log('Testing GraphQL connection...');
    
    // Test version query
    console.log('\n1. Testing version query...');
    const versionResult = await client.query({ query: GET_VERSION });
    console.log('Version data:', versionResult.data);
    
    // Test users query
    console.log('\n2. Testing users query...');
    const usersResult = await client.query({ query: GET_USERS });
    console.log('Users data:', usersResult.data);
    console.log(`Found ${usersResult.data.users.length} users`);
    
    console.log('\n✅ All tests passed! The React frontend can successfully connect to the .NET GraphQL server.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();