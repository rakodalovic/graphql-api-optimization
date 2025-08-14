#!/bin/bash

echo "=== Verifying Custom Scalar and Enum Types Usage in Models ==="
echo "Starting the GraphQL API to test the updated schema..."

# Start the application in background
dotnet run --project GraphQLApi.csproj &
APP_PID=$!

# Wait for the app to start
echo "Waiting for application to start..."
sleep 8

echo -e "\n1. Testing User type - checking if email field uses Email scalar type..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"User\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "email")'

echo -e "\n2. Testing UserProfile type - checking if avatarUrl uses URL scalar type..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"UserProfile\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "avatarUrl")'

echo -e "\n3. Testing Notification type - checking URL and JSON scalar types..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"Notification\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "actionUrl" or .name == "imageUrl" or .name == "metadata")'

echo -e "\n4. Testing ProductImage type - checking if imageUrl uses URL scalar type..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"ProductImage\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "imageUrl")'

echo -e "\n5. Testing Category type - checking if imageUrl uses URL scalar type..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"Category\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "imageUrl")'

echo -e "\n6. Testing ProductVariant type - checking if imageUrl uses URL scalar type..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"ProductVariant\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "imageUrl")'

echo -e "\n7. Testing that enum types are still working - Order and Payment status..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"Order\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "status")'

curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { __type(name: \"Payment\") { name fields { name type { name ofType { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "status")'

echo -e "\n8. Testing a real query to make sure everything works..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { exampleWithCustomTypes { id email website metadata orderStatus paymentStatus } }"
  }' | jq '.data'

echo -e "\n9. Testing users query to ensure it works with the new Email scalar..."
curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users(first: 1) { id firstName lastName email } }"
  }' | jq '.data'

# Clean up
kill $APP_PID
echo -e "\nVerification completed!"