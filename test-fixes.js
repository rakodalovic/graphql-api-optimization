const fetch = require('node-fetch');

// Test script to verify both fixes
async function testSortingFix() {
  console.log('🧪 Testing sorting fix...');
  
  const query = `
    query {
      products(order: { price: ASC }) {
        totalCount
        nodes {
          id
          name
          price
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
    
    if (result.errors) {
      console.log('❌ Sorting issue still exists:');
      console.log('Error:', result.errors[0].message);
      return false;
    } else {
      console.log('✅ Sorting works correctly!');
      console.log(`Found ${result.data.products.totalCount} products`);
      
      // Check if products are actually sorted by price
      const products = result.data.products.nodes;
      if (products.length > 1) {
        let isSorted = true;
        for (let i = 1; i < products.length; i++) {
          if (products[i].price < products[i-1].price) {
            isSorted = false;
            break;
          }
        }
        
        if (isSorted) {
          console.log('✅ Products are correctly sorted by price (ascending)');
          console.log('Sample prices:', products.slice(0, 3).map(p => `${p.name}: $${p.price}`));
        } else {
          console.log('⚠️  Products returned but not correctly sorted');
        }
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testDescendingSorting() {
  console.log('\n🧪 Testing descending price sorting...');
  
  const query = `
    query {
      products(order: { price: DESC }) {
        totalCount
        nodes {
          id
          name
          price
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
    
    if (result.errors) {
      console.log('❌ Descending sorting issue:');
      console.log('Error:', result.errors[0].message);
      return false;
    } else {
      console.log('✅ Descending sorting works correctly!');
      
      // Check if products are actually sorted by price descending
      const products = result.data.products.nodes;
      if (products.length > 1) {
        let isSorted = true;
        for (let i = 1; i < products.length; i++) {
          if (products[i].price > products[i-1].price) {
            isSorted = false;
            break;
          }
        }
        
        if (isSorted) {
          console.log('✅ Products are correctly sorted by price (descending)');
          console.log('Sample prices:', products.slice(0, 3).map(p => `${p.name}: $${p.price}`));
        } else {
          console.log('⚠️  Products returned but not correctly sorted');
        }
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testNameSorting() {
  console.log('\n🧪 Testing name sorting (should still work)...');
  
  const query = `
    query {
      products(order: { name: ASC }) {
        totalCount
        nodes {
          id
          name
          price
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
    
    if (result.errors) {
      console.log('❌ Name sorting issue:');
      console.log('Error:', result.errors[0].message);
      return false;
    } else {
      console.log('✅ Name sorting works correctly!');
      const products = result.data.products.nodes;
      if (products.length > 1) {
        console.log('Sample names:', products.slice(0, 3).map(p => p.name));
      }
      return true;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Running fix verification tests...\n');
  
  const results = [];
  results.push(await testSortingFix());
  results.push(await testDescendingSorting());
  results.push(await testNameSorting());
  
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The sorting fix is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the backend implementation.');
  }
  
  return passedTests === totalTests;
}

// Run the tests
runTests().then(success => {
  process.exit(success ? 0 : 1);
});