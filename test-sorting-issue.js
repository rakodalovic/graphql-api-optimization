const fetch = require('node-fetch');

// Test script to reproduce the sorting issue
async function testSorting() {
  const query = `
    query {
      products(order: { price: ASC }) {
        totalCount
        edges {
          cursor
          node {
            id
            name
            price
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    console.log('GraphQL Response:');
    console.log(JSON.stringify(result, null, 2));

    if (result.errors) {
      console.log('\n❌ Sorting issue reproduced!');
      console.log('Error:', result.errors[0].message);
      return false;
    } else {
      console.log('\n✅ Sorting works correctly!');
      return true;
    }
  } catch (error) {
    console.error('Network error:', error.message);
    return false;
  }
}

// Run the test
testSorting().then(success => {
  process.exit(success ? 0 : 1);
});