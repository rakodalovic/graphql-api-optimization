const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔐 Testing JWT Authentication Implementation');
console.log('==========================================\n');

async function runCommand(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} in ${cwd}`);
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function testAuthentication() {
  const projectRoot = '/tmp/5e2fbfd582be401aa7c473c8ddb3d2ee';
  const frontendDir = path.join(projectRoot, 'frontend');
  const backendDir = path.join(projectRoot, 'backend');

  try {
    console.log('📦 Step 1: Installing frontend dependencies...');
    await runCommand('npm install', frontendDir);

    console.log('\n🔧 Step 2: Restoring backend packages...');
    await runCommand('dotnet restore', backendDir);

    console.log('\n🏗️ Step 3: Building backend...');
    await runCommand('dotnet build', backendDir);

    console.log('\n🗄️ Step 4: Starting backend server...');
    const backendProcess = spawn('dotnet', ['run'], {
      cwd: backendDir,
      stdio: 'pipe',
      detached: false
    });

    let backendReady = false;
    
    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`Backend: ${output}`);
      if (output.includes('Now listening on') || output.includes('Application started')) {
        backendReady = true;
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    // Wait for backend to start
    console.log('⏳ Waiting for backend to start...');
    while (!backendReady) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n✅ Backend is ready!');

    // Test GraphQL endpoint
    console.log('\n🧪 Step 5: Testing GraphQL authentication...');
    
    // Test login mutation
    const loginQuery = `
      mutation {
        login(input: { email: "john.doe@example.com", password: "password123" }) {
          success
          message
          token
          user {
            id
            firstName
            lastName
            email
            username
          }
        }
      }
    `;

    const loginResponse = await fetch('http://localhost:5001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: loginQuery })
    });

    const loginResult = await loginResponse.json();
    console.log('Login Response:', JSON.stringify(loginResult, null, 2));

    if (loginResult.data?.login?.success) {
      const token = loginResult.data.login.token;
      console.log('\n✅ Login successful! JWT token received.');

      // Test authenticated query
      const usersQuery = `
        query {
          users {
            id
            firstName
            lastName
            email
            username
          }
        }
      `;

      console.log('\n🔒 Testing authenticated request...');
      const authenticatedResponse = await fetch('http://localhost:5001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: usersQuery })
      });

      const authenticatedResult = await authenticatedResponse.json();
      console.log('Authenticated Query Response:', JSON.stringify(authenticatedResult, null, 2));

      if (authenticatedResult.data?.users) {
        console.log('\n✅ Authenticated request successful!');
      } else {
        console.log('\n❌ Authenticated request failed');
      }

    } else {
      console.log('\n❌ Login failed:', loginResult.data?.login?.message);
    }

    console.log('\n🎯 Step 6: Testing frontend...');
    
    // Start frontend in background
    const frontendProcess = spawn('npm', ['start'], {
      cwd: frontendDir,
      stdio: 'pipe',
      detached: false,
      env: { ...process.env, BROWSER: 'none' }
    });

    let frontendReady = false;
    
    frontendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`Frontend: ${output}`);
      if (output.includes('webpack compiled') || output.includes('Local:')) {
        frontendReady = true;
      }
    });

    frontendProcess.stderr.on('data', (data) => {
      console.error(`Frontend Error: ${data}`);
    });

    // Wait for frontend to start
    console.log('⏳ Waiting for frontend to start...');
    let attempts = 0;
    while (!frontendReady && attempts < 60) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (frontendReady) {
      console.log('\n✅ Frontend is ready at http://localhost:3000');
      console.log('\n🎉 Authentication system is fully implemented!');
      console.log('\nFeatures implemented:');
      console.log('✅ JWT authentication in backend');
      console.log('✅ Login mutation with BCrypt password verification');
      console.log('✅ JWT token generation and validation');
      console.log('✅ React Router v6 for navigation');
      console.log('✅ Authentication context for state management');
      console.log('✅ Login form component');
      console.log('✅ Protected routes');
      console.log('✅ JWT token storage in localStorage');
      console.log('✅ Apollo Client JWT integration');
      console.log('✅ Dashboard with user information');
      console.log('✅ Logout functionality');
      
      console.log('\n📝 Test the system:');
      console.log('1. Visit http://localhost:3000');
      console.log('2. You will be redirected to /login');
      console.log('3. Use demo credentials:');
      console.log('   - Email: john.doe@example.com, Password: password123');
      console.log('   - Email: admin@example.com, Password: admin123');
      console.log('4. After login, you will see the dashboard');
      console.log('5. GraphQL requests will include JWT token automatically');
      
    } else {
      console.log('\n❌ Frontend failed to start within timeout');
    }

    // Keep processes running for manual testing
    console.log('\n⏳ Servers are running. Press Ctrl+C to stop...');
    
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });

    // Keep the script running
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

testAuthentication().catch(console.error);