const fetch = require('node-fetch');

const GRAPHQL_ENDPOINT = 'http://localhost:5001/graphql';

async function testGraphQLQuery(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

async function runTests() {
  console.log('=== Testing Current Issues ===\n');

  // Test 1: Featured products query (home page)
  console.log('1. Testing featured products query (home page)...');
  const featuredQuery = `
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
  
  const featuredResult = await testGraphQLQuery(featuredQuery, { first: 8 });
  if (featuredResult.errors) {
    console.log('❌ Featured products query failed:');
    featuredResult.errors.forEach(error => {
      console.log(`   - ${error.message}`);
    });
  } else {
    console.log('✅ Featured products query succeeded');
    console.log(`   Found ${featuredResult.data?.products?.nodes?.length || 0} featured products`);
  }

  // Test 2: Products with sorting (catalog page)
  console.log('\n2. Testing products with price sorting (catalog page)...');
  const sortedQuery = `
    query GetProducts($order: [ProductSortInput!]) {
      products(order: $order) {
        totalCount
        nodes {
          id
          name
          price
          category {
            id
            name
          }
        }
      }
    }
  `;
  
  const sortedResult = await testGraphQLQuery(sortedQuery, { 
    order: [{ price: 'ASC' }] 
  });
  if (sortedResult.errors) {
    console.log('❌ Products with sorting query failed:');
    sortedResult.errors.forEach(error => {
      console.log(`   - ${error.message}`);
    });
  } else {
    console.log('✅ Products with sorting query succeeded');
    console.log(`   Found ${sortedResult.data?.products?.totalCount || 0} products`);
  }

  // Test 3: Products without sorting
  console.log('\n3. Testing products without sorting...');
  const basicQuery = `
    query GetProducts {
      products {
        totalCount
        nodes {
          id
          name
          price
          category {
            id
            name
          }
        }
      }
    }
  `;
  
  const basicResult = await testGraphQLQuery(basicQuery);
  if (basicResult.errors) {
    console.log('❌ Basic products query failed:');
    basicResult.errors.forEach(error => {
      console.log(`   - ${error.message}`);
    });
  } else {
    console.log('✅ Basic products query succeeded');
    console.log(`   Found ${basicResult.data?.products?.totalCount || 0} products`);
  }

  console.log('\n=== Test Summary ===');
  console.log('If you see errors above, the issues are reproduced.');
  console.log('If all tests pass, the issues have been fixed.');
}

runTests().catch(console.error);