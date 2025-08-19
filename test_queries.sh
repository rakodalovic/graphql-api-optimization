#!/bin/bash

echo "GraphQL Pagination Issue Reproduction Script"
echo "============================================"

# Test the failing query (with pagination arguments)
echo ""
echo "=== Testing GET_USERS with pagination arguments (should fail) ==="
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUsers($first: Int, $after: String) { users(first: $first, after: $after) { id firstName lastName email username isActive createdAt updatedAt } }",
    "variables": { "first": 10 }
  }' | jq .

echo ""
echo "=== Testing GET_PRODUCTS with pagination arguments (should fail) ==="
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetProducts($first: Int, $after: String) { products(first: $first, after: $after) { id name description price stockQuantity isActive createdAt updatedAt } }",
    "variables": { "first": 10 }
  }' | jq .

echo ""
echo "=== Testing GET_USERS without pagination arguments (should work) ==="
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUsers { users { id firstName lastName email username isActive createdAt updatedAt } }"
  }' | jq .

echo ""
echo "=== Testing GET_PRODUCTS without pagination arguments (should work) ==="
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetProducts { products { id name description price stockQuantity isActive createdAt updatedAt } }"
  }' | jq .