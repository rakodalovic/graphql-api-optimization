#!/bin/bash

echo "Testing GraphQL Custom Scalars and Enums"
echo "=========================================="

# Start the application in background
dotnet run --project GraphQLApi.csproj &
APP_PID=$!

# Wait for the app to start
sleep 5

echo "1. Testing schema introspection for custom scalars..."
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __schema { types { name description } } }"
  }' | jq '.data.__schema.types[] | select(.name | contains("Email") or contains("URL") or contains("JSON"))'

echo -e "\n2. Testing OrderStatus enum..."
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"OrderStatus\") { name enumValues { name description } } }"
  }' | jq '.data'

echo -e "\n3. Testing PaymentStatus enum..."
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"PaymentStatus\") { name enumValues { name description } } }"
  }' | jq '.data'

echo -e "\n4. Testing example query with custom types..."
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { exampleWithCustomTypes { id email website metadata orderStatus paymentStatus } }"
  }' | jq '.data'

echo -e "\n5. Testing order statuses query..."
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { orderStatuses }"
  }' | jq '.data'

echo -e "\n6. Testing payment statuses query..."
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { paymentStatuses }"
  }' | jq '.data'

# Clean up
kill $APP_PID
echo -e "\nTest completed!"