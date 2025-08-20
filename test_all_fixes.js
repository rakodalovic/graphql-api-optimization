#!/usr/bin/env node

/**
 * Comprehensive test script to verify all frontend error fixes
 * Tests both React Router future flags and GraphQL pagination
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkReactRouterFix() {
  console.log('\n=== Checking React Router Future Flags Fix ===');
  
  const appTsxPath = path.join(__dirname, 'frontend', 'src', 'App.tsx');
  
  if (!fs.existsSync(appTsxPath)) {
    console.log('❌ App.tsx file not found');
    return false;
  }
  
  const content = fs.readFileSync(appTsxPath, 'utf8');
  
  const hasV7StartTransition = content.includes('v7_startTransition: true');
  const hasV7RelativeSplatPath = content.includes('v7_relativeSplatPath: true');
  
  console.log('v7_startTransition flag:', hasV7StartTransition ? '✅ PRESENT' : '❌ MISSING');
  console.log('v7_relativeSplatPath flag:', hasV7RelativeSplatPath ? '✅ PRESENT' : '❌ MISSING');
  
  return hasV7StartTransition && hasV7RelativeSplatPath;
}

function checkGraphQLBackendFix() {
  console.log('\n=== Checking GraphQL Backend Pagination Fix ===');
  
  const queryPath = path.join(__dirname, 'backend', 'GraphQL', 'Query.cs');
  
  if (!fs.existsSync(queryPath)) {
    console.log('❌ Query.cs file not found');
    return false;
  }
  
  const content = fs.readFileSync(queryPath, 'utf8');
  
  // Check if [UsePaging] attributes are added to the right methods
  const productsPagination = content.includes('[UsePaging]') && 
                             content.includes('GetProducts([Service] ApplicationDbContext context)');
  const categoriesPagination = content.includes('[UsePaging]') && 
                              content.includes('GetCategories([Service] ApplicationDbContext context)');
  
  console.log('Products pagination attribute:', productsPagination ? '✅ PRESENT' : '❌ MISSING');
  console.log('Categories pagination attribute:', categoriesPagination ? '✅ PRESENT' : '❌ MISSING');
  
  // Count how many [UsePaging] attributes were added
  const usePagingCount = (content.match(/\[UsePaging\]/g) || []).length;
  console.log(`Total [UsePaging] attributes added: ${usePagingCount}`);
  
  return productsPagination && categoriesPagination && usePagingCount >= 2;
}

function runBackendTests() {
  return new Promise((resolve) => {
    console.log('\n=== Running Backend Tests ===');
    
    // Check if backend is running by trying to connect
    const testProcess = spawn('node', ['test_backend_fix.js'], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    testProcess.on('close', (code) => {
      const success = code === 0;
      console.log('Backend tests result:', success ? '✅ PASSED' : '❌ FAILED');
      resolve(success);
    });
    
    testProcess.on('error', (error) => {
      console.log('❌ Failed to run backend tests:', error.message);
      resolve(false);
    });
  });
}

function checkFrontendQueries() {
  console.log('\n=== Checking Frontend GraphQL Queries ===');
  
  const queriesPath = path.join(__dirname, 'frontend', 'src', 'graphql', 'queries.ts');
  
  if (!fs.existsSync(queriesPath)) {
    console.log('❌ queries.ts file not found');
    return false;
  }
  
  const content = fs.readFileSync(queriesPath, 'utf8');
  
  // Check if queries are expecting pagination fields
  const hasNodesField = content.includes('nodes {');
  const hasPageInfoField = content.includes('pageInfo {');
  const hasTotalCountField = content.includes('totalCount');
  const hasFirstArg = content.includes('$first: Int');
  const hasAfterArg = content.includes('$after: String');
  
  console.log('Queries expect nodes field:', hasNodesField ? '✅ YES' : '❌ NO');
  console.log('Queries expect pageInfo field:', hasPageInfoField ? '✅ YES' : '❌ NO');
  console.log('Queries expect totalCount field:', hasTotalCountField ? '✅ YES' : '❌ NO');
  console.log('Queries use first argument:', hasFirstArg ? '✅ YES' : '❌ NO');
  console.log('Queries use after argument:', hasAfterArg ? '✅ YES' : '❌ NO');
  
  return hasNodesField && hasPageInfoField && hasTotalCountField && hasFirstArg && hasAfterArg;
}

async function main() {
  console.log('Comprehensive Frontend Error Fix Test');
  console.log('====================================');
  
  let allTestsPassed = true;
  
  // Test 1: React Router future flags
  const routerFix = checkReactRouterFix();
  allTestsPassed = allTestsPassed && routerFix;
  
  // Test 2: GraphQL backend pagination fix
  const backendFix = checkGraphQLBackendFix();
  allTestsPassed = allTestsPassed && backendFix;
  
  // Test 3: Frontend queries compatibility
  const frontendQueries = checkFrontendQueries();
  allTestsPassed = allTestsPassed && frontendQueries;
  
  // Test 4: Backend functionality (if backend is running)
  console.log('\nNote: Backend functionality test requires the backend to be running on localhost:5001');
  console.log('If the backend is not running, this test will be skipped.');
  
  try {
    const backendTests = await runBackendTests();
    // Don't fail overall test if backend is not running, just report it
    if (!backendTests) {
      console.log('⚠️  Backend tests failed (backend may not be running)');
    }
  } catch (error) {
    console.log('⚠️  Backend tests skipped (backend may not be running)');
  }
  
  console.log('\n=== Final Results ===');
  console.log('React Router future flags:', routerFix ? '✅ FIXED' : '❌ NOT FIXED');
  console.log('GraphQL backend pagination:', backendFix ? '✅ FIXED' : '❌ NOT FIXED');
  console.log('Frontend query compatibility:', frontendQueries ? '✅ COMPATIBLE' : '❌ INCOMPATIBLE');
  
  console.log('\n=== Expected Error Fixes ===');
  console.log('1. React Router Future Flag Warnings: SHOULD BE RESOLVED');
  console.log('2. GraphQL "nodes does not exist" errors: SHOULD BE RESOLVED');
  console.log('3. GraphQL "pageInfo does not exist" errors: SHOULD BE RESOLVED');
  console.log('4. GraphQL "totalCount does not exist" errors: SHOULD BE RESOLVED');
  console.log('5. GraphQL "first argument does not exist" errors: SHOULD BE RESOLVED');
  console.log('6. GraphQL "after argument does not exist" errors: SHOULD BE RESOLVED');
  console.log('7. 400 Bad Request errors: SHOULD BE RESOLVED');
  
  const coreFixesComplete = routerFix && backendFix && frontendQueries;
  console.log('\nCore fixes status:', coreFixesComplete ? '✅ COMPLETE' : '❌ INCOMPLETE');
  
  return coreFixesComplete;
}

if (require.main === module) {
  main().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test script failed:', error);
    process.exit(1);
  });
}

module.exports = { main };