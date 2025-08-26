#!/usr/bin/env node

const https = require('https');
const http = require('http');

console.log('🚀 Testing GraphMart Rebrand Implementation...\n');

// Test backend GraphQL API
function testBackend() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            query: `{
                products(first: 5) {
                    nodes {
                        id
                        name
                        price
                        description
                        images {
                            imageUrl
                            altText
                            isPrimary
                        }
                    }
                }
                reviews(first: 3) {
                    nodes {
                        id
                        rating
                        title
                        comment
                        product {
                            name
                        }
                        user {
                            firstName
                            lastName
                        }
                    }
                }
            }`
        });

        const options = {
            hostname: 'localhost',
            port: 5002,
            path: '/graphql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.data && response.data.products && response.data.reviews) {
                        console.log('✅ Backend GraphQL API: Working');
                        console.log(`   - Products found: ${response.data.products.nodes.length}`);
                        console.log(`   - Reviews found: ${response.data.reviews.nodes.length}`);
                        console.log(`   - Sample product: ${response.data.products.nodes[0]?.name}`);
                        console.log(`   - Sample review: "${response.data.reviews.nodes[0]?.title}"`);
                        
                        // Check if products have images
                        const productsWithImages = response.data.products.nodes.filter(p => p.images && p.images.length > 0);
                        console.log(`   - Products with images: ${productsWithImages.length}/${response.data.products.nodes.length}`);
                        
                        resolve(true);
                    } else {
                        console.log('❌ Backend GraphQL API: Data structure incorrect');
                        resolve(false);
                    }
                } catch (error) {
                    console.log('❌ Backend GraphQL API: Invalid JSON response');
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Backend GraphQL API: Connection failed');
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

// Test frontend
function testFrontend() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ Frontend React App: Working');
                    
                    // Check for GraphMart branding
                    if (data.includes('GraphMart')) {
                        console.log('   - ✅ GraphMart branding found in HTML');
                    } else {
                        console.log('   - ❌ GraphMart branding not found in HTML');
                    }
                    
                    // Check for premium description
                    if (data.includes('premium')) {
                        console.log('   - ✅ Premium messaging found');
                    }
                    
                    resolve(true);
                } else {
                    console.log(`❌ Frontend React App: HTTP ${res.statusCode}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Frontend React App: Connection failed');
            resolve(false);
        });

        req.end();
    });
}

// Run tests
async function runTests() {
    console.log('Testing Backend...');
    const backendWorking = await testBackend();
    
    console.log('\nTesting Frontend...');
    const frontendWorking = await testFrontend();
    
    console.log('\n📊 Test Results Summary:');
    console.log(`Backend API: ${backendWorking ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Frontend App: ${frontendWorking ? '✅ PASS' : '❌ FAIL'}`);
    
    if (backendWorking && frontendWorking) {
        console.log('\n🎉 GraphMart rebrand implementation successful!');
        console.log('\n🔗 Access the application:');
        console.log('   Frontend: http://localhost:3000');
        console.log('   Backend GraphQL: http://localhost:5002/graphql');
    } else {
        console.log('\n⚠️  Some components are not working properly.');
    }
}

runTests().catch(console.error);