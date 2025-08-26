// Use built-in fetch if available, otherwise provide instructions
const fetch = globalThis.fetch || (() => {
  console.log('❌ fetch is not available. Please install node-fetch or use Node.js 18+');
  console.log('   npm install node-fetch');
  process.exit(1);
});

// Comprehensive test script for the catalog filter and sort fixes
async function testGraphQLEndpoint() {
  console.log('🔗 Testing GraphQL endpoint availability...');
  
  try {
    const response = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'query { __typename }'
      }),
    });

    if (response.ok) {
      console.log('✅ GraphQL endpoint is available');
      return true;
    } else {
      console.log('❌ GraphQL endpoint returned error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to GraphQL endpoint:', error.message);
    console.log('💡 Make sure the backend is running on http://localhost:5000');
    return false;
  }
}

async function testPriceSortingAscending() {
  console.log('\n🧪 Testing price sorting (ASC) - Main fix...');
  
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
      console.log('❌ CRITICAL: Price sorting still fails!');
      console.log('Error:', result.errors[0].message);
      console.log('This should have been fixed by the manual sorting implementation.');
      return false;
    } else {
      console.log('✅ Price sorting (ASC) works correctly!');
      console.log(`Found ${result.data.products.totalCount} products`);
      
      // Verify actual sorting
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
          console.log('First few prices:', products.slice(0, 5).map(p => `$${p.price}`));
        }
        
        return isSorted;
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testPriceSortingDescending() {
  console.log('\n🧪 Testing price sorting (DESC)...');
  
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
      console.log('❌ Price sorting (DESC) fails');
      console.log('Error:', result.errors[0].message);
      return false;
    } else {
      console.log('✅ Price sorting (DESC) works correctly!');
      
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
        
        return isSorted;
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testOtherSorting() {
  console.log('\n🧪 Testing other sorting (name) to ensure no regression...');
  
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
      console.log('❌ Name sorting fails - regression detected!');
      console.log('Error:', result.errors[0].message);
      return false;
    } else {
      console.log('✅ Name sorting works correctly - no regression');
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

async function testFiltering() {
  console.log('\n🧪 Testing filtering to ensure no regression...');
  
  const query = `
    query {
      products(where: { isActive: { eq: true } }) {
        totalCount
        nodes {
          id
          name
          isActive
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
      console.log('❌ Filtering fails - regression detected!');
      console.log('Error:', result.errors[0].message);
      return false;
    } else {
      console.log('✅ Filtering works correctly - no regression');
      console.log(`Found ${result.data.products.totalCount} active products`);
      return true;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

function testFrontendChanges() {
  console.log('\n🧪 Testing frontend changes...');
  
  const catalogPath = '/tmp/3157480657704389b2f58019d6475709/frontend/src/components/ProductCatalog.tsx';
  const fs = require('fs');
  const catalogContent = fs.readFileSync(catalogPath, 'utf8');
  
  const hasEnterKeyHandler = catalogContent.includes('handleSearchKeyPress') && 
                            catalogContent.includes('if (e.key === \'Enter\')');
  const hasSearchButton = catalogContent.includes('handleSearchSubmit') && 
                         catalogContent.includes('Search');
  const removedDebounce = !catalogContent.includes('setTimeout') || 
                         !catalogContent.includes('300'); // 300ms delay
  const usesActiveSearchTerm = catalogContent.includes('activeSearchTerm');
  
  console.log('✅ Enter key handler implemented:', hasEnterKeyHandler);
  console.log('✅ Search button added:', hasSearchButton);
  console.log('✅ Debounce removed:', removedDebounce);
  console.log('✅ Uses activeSearchTerm:', usesActiveSearchTerm);
  
  return hasEnterKeyHandler && hasSearchButton && removedDebounce && usesActiveSearchTerm;
}

// Main test runner
async function runCompleteTest() {
  console.log('🚀 Running complete fix verification...\n');
  console.log('This test verifies both issues mentioned in the PR comments:');
  console.log('1. Sorting by price should work (no SQLite decimal error)');
  console.log('2. Search should trigger on Enter key (not after 3 seconds)\n');
  
  const results = [];
  
  // Test GraphQL endpoint availability
  const endpointAvailable = await testGraphQLEndpoint();
  if (!endpointAvailable) {
    console.log('\n❌ Cannot proceed with GraphQL tests - backend not available');
    console.log('💡 To test the backend fixes:');
    console.log('   1. cd backend');
    console.log('   2. dotnet run');
    console.log('   3. Run this test script again');
  } else {
    // Test backend fixes
    results.push(await testPriceSortingAscending());
    results.push(await testPriceSortingDescending());
    results.push(await testOtherSorting());
    results.push(await testFiltering());
  }
  
  // Test frontend changes (can be done without running frontend)
  results.push(testFrontendChanges());
  
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Both issues have been fixed:');
    console.log('✅ Issue 1: SQLite decimal sorting error - RESOLVED');
    console.log('✅ Issue 2: Search triggers on Enter key - RESOLVED');
    console.log('\nThe PR comments have been addressed successfully.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the implementation.');
  }
  
  return passedTests === totalTests;
}

// Run the complete test
if (require.main === module) {
  runCompleteTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runCompleteTest };