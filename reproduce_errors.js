#!/usr/bin/env node

/**
 * Script to reproduce the frontend GraphQL errors
 * This script will test the GraphQL queries that are failing
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

// Test queries that are failing
const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($first: Int = 8) {
    products(where: { isFeatured: { eq: true } }, first: $first) {
      nodes {
        id
        name
        description
        price
        compareAtPrice
        category {
          id
          name
        }
        images {
          id
          imageUrl
          altText
          isPrimary
        }
      }
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts(
    $where: ProductFilterInput
    $order: [ProductSortInput!]
    $first: Int
    $after: String
  ) {
    products(where: $where, order: $order, first: $first, after: $after) {
      nodes {
        id
        name
        description
        price
        category {
          id
          name
          slug
        }
        images {
          id
          imageUrl
          altText
          isPrimary
        }
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

const GET_CATEGORIES = gql`
  query GetCategories {
    categories(where: { isActive: { eq: true } }) {
      nodes {
        id
        name
        description
        slug
        imageUrl
        sortOrder
        parentCategoryId
        subCategories {
          id
          name
          slug
          sortOrder
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
      console.log('GraphQL Errors:');
      result.errors.forEach(error => {
        console.log(`- ${error.message}`);
        if (error.locations) {
          console.log(`  Location: line ${error.locations[0].line}, column ${error.locations[0].column}`);
        }
        if (error.path) {
          console.log(`  Path: ${error.path.join('.')}`);
        }
      });
    }
    
    if (result.data) {
      console.log('Query succeeded with data structure:');
      console.log(JSON.stringify(result.data, null, 2).substring(0, 500) + '...');
    }
    
  } catch (error) {
    console.log('Network/Client Error:');
    console.log(`- ${error.message}`);
    if (error.networkError) {
      console.log(`- Network Error: ${error.networkError.message}`);
      if (error.networkError.statusCode) {
        console.log(`- Status Code: ${error.networkError.statusCode}`);
      }
    }
  }
}

async function main() {
  console.log('GraphQL Error Reproduction Script');
  console.log('==================================');
  
  // Test the queries that are failing according to the issue
  await testQuery('GET_FEATURED_PRODUCTS', GET_FEATURED_PRODUCTS, { first: 8 });
  
  await testQuery('GET_PRODUCTS', GET_PRODUCTS, { 
    where: { isActive: { eq: true } }, 
    first: 24 
  });
  
  await testQuery('GET_CATEGORIES', GET_CATEGORIES);
  
  console.log('\n=== Summary ===');
  console.log('Expected errors:');
  console.log('1. Field `nodes` does not exist on type `Product`');
  console.log('2. Field `pageInfo` does not exist on type `Product`');
  console.log('3. Field `totalCount` does not exist on type `Product`');
  console.log('4. Argument `first` does not exist');
  console.log('5. Argument `after` does not exist');
  console.log('6. Field `nodes` does not exist on type `Category`');
}

if (require.main === module) {
  main().catch(console.error);
}