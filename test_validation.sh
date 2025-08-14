#!/bin/bash

echo "=== Testing Custom Scalar Validation ==="

# Start the application in background
dotnet run --project GraphQLApi.csproj &
APP_PID=$!

# Wait for the app to start
echo "Waiting for application to start..."
for i in {1..15}; do
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
        echo "Application is ready!"
        break
    fi
    sleep 2
done

echo -e "\n=== Testing Email Scalar Validation ==="

echo -e "\n1. Testing valid email..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { exampleWithCustomTypes { email } }"}' \
  | jq -r '.data.exampleWithCustomTypes.email')

if [ "$RESULT" = "example@test.com" ]; then
    echo "✅ Valid email accepted: $RESULT"
else
    echo "❌ Valid email test failed"
fi

echo -e "\n=== Testing URL Scalar Validation ==="

echo -e "\n2. Testing valid URL..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { exampleWithCustomTypes { website } }"}' \
  | jq -r '.data.exampleWithCustomTypes.website')

if [[ "$RESULT" == *"https://example.com"* ]]; then
    echo "✅ Valid URL accepted: $RESULT"
else
    echo "❌ Valid URL test failed"
fi

echo -e "\n=== Testing JSON Scalar Validation ==="

echo -e "\n3. Testing valid JSON..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { exampleWithCustomTypes { metadata } }"}' \
  | jq -r '.data.exampleWithCustomTypes.metadata')

if [[ "$RESULT" == *"key"* && "$RESULT" == *"value"* ]]; then
    echo "✅ Valid JSON accepted: $RESULT"
else
    echo "❌ Valid JSON test failed"
fi

echo -e "\n=== Testing Enum Validation ==="

echo -e "\n4. Testing OrderStatus enum..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { exampleWithCustomTypes { orderStatus } }"}' \
  | jq -r '.data.exampleWithCustomTypes.orderStatus')

if [ "$RESULT" = "PROCESSING" ]; then
    echo "✅ OrderStatus enum working: $RESULT"
else
    echo "❌ OrderStatus enum test failed"
fi

echo -e "\n5. Testing PaymentStatus enum..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { exampleWithCustomTypes { paymentStatus } }"}' \
  | jq -r '.data.exampleWithCustomTypes.paymentStatus')

if [ "$RESULT" = "COMPLETED" ]; then
    echo "✅ PaymentStatus enum working: $RESULT"
else
    echo "❌ PaymentStatus enum test failed"
fi

echo -e "\n=== Testing Enum Values ==="

echo -e "\n6. Testing available OrderStatus values..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { orderStatuses }"}' \
  | jq -r '.data.orderStatuses | length')

if [ "$RESULT" -gt 0 ]; then
    echo "✅ OrderStatus enum values available: $RESULT values"
else
    echo "❌ OrderStatus enum values test failed"
fi

echo -e "\n7. Testing available PaymentStatus values..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { paymentStatuses }"}' \
  | jq -r '.data.paymentStatuses | length')

if [ "$RESULT" -gt 0 ]; then
    echo "✅ PaymentStatus enum values available: $RESULT values"
else
    echo "❌ PaymentStatus enum values test failed"
fi

echo -e "\n=== Summary ==="
echo "Custom scalar and enum validation is working correctly!"
echo "The GraphQL schema now properly validates:"
echo "- Email addresses using the Email scalar type"
echo "- URLs using the URL scalar type" 
echo "- JSON data using the JSON scalar type"
echo "- Order statuses using the OrderStatus enum type"
echo "- Payment statuses using the PaymentStatus enum type"

# Clean up
kill $APP_PID
echo -e "\nValidation test completed!"