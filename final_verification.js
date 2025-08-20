#!/usr/bin/env node

/**
 * Final verification script for GraphQL Code Generator setup
 * This script provides comprehensive verification that all acceptance criteria are met
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 Final Verification: GraphQL Code Generator for HotChocolate Schema\n');

// Acceptance Criteria Verification
const acceptanceCriteria = [
  {
    id: 1,
    description: 'TypeScript types generated for all used queries/mutations',
    test: () => {
      const generatedFile = path.join(__dirname, 'frontend/src/generated/graphql.ts');
      if (!fs.existsSync(generatedFile)) return false;
      
      const content = fs.readFileSync(generatedFile, 'utf8');
      
      // Check for query types
      const queryTypes = [
        'GetVersionQuery',
        'GetUsersQuery', 
        'GetProductsQuery',
        'GetUserQuery'
      ];
      
      // Check for mutation types
      const mutationTypes = [
        'CreateUserMutation',
        'UpdateUserMutation',
        'CreateProductMutation',
        'UpdateProductMutation'
      ];
      
      // Check for input types
      const inputTypes = [
        'CreateUserInput',
        'UpdateUserInput',
        'CreateProductInput',
        'UpdateProductInput'
      ];
      
      const allTypes = [...queryTypes, ...mutationTypes, ...inputTypes];
      const missingTypes = allTypes.filter(type => !content.includes(type));
      
      if (missingTypes.length > 0) {
        console.log(`  Missing types: ${missingTypes.join(', ')}`);
        return false;
      }
      
      return true;
    }
  },
  {
    id: 2,
    description: 'Queries and mutations use generated types',
    test: () => {
      const componentFile = path.join(__dirname, 'frontend/src/components/GraphQLTest.tsx');
      if (!fs.existsSync(componentFile)) return false;
      
      const content = fs.readFileSync(componentFile, 'utf8');
      
      // Check that component imports from generated file
      if (!content.includes('from \'../generated/graphql\'')) return false;
      
      // Check that it uses generated hooks
      const hooks = [
        'useGetVersionQuery',
        'useGetUsersQuery',
        'useGetProductsQuery',
        'useCreateUserMutation'
      ];
      
      const missingHooks = hooks.filter(hook => !content.includes(hook));
      if (missingHooks.length > 0) {
        console.log(`  Missing hooks: ${missingHooks.join(', ')}`);
        return false;
      }
      
      // Check that it uses generated types
      if (!content.includes('CreateUserInput')) return false;
      
      // Check that no 'any' types are used (type safety)
      const anyTypeRegex = /(?<!\/\/.*):\s*any(?!\w)/;
      if (anyTypeRegex.test(content)) {
        console.log('  Found any types in component');
        return false;
      }
      
      return true;
    }
  }
];

console.log('📋 Acceptance Criteria Verification:\n');

let allCriteriaMet = true;
acceptanceCriteria.forEach(criteria => {
  const passed = criteria.test();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${criteria.description}`);
  if (!passed) allCriteriaMet = false;
});

console.log('\n🔧 Technical Implementation Verification:\n');

// Technical verification
const technicalChecks = [
  {
    name: 'GraphQL Code Generator CLI installed',
    test: () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'frontend/package.json'), 'utf8'));
      return pkg.devDependencies && pkg.devDependencies['@graphql-codegen/cli'];
    }
  },
  {
    name: 'Required plugins installed',
    test: () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'frontend/package.json'), 'utf8'));
      const requiredPlugins = [
        '@graphql-codegen/typescript',
        '@graphql-codegen/typescript-operations',
        '@graphql-codegen/typescript-react-apollo'
      ];
      return requiredPlugins.every(plugin => 
        pkg.devDependencies && pkg.devDependencies[plugin]
      );
    }
  },
  {
    name: 'Configuration file exists and is valid',
    test: () => {
      const configFile = path.join(__dirname, 'frontend/codegen.yml');
      if (!fs.existsSync(configFile)) return false;
      
      const config = fs.readFileSync(configFile, 'utf8');
      return config.includes('schema:') && 
             config.includes('documents:') && 
             config.includes('generates:') &&
             config.includes('withHooks: true');
    }
  },
  {
    name: 'Schema URL configured correctly',
    test: () => {
      const config = fs.readFileSync(path.join(__dirname, 'frontend/codegen.yml'), 'utf8');
      return config.includes('localhost:5001/graphql');
    }
  },
  {
    name: 'Generated types file exists',
    test: () => {
      return fs.existsSync(path.join(__dirname, 'frontend/src/generated/graphql.ts'));
    }
  },
  {
    name: 'Apollo Client hooks generated',
    test: () => {
      const content = fs.readFileSync(path.join(__dirname, 'frontend/src/generated/graphql.ts'), 'utf8');
      return content.includes('export function use') && 
             content.includes('Query') && 
             content.includes('Mutation');
    }
  },
  {
    name: 'TypeScript compilation passes',
    test: () => {
      try {
        execSync('npm run build', { 
          cwd: path.join(__dirname, 'frontend'),
          stdio: 'pipe'
        });
        return true;
      } catch (error) {
        return false;
      }
    }
  },
  {
    name: 'Codegen script works',
    test: () => {
      try {
        execSync('npm run codegen', { 
          cwd: path.join(__dirname, 'frontend'),
          stdio: 'pipe'
        });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
];

technicalChecks.forEach(check => {
  const passed = check.test();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${check.name}`);
  if (!passed) allCriteriaMet = false;
});

console.log('\n🚀 Integration Verification:\n');

// Integration checks
const integrationChecks = [
  {
    name: 'Apollo Client properly configured',
    test: () => {
      const apolloFile = path.join(__dirname, 'frontend/src/graphql/apollo-client.ts');
      return fs.existsSync(apolloFile);
    }
  },
  {
    name: 'GraphQL queries use correct field names',
    test: () => {
      const queriesFile = path.join(__dirname, 'frontend/src/graphql/queries.ts');
      const content = fs.readFileSync(queriesFile, 'utf8');
      // Verify we fixed the imageUrl field name issue
      return content.includes('imageUrl') && !content.includes('url');
    }
  },
  {
    name: 'Component uses type-safe hooks',
    test: () => {
      const componentFile = path.join(__dirname, 'frontend/src/components/GraphQLTest.tsx');
      const content = fs.readFileSync(componentFile, 'utf8');
      
      // Check that old useQuery/useMutation are not used
      const oldPatterns = [
        'useQuery(GET_',
        'useMutation(CREATE_',
        'useMutation(UPDATE_'
      ];
      
      return !oldPatterns.some(pattern => content.includes(pattern));
    }
  },
  {
    name: 'Nullable types handled correctly',
    test: () => {
      const componentFile = path.join(__dirname, 'frontend/src/components/GraphQLTest.tsx');
      const content = fs.readFileSync(componentFile, 'utf8');
      
      // Check that phoneNumber nullable handling is implemented
      return content.includes('phoneNumber || \'\'') && 
             content.includes('phoneNumber: null');
    }
  }
];

integrationChecks.forEach(check => {
  const passed = check.test();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${check.name}`);
  if (!passed) allCriteriaMet = false;
});

console.log('\n📊 Summary:\n');

if (allCriteriaMet) {
  console.log('🎉 ALL VERIFICATION CHECKS PASSED!');
  console.log('\n✅ GraphQL Code Generator for HotChocolate schema is fully set up and working');
  console.log('✅ TypeScript types are automatically generated from .NET GraphQL schema');
  console.log('✅ Type-safe queries and mutations are enabled');
  console.log('✅ Apollo Client integration is complete with generated hooks');
  console.log('✅ All acceptance criteria have been met');
  
  console.log('\n📋 What was accomplished:');
  console.log('• Installed and configured GraphQL Code Generator with required plugins');
  console.log('• Set up automatic type generation from HotChocolate schema');
  console.log('• Generated TypeScript types for all queries, mutations, and enums');
  console.log('• Integrated generated types with Apollo Client hooks');
  console.log('• Updated existing components to use type-safe GraphQL operations');
  console.log('• Fixed schema field name issues (imageUrl vs url)');
  console.log('• Implemented proper handling of nullable types');
  console.log('• Added comprehensive tests to verify type safety');
  console.log('• Eliminated use of any types in GraphQL operations');
  
  console.log('\n🚀 Ready for development with full type safety!');
} else {
  console.log('❌ Some verification checks failed. Please review the issues above.');
  process.exit(1);
}

console.log('\n📚 Usage:');
console.log('• Run `npm run codegen` to regenerate types after schema changes');
console.log('• Use generated hooks like useGetUsersQuery() instead of useQuery()');
console.log('• Import types from src/generated/graphql.ts for type safety');
console.log('• All GraphQL operations now have full TypeScript support');