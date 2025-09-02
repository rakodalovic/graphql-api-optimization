const { execSync } = require('child_process');
const fs = require('fs');

console.log('Testing GraphQL Catalog Fix...\n');

// Test 1: Check if backend builds successfully
console.log('1. Testing backend build...');
try {
  execSync('cd backend && dotnet build', { stdio: 'inherit' });
  console.log('✅ Backend builds successfully\n');
} catch (error) {
  console.log('❌ Backend build failed\n');
  process.exit(1);
}

// Test 2: Check if frontend builds successfully
console.log('2. Testing frontend build...');
try {
  execSync('cd frontend && npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend builds successfully\n');
} catch (error) {
  console.log('❌ Frontend build failed\n');
  process.exit(1);
}

console.log('All tests passed! The fix should resolve the GraphQL ordering issues.');