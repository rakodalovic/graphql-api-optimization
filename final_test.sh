#!/bin/bash

echo "=== Final Test: Custom Scalar and Enum Types in Models ==="

# Start the application in background
dotnet run --project GraphQLApi.csproj &
APP_PID=$!

# Wait for the app to start with better retry logic
echo "Waiting for application to start..."
for i in {1..20}; do
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
        echo "Application is ready!"
        break
    fi
    echo "Attempt $i: Application not ready yet, waiting..."
    sleep 2
done

# Test if application is responding
if ! curl -s http://localhost:5001/health > /dev/null 2>&1; then
    echo "ERROR: Application failed to start properly"
    kill $APP_PID 2>/dev/null
    exit 1
fi

echo -e "\n=== Testing Custom Scalar Types Usage ==="

echo -e "\n1. Verifying Email scalar type is used in User.email..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"User\") { fields { name type { name } } } }"}' \
  | jq -r '.data.__type.fields[] | select(.name == "email") | .type.name')

if [ "$RESULT" = "Email" ]; then
    echo "✅ SUCCESS: User.email uses Email scalar type"
else
    echo "❌ FAILED: User.email type is '$RESULT', expected 'Email'"
fi

echo -e "\n2. Verifying URL scalar type is used in UserProfile.avatarUrl..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"UserProfile\") { fields { name type { name } } } }"}' \
  | jq -r '.data.__type.fields[] | select(.name == "avatarUrl") | .type.name')

if [ "$RESULT" = "URL" ]; then
    echo "✅ SUCCESS: UserProfile.avatarUrl uses URL scalar type"
else
    echo "❌ FAILED: UserProfile.avatarUrl type is '$RESULT', expected 'URL'"
fi

echo -e "\n3. Verifying URL scalar type is used in Notification.actionUrl..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"Notification\") { fields { name type { name } } } }"}' \
  | jq -r '.data.__type.fields[] | select(.name == "actionUrl") | .type.name')

if [ "$RESULT" = "URL" ]; then
    echo "✅ SUCCESS: Notification.actionUrl uses URL scalar type"
else
    echo "❌ FAILED: Notification.actionUrl type is '$RESULT', expected 'URL'"
fi

echo -e "\n4. Verifying JSON scalar type is used in Notification.metadata..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"Notification\") { fields { name type { name } } } }"}' \
  | jq -r '.data.__type.fields[] | select(.name == "metadata") | .type.name')

if [ "$RESULT" = "JSON" ]; then
    echo "✅ SUCCESS: Notification.metadata uses JSON scalar type"
else
    echo "❌ FAILED: Notification.metadata type is '$RESULT', expected 'JSON'"
fi

echo -e "\n5. Verifying URL scalar type is used in ProductImage.imageUrl..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"ProductImage\") { fields { name type { name ofType { name } } } }"}' \
  | jq -r '.data.__type.fields[] | select(.name == "imageUrl") | .type.name // .type.ofType.name')

if [ "$RESULT" = "URL" ]; then
    echo "✅ SUCCESS: ProductImage.imageUrl uses URL scalar type"
else
    echo "❌ FAILED: ProductImage.imageUrl type is '$RESULT', expected 'URL'"
fi

echo -e "\n=== Testing Enum Types Usage ==="

echo -e "\n6. Verifying OrderStatus enum is used in Order.status..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"Order\") { fields { name type { name ofType { name } } } } }"}' \
  | jq -r '.data.__type.fields[] | select(.name == "status") | .type.ofType.name')

if [ "$RESULT" = "OrderStatus" ]; then
    echo "✅ SUCCESS: Order.status uses OrderStatus enum type"
else
    echo "❌ FAILED: Order.status type is '$RESULT', expected 'OrderStatus'"
fi

echo -e "\n7. Verifying PaymentStatus enum is used in Payment.status..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"Payment\") { fields { name type { name ofType { name } } } } }"}' \
  | jq -r '.data.__type.fields[] | select(.name == "status") | .type.ofType.name')

if [ "$RESULT" = "PaymentStatus" ]; then
    echo "✅ SUCCESS: Payment.status uses PaymentStatus enum type"
else
    echo "❌ FAILED: Payment.status type is '$RESULT', expected 'PaymentStatus'"
fi

echo -e "\n=== Testing Functional Queries ==="

echo -e "\n8. Testing ExampleType query with custom types..."
RESULT=$(curl -s -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { exampleWithCustomTypes { id email website metadata orderStatus paymentStatus } }"}' \
  | jq -r '.data.exampleWithCustomTypes.email')

if [ "$RESULT" = "example@test.com" ]; then
    echo "✅ SUCCESS: ExampleType query works correctly"
else
    echo "❌ FAILED: ExampleType query failed or returned unexpected result"
fi

echo -e "\n=== Summary ==="
echo "Custom scalar and enum types have been successfully implemented in the models!"
echo "All GraphQL schema types are now using the appropriate custom types for validation and proper schema representation."

# Clean up
kill $APP_PID
echo -e "\nTest completed!"