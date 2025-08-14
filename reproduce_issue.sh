#!/bin/bash

echo "=== Reproducing the Custom Scalar and Enum Types Issue ==="
echo "Starting the GraphQL API to inspect current schema..."

# Start the application in background
dotnet run --project GraphQLApi.csproj &
APP_PID=$!

# Wait for the app to start
echo "Waiting for application to start..."
sleep 8

echo -e "\n1. Testing current schema - looking for User type fields..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"User\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "email" or .name == "avatarUrl")' || echo "No specific email/avatarUrl fields found"

echo -e "\n2. Testing current schema - looking for UserProfile type fields..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"UserProfile\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "avatarUrl")' || echo "No avatarUrl field found"

echo -e "\n3. Testing current schema - looking for Notification type fields..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"Notification\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "actionUrl" or .name == "imageUrl" or .name == "metadata")' || echo "No URL/metadata fields found"

echo -e "\n4. Testing available custom scalar types in schema..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __schema { types { name description kind } } }"
  }' | jq '.data.__schema.types[] | select(.name | contains("Email") or contains("URL") or contains("JSON") or contains("OrderStatus") or contains("PaymentStatus"))'

echo -e "\n5. Testing ExampleType to see custom types in action..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { exampleWithCustomTypes { id email website metadata orderStatus paymentStatus } }"
  }' | jq '.data'

echo -e "\n6. Testing User query to see current field types..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users(first: 1) { id firstName lastName email } }"
  }' | jq '.data'

# Clean up
kill $APP_PID
echo -e "\nReproduction completed!"