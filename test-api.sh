#!/bin/bash

# Test script for GraphQL API
echo "🚀 Testing GraphQL API endpoints..."

# Start the API in background
echo "Starting API server..."
dotnet run --urls http://localhost:5000 &
API_PID=$!

# Wait for the server to start
sleep 5

echo ""
echo "📋 Testing endpoints:"

# Test root endpoint
echo "1. Testing root endpoint (/):"
curl -s http://localhost:5000/ | jq '.'
echo ""

# Test health checks
echo "2. Testing health endpoint (/health):"
curl -s http://localhost:5000/health | jq '.'
echo ""

echo "3. Testing ready health endpoint (/health/ready):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health/ready
echo ""

echo "4. Testing live health endpoint (/health/live):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health/live
echo ""

# Test GraphQL queries
echo "5. Testing GraphQL Hello World query:"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"query": "{ hello }"}' \
  http://localhost:5000/graphql | jq '.'
echo ""

echo "6. Testing GraphQL greeting query with parameter:"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"query": "{ greeting(name: \"Developer\") }"}' \
  http://localhost:5000/graphql | jq '.'
echo ""

echo "7. Testing GraphQL server time query:"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"query": "{ serverTime }"}' \
  http://localhost:5000/graphql | jq '.'
echo ""

echo "8. Testing GraphQL version query:"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"query": "{ version { version environment buildDate } }"}' \
  http://localhost:5000/graphql | jq '.'
echo ""

echo "9. Testing GraphQL mutation (echo):"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"query": "mutation { echo(message: \"Hello from mutation!\") { message timestamp success } }"}' \
  http://localhost:5000/graphql | jq '.'
echo ""

echo "10. Testing GraphQL mutation (calculate):"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"query": "mutation { calculate(a: 10, b: 5, operation: ADD) { result operation inputA inputB success } }"}' \
  http://localhost:5000/graphql | jq '.'
echo ""

echo "11. Testing GraphQL IDE accessibility:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Accept: text/html" http://localhost:5000/graphql/)
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ GraphQL IDE (Banana Cake Pop) is accessible at /graphql/"
else
    echo "❌ GraphQL IDE is not accessible (HTTP $HTTP_STATUS)"
fi
echo ""

# Clean up
echo "🧹 Stopping API server..."
kill $API_PID
wait $API_PID 2>/dev/null

echo ""
echo "✅ All tests completed!"
echo ""
echo "🌐 Available endpoints:"
echo "  - Root: http://localhost:5000/"
echo "  - GraphQL API: http://localhost:5000/graphql"
echo "  - GraphQL IDE: http://localhost:5000/graphql/ (Banana Cake Pop)"
echo "  - Health Check: http://localhost:5000/health"
echo "  - Health Ready: http://localhost:5000/health/ready"
echo "  - Health Live: http://localhost:5000/health/live"