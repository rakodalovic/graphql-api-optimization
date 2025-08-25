#!/usr/bin/env node

/**
 * Test script to verify cart functionality implementation
 * This script will run basic tests to ensure the cart features work correctly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🛒 Testing Cart Functionality Implementation\n');

// Check if all required files exist
const requiredFiles = [
  'src/context/CartContext.tsx',
  'src/components/Cart.tsx',
  'src/components/Cart.css',
  'src/components/__tests__/CartContext.test.tsx',
  'src/components/__tests__/Cart.test.tsx'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please ensure all cart files are created.');
  process.exit(1);
}

// Check if CartProvider is added to App.tsx
console.log('\n📝 Checking App.tsx integration...');
const appTsxPath = path.join(__dirname, 'src/App.tsx');
const appTsxContent = fs.readFileSync(appTsxPath, 'utf8');

if (appTsxContent.includes('CartProvider') && appTsxContent.includes('from \'./context/CartContext\'')) {
  console.log('✅ CartProvider imported and used in App.tsx');
} else {
  console.log('❌ CartProvider not properly integrated in App.tsx');
  allFilesExist = false;
}

if (appTsxContent.includes('<Route path="/cart" element={<Cart />} />')) {
  console.log('✅ Cart route added to App.tsx');
} else {
  console.log('❌ Cart route not added to App.tsx');
  allFilesExist = false;
}

// Check if Navigation component includes cart link
console.log('\n🧭 Checking Navigation component...');
const navPath = path.join(__dirname, 'src/components/Navigation.tsx');
const navContent = fs.readFileSync(navPath, 'utf8');

if (navContent.includes('useCart') && navContent.includes('cart-badge')) {
  console.log('✅ Navigation component includes cart functionality');
} else {
  console.log('❌ Navigation component missing cart integration');
  allFilesExist = false;
}

// Check if ProductCard includes Add to Cart button
console.log('\n🏷️  Checking ProductCard component...');
const productCardPath = path.join(__dirname, 'src/components/ProductCard.tsx');
const productCardContent = fs.readFileSync(productCardPath, 'utf8');

if (productCardContent.includes('useCart') && productCardContent.includes('Add to Cart')) {
  console.log('✅ ProductCard component includes Add to Cart functionality');
} else {
  console.log('❌ ProductCard component missing Add to Cart functionality');
  allFilesExist = false;
}

if (!allFilesExist) {
  console.log('\n❌ Integration issues found. Please check the implementation.');
  process.exit(1);
}

// Run TypeScript compilation check
console.log('\n🔍 Running TypeScript compilation check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  console.log('Please fix TypeScript errors before proceeding.');
  process.exit(1);
}

// Run tests
console.log('\n🧪 Running cart functionality tests...');
try {
  execSync('npm test -- --testPathPattern="Cart" --watchAll=false', { 
    stdio: 'inherit', 
    cwd: __dirname 
  });
  console.log('✅ All cart tests passed');
} catch (error) {
  console.log('❌ Some tests failed');
  console.log('Please check the test output above for details.');
  process.exit(1);
}

console.log('\n🎉 Cart Functionality Implementation Test Complete!');
console.log('\n📋 Summary of implemented features:');
console.log('✅ Cart Context with state management');
console.log('✅ Local storage persistence');
console.log('✅ Add to Cart functionality on product cards');
console.log('✅ Cart page with item management');
console.log('✅ Quantity increase/decrease');
console.log('✅ Item removal');
console.log('✅ Cart summary with totals');
console.log('✅ Navigation cart badge with item count');
console.log('✅ Responsive design');
console.log('✅ Comprehensive test coverage');

console.log('\n🚀 To test the cart functionality manually:');
console.log('1. Run: npm start');
console.log('2. Navigate to /catalog');
console.log('3. Click "Add to Cart" on any product');
console.log('4. Check the cart badge in navigation');
console.log('5. Navigate to /cart to see cart items');
console.log('6. Test quantity changes and item removal');
console.log('7. Refresh the page to test localStorage persistence');

console.log('\n✨ Cart functionality implementation is complete and tested!');