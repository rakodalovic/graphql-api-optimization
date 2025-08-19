#!/bin/bash

echo "Testing GraphQL Fix"
echo "=================="

echo ""
echo "=== Testing fixed GET_USERS query (should work now) ==="
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUsers { users { id firstName lastName email username isActive createdAt updatedAt } }"
  }' | jq .

echo ""
echo "=== Testing fixed GET_PRODUCTS query (should work now) ==="
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetProducts { products { id name description price stockQuantity isActive createdAt updatedAt } }"
  }' | jq .

echo ""
echo "=== Testing CREATE_USER mutation (should still work) ==="
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { success message user { id firstName lastName email username isActive createdAt } } }",
    "variables": {
      "input": {
        "firstName": "Test",
        "lastName": "User",
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123",
        "phoneNumber": "+1234567890"
      }
    }
  }' | jq .