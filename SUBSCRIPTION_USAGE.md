# GraphQL Subscriptions Usage Guide

This document provides examples of how to use the implemented GraphQL subscriptions.

## Available Subscriptions

### 1. onOrderCreated
Receives real-time updates when new orders are created.

**Subscription Query:**
```graphql
subscription {
  onOrderCreated {
    id
    orderNumber
    status
    totalAmount
    user {
      id
      username
      email
    }
    orderItems {
      id
      productName
      quantity
      unitPrice
      totalPrice
    }
  }
}
```

**Triggered by:**
- `createOrder` mutation

### 2. onNotificationReceived
Receives real-time updates when new notifications are created.

**Subscription Query:**
```graphql
subscription {
  onNotificationReceived {
    id
    title
    message
    type
    priority
    user {
      id
      username
    }
    createdAt
  }
}
```

**Triggered by:**
- `createNotification` mutation

## How to Test

### Using GraphQL Playground/Studio
1. Navigate to `http://localhost:5001/graphql` in your browser
2. Open a new tab for the subscription
3. Run one of the subscription queries above
4. In another tab, execute a mutation (createOrder or createNotification)
5. Watch the subscription tab for real-time updates

### Example Mutations

**Create Order:**
```graphql
mutation {
  createOrder(input: {
    userId: 1
    notes: "Test order"
  }) {
    success
    message
    order {
      id
      orderNumber
    }
  }
}
```

**Create Notification:**
```graphql
mutation {
  createNotification(input: {
    userId: 1
    title: "Test Notification"
    message: "This is a test notification"
    type: SYSTEM
    priority: NORMAL
  }) {
    success
    message
    notification {
      id
      title
    }
  }
}
```

## WebSocket Connection

Subscriptions work over WebSocket connections. The endpoint is:
- WebSocket URL: `ws://localhost:5001/graphql`
- Protocol: `graphql-ws`

## Implementation Details

- **Transport**: WebSocket with `graphql-ws` protocol
- **Pub/Sub**: HotChocolate in-memory pub/sub system
- **Topics**: 
  - `order_created` for order subscriptions
  - `notification_received` for notification subscriptions

## Client Libraries

Popular GraphQL client libraries that support subscriptions:
- Apollo Client (JavaScript)
- Relay (JavaScript) 
- graphql-ws (JavaScript)
- Strawberry Shake (.NET)
- graphql-java-client (Java)

Example with JavaScript (using graphql-ws):
```javascript
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:5001/graphql',
});

const unsubscribe = client.subscribe(
  {
    query: `
      subscription {
        onOrderCreated {
          id
          orderNumber
          totalAmount
        }
      }
    `,
  },
  {
    next: (data) => {
      console.log('New order created:', data);
    },
    error: (err) => {
      console.error('Subscription error:', err);
    },
    complete: () => {
      console.log('Subscription completed');
    },
  }
);
```