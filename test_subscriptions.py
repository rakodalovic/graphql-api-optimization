#!/usr/bin/env python3
"""
Test script for GraphQL subscriptions
This script tests the onOrderCreated and onNotificationReceived subscriptions
"""

import asyncio
import json
import websockets
import requests
import time
import threading
from urllib.parse import urljoin

# Configuration
BASE_URL = "http://localhost:5001"
WS_URL = "ws://localhost:5001/graphql"
GRAPHQL_URL = f"{BASE_URL}/graphql"

def test_graphql_endpoint():
    """Test if the GraphQL endpoint is accessible"""
    try:
        response = requests.post(GRAPHQL_URL, json={
            "query": "{ __schema { types { name } } }"
        }, timeout=5)
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing GraphQL endpoint: {e}")
        return False

def create_test_user():
    """Create a test user for testing"""
    mutation = """
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            success
            message
            user {
                id
                username
                email
            }
        }
    }
    """
    
    variables = {
        "input": {
            "firstName": "Test",
            "lastName": "User",
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123"
        }
    }
    
    try:
        response = requests.post(GRAPHQL_URL, json={
            "query": mutation,
            "variables": variables
        }, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("data", {}).get("createUser", {}).get("success"):
                return result["data"]["createUser"]["user"]["id"]
        
        print(f"Failed to create user: {response.text}")
        return None
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

def add_item_to_cart(user_id):
    """Add an item to cart for testing order creation"""
    # First, let's check if there are any products
    query = """
    query {
        products {
            id
            name
            price
        }
    }
    """
    
    try:
        response = requests.post(GRAPHQL_URL, json={"query": query}, timeout=10)
        if response.status_code == 200:
            result = response.json()
            products = result.get("data", {}).get("products", [])
            if products:
                product_id = products[0]["id"]
                
                # Add to cart
                mutation = """
                mutation AddToCart($input: AddToCartInput!) {
                    addToCart(input: $input) {
                        success
                        message
                        cart {
                            id
                        }
                    }
                }
                """
                
                variables = {
                    "input": {
                        "userId": user_id,
                        "productId": product_id,
                        "quantity": 1
                    }
                }
                
                response = requests.post(GRAPHQL_URL, json={
                    "query": mutation,
                    "variables": variables
                }, timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get("data", {}).get("addToCart", {}).get("success", False)
        
        return False
    except Exception as e:
        print(f"Error adding to cart: {e}")
        return False

async def test_order_subscription():
    """Test the onOrderCreated subscription"""
    subscription_query = """
    subscription {
        onOrderCreated {
            id
            orderNumber
            status
            totalAmount
            user {
                id
                username
            }
        }
    }
    """
    
    try:
        # Connect to WebSocket
        async with websockets.connect(
            WS_URL,
            subprotocols=["graphql-ws"]
        ) as websocket:
            # Send connection init
            await websocket.send(json.dumps({
                "type": "connection_init"
            }))
            
            # Wait for connection ack
            response = await websocket.recv()
            init_response = json.loads(response)
            
            if init_response.get("type") != "connection_ack":
                print(f"Failed to initialize connection: {init_response}")
                return False
            
            # Start subscription
            await websocket.send(json.dumps({
                "id": "order_sub",
                "type": "start",
                "payload": {
                    "query": subscription_query
                }
            }))
            
            print("Order subscription started, waiting for events...")
            
            # Wait for subscription events (with timeout)
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                event = json.loads(response)
                
                if event.get("type") == "data" and event.get("payload", {}).get("data"):
                    order_data = event["payload"]["data"]["onOrderCreated"]
                    print(f"✓ Received order created event: Order #{order_data['orderNumber']}")
                    return True
                else:
                    print(f"Unexpected event: {event}")
                    return False
                    
            except asyncio.TimeoutError:
                print("✗ Timeout waiting for order subscription event")
                return False
                
    except Exception as e:
        print(f"Error testing order subscription: {e}")
        return False

async def test_notification_subscription():
    """Test the onNotificationReceived subscription"""
    subscription_query = """
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
        }
    }
    """
    
    try:
        # Connect to WebSocket
        async with websockets.connect(
            WS_URL,
            subprotocols=["graphql-ws"]
        ) as websocket:
            # Send connection init
            await websocket.send(json.dumps({
                "type": "connection_init"
            }))
            
            # Wait for connection ack
            response = await websocket.recv()
            init_response = json.loads(response)
            
            if init_response.get("type") != "connection_ack":
                print(f"Failed to initialize connection: {init_response}")
                return False
            
            # Start subscription
            await websocket.send(json.dumps({
                "id": "notification_sub",
                "type": "start",
                "payload": {
                    "query": subscription_query
                }
            }))
            
            print("Notification subscription started, waiting for events...")
            
            # Wait for subscription events (with timeout)
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                event = json.loads(response)
                
                if event.get("type") == "data" and event.get("payload", {}).get("data"):
                    notification_data = event["payload"]["data"]["onNotificationReceived"]
                    print(f"✓ Received notification event: {notification_data['title']}")
                    return True
                else:
                    print(f"Unexpected event: {event}")
                    return False
                    
            except asyncio.TimeoutError:
                print("✗ Timeout waiting for notification subscription event")
                return False
                
    except Exception as e:
        print(f"Error testing notification subscription: {e}")
        return False

def create_order(user_id):
    """Create an order to trigger the subscription"""
    mutation = """
    mutation CreateOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
            success
            message
            order {
                id
                orderNumber
            }
        }
    }
    """
    
    variables = {
        "input": {
            "userId": user_id,
            "notes": "Test order for subscription"
        }
    }
    
    try:
        response = requests.post(GRAPHQL_URL, json={
            "query": mutation,
            "variables": variables
        }, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            return result.get("data", {}).get("createOrder", {}).get("success", False)
        
        print(f"Failed to create order: {response.text}")
        return False
    except Exception as e:
        print(f"Error creating order: {e}")
        return False

def create_notification(user_id):
    """Create a notification to trigger the subscription"""
    mutation = """
    mutation CreateNotification($input: CreateNotificationInput!) {
        createNotification(input: $input) {
            success
            message
            notification {
                id
                title
            }
        }
    }
    """
    
    variables = {
        "input": {
            "userId": user_id,
            "title": "Test Notification",
            "message": "This is a test notification for subscription",
            "type": "SYSTEM",
            "priority": "NORMAL"
        }
    }
    
    try:
        response = requests.post(GRAPHQL_URL, json={
            "query": mutation,
            "variables": variables
        }, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            return result.get("data", {}).get("createNotification", {}).get("success", False)
        
        print(f"Failed to create notification: {response.text}")
        return False
    except Exception as e:
        print(f"Error creating notification: {e}")
        return False

async def run_subscription_test(subscription_func, trigger_func, test_name):
    """Run a subscription test with a trigger function"""
    print(f"\n=== Testing {test_name} ===")
    
    # Start subscription in background
    subscription_task = asyncio.create_task(subscription_func())
    
    # Wait a bit for subscription to be established
    await asyncio.sleep(2)
    
    # Trigger the event
    print(f"Triggering {test_name.lower()}...")
    success = trigger_func()
    
    if not success:
        print(f"✗ Failed to trigger {test_name.lower()}")
        subscription_task.cancel()
        return False
    
    # Wait for subscription result
    try:
        result = await subscription_task
        return result
    except asyncio.CancelledError:
        return False

async def main():
    """Main test function"""
    print("GraphQL Subscriptions Test")
    print("=" * 50)
    
    # Wait for server to be ready
    print("Waiting for GraphQL server to be ready...")
    for i in range(30):
        if test_graphql_endpoint():
            print("✓ GraphQL server is ready")
            break
        time.sleep(1)
        if i == 29:
            print("✗ GraphQL server is not responding")
            return False
    
    # Create test user
    print("\nCreating test user...")
    user_id = create_test_user()
    if not user_id:
        print("✗ Failed to create test user")
        return False
    print(f"✓ Created test user with ID: {user_id}")
    
    # Add item to cart for order testing
    print("\nAdding item to cart...")
    if add_item_to_cart(user_id):
        print("✓ Added item to cart")
    else:
        print("⚠ Could not add item to cart (may not affect order creation test)")
    
    # Test order subscription
    order_result = await run_subscription_test(
        test_order_subscription,
        lambda: create_order(user_id),
        "Order Subscription"
    )
    
    # Test notification subscription
    notification_result = await run_subscription_test(
        test_notification_subscription,
        lambda: create_notification(user_id),
        "Notification Subscription"
    )
    
    # Summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print(f"Order Subscription: {'✓ PASS' if order_result else '✗ FAIL'}")
    print(f"Notification Subscription: {'✓ PASS' if notification_result else '✗ FAIL'}")
    
    overall_success = order_result and notification_result
    print(f"\nOverall Result: {'✓ ALL TESTS PASSED' if overall_success else '✗ SOME TESTS FAILED'}")
    
    return overall_success

if __name__ == "__main__":
    try:
        result = asyncio.run(main())
        exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\nTest interrupted by user")
        exit(1)
    except Exception as e:
        print(f"Test failed with error: {e}")
        exit(1)