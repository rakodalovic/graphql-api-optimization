const fetch = require('node-fetch');

const GRAPHQL_ENDPOINT = 'http://localhost:5001/graphql';

// Test queries
const queries = [
  {
    name: 'Featured Products (HomePage)',
    query: `
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
    `,
    variables: { first: 8 }
  },
  {
    name: 'Products with Price Sorting (Catalog)',
    query: `
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
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `,
    variables: {
      where: { isActive: { eq: true } },
      order: [{ price: "ASC" }],
      first: 24
    }
  }
];

async function testQuery(query, variables, name) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log(`❌ ${name} failed:`);
      console.log(JSON.stringify(result.errors, null, 2));
      return false;
    } else {
      console.log(`✅ ${name} succeeded`);
      console.log(`   Products returned: ${result.data.products?.nodes?.length || 0}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ ${name} failed with network error:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('Testing GraphQL queries...\n');
  
  let allPassed = true;
  
  for (const { name, query, variables } of queries) {
    const passed = await testQuery(query, variables, name);
    allPassed = allPassed && passed;
    console.log('');
  }
  
  if (allPassed) {
    console.log('🎉 All GraphQL tests passed!');
  } else {
    console.log('❌ Some GraphQL tests failed. Please check the backend logs.');
  }
}

// Note: This test requires the backend to be running
console.log('Note: Make sure the backend is running on http://localhost:5001');
console.log('Run: cd backend && dotnet run\n');

runTests();