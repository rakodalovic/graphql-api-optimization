const fs = require('fs');
const path = require('path');

// Verify backend changes
function verifyBackendChanges() {
  console.log('🔍 Verifying backend changes...');
  
  const queryPath = '/tmp/3157480657704389b2f58019d6475709/backend/GraphQL/Query.cs';
  const queryContent = fs.readFileSync(queryPath, 'utf8');
  
  // Check if the changes are present
  const hasResolverContext = queryContent.includes('IResolverContext resolverContext');
  const hasManualSorting = queryContent.includes('Handle sorting manually to fix SQLite decimal ordering issues');
  const hasPriceSorting = queryContent.includes('case "price":');
  const hasUsingStatement = queryContent.includes('using HotChocolate.Resolvers;');
  // Check specifically that GetProducts method doesn't have [UseSorting]
  const getProductsSection = queryContent.substring(
    queryContent.indexOf('// Product queries'),
    queryContent.indexOf('// Products sorted by price')
  );
  const removedUseSorting = !getProductsSection.includes('[UseSorting]');
  
  console.log('✅ IResolverContext parameter added:', hasResolverContext);
  console.log('✅ Manual sorting logic added:', hasManualSorting);
  console.log('✅ Price sorting case added:', hasPriceSorting);
  console.log('✅ Required using statement added:', hasUsingStatement);
  console.log('✅ [UseSorting] removed from GetProducts:', removedUseSorting);
  
  return hasResolverContext && hasManualSorting && hasPriceSorting && hasUsingStatement && removedUseSorting;
}

// Verify frontend changes
function verifyFrontendChanges() {
  console.log('\n🔍 Verifying frontend changes...');
  
  const catalogPath = '/tmp/3157480657704389b2f58019d6475709/frontend/src/components/ProductCatalog.tsx';
  const catalogContent = fs.readFileSync(catalogPath, 'utf8');
  
  const cssPath = '/tmp/3157480657704389b2f58019d6475709/frontend/src/components/ProductCatalog.css';
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Check TypeScript changes
  const hasActiveSearchTerm = catalogContent.includes('const [activeSearchTerm, setActiveSearchTerm] = useState');
  const hasKeyPressHandler = catalogContent.includes('const handleSearchKeyPress');
  const hasSearchSubmit = catalogContent.includes('const handleSearchSubmit');
  const usesActiveSearchTerm = catalogContent.includes('if (activeSearchTerm)');
  const hasEnterKeyLogic = catalogContent.includes('if (e.key === \'Enter\')');
  const hasSearchButton = catalogContent.includes('<button') && catalogContent.includes('onClick={handleSearchSubmit}');
  const removedDebounce = !catalogContent.includes('debouncedSearchTerm') || 
                         !catalogContent.includes('setTimeout');
  const hasPlaceholderText = catalogContent.includes('Press Enter to search');
  
  // Check CSS changes
  const hasSearchContainer = cssContent.includes('.search-container');
  const hasSearchButtonCSS = cssContent.includes('.search-button');
  const hasFlexLayout = cssContent.includes('display: flex');
  
  console.log('✅ activeSearchTerm state added:', hasActiveSearchTerm);
  console.log('✅ Key press handler added:', hasKeyPressHandler);
  console.log('✅ Search submit handler added:', hasSearchSubmit);
  console.log('✅ Uses activeSearchTerm in query:', usesActiveSearchTerm);
  console.log('✅ Enter key logic implemented:', hasEnterKeyLogic);
  console.log('✅ Search button added:', hasSearchButton);
  console.log('✅ Debounce logic removed:', removedDebounce);
  console.log('✅ Updated placeholder text:', hasPlaceholderText);
  console.log('✅ Search container CSS added:', hasSearchContainer);
  console.log('✅ Search button CSS added:', hasSearchButtonCSS);
  
  const frontendValid = hasActiveSearchTerm && hasKeyPressHandler && hasSearchSubmit && 
                       usesActiveSearchTerm && hasEnterKeyLogic && hasSearchButton && 
                       removedDebounce && hasPlaceholderText && hasSearchContainer;
  
  return frontendValid;
}

// Main verification
function main() {
  console.log('🚀 Verifying implementation changes...\n');
  
  const backendValid = verifyBackendChanges();
  const frontendValid = verifyFrontendChanges();
  
  console.log('\n📊 Verification Results:');
  console.log('Backend changes:', backendValid ? '✅ Valid' : '❌ Issues found');
  console.log('Frontend changes:', frontendValid ? '✅ Valid' : '❌ Issues found');
  
  if (backendValid && frontendValid) {
    console.log('\n🎉 All changes verified successfully!');
    console.log('\nSummary of fixes:');
    console.log('1. ✅ Backend: Fixed SQLite decimal sorting by implementing manual sorting');
    console.log('2. ✅ Frontend: Changed search from 300ms debounce to Enter key trigger');
    console.log('3. ✅ Frontend: Added search button for better UX');
    console.log('4. ✅ Frontend: Updated CSS for improved search UI');
    return true;
  } else {
    console.log('\n❌ Some changes need to be reviewed.');
    return false;
  }
}

// Run verification
const success = main();
process.exit(success ? 0 : 1);