#!/usr/bin/env python3
"""
Test script to verify the GraphQL schema with union types and interfaces
"""
import requests
import json
import time

# GraphQL endpoint
GRAPHQL_URL = "http://localhost:5001/graphql"

def test_graphql_query(query, variables=None):
    """Execute a GraphQL query and return the result"""
    payload = {
        "query": query,
        "variables": variables or {}
    }
    
    try:
        response = requests.post(GRAPHQL_URL, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error executing query: {e}")
        return None

def test_search_union():
    """Test the search functionality"""
    print("Testing search functionality...")
    
    query = """
    query TestSearch($searchTerm: String!) {
        search(searchTerm: $searchTerm) {
            users {
                id
                firstName
                lastName
                email
                createdAt
                updatedAt
            }
            products {
                id
                name
                price
                description
                createdAt
                updatedAt
            }
            categories {
                id
                name
                description
                createdAt
                updatedAt
            }
        }
    }
    """
    
    result = test_graphql_query(query, {"searchTerm": "iPhone"})
    if result:
        print("Search results:", json.dumps(result, indent=2))
    else:
        print("Failed to execute search query")

def test_payment_methods():
    """Test payment method queries"""
    print("\nTesting payment method queries...")
    
    query = """
    query TestPaymentMethods {
        creditCardPayments {
            id
            amount
            currency
            lastFourDigits
            cardBrand
            createdAt
            updatedAt
        }
        paypalPayments {
            id
            amount
            currency
            paypalTransactionId
            payerEmail
            createdAt
            updatedAt
        }
        paymentMethods(paymentId: 1) {
            creditCardPayments {
                id
                amount
                lastFourDigits
                cardBrand
            }
            paypalPayments {
                id
                amount
                paypalTransactionId
                payerEmail
            }
        }
    }
    """
    
    result = test_graphql_query(query)
    if result:
        print("Payment methods:", json.dumps(result, indent=2))
    else:
        print("Failed to execute payment methods query")

def test_interfaces():
    """Test interface implementations"""
    print("\nTesting interface implementations...")
    
    query = """
    query TestInterfaces {
        users {
            id
            firstName
            lastName
            createdAt
            updatedAt
        }
        products {
            id
            name
            price
            createdAt
            updatedAt
        }
        categories {
            id
            name
            createdAt
            updatedAt
        }
    }
    """
    
    result = test_graphql_query(query)
    if result:
        print("Interface implementations:", json.dumps(result, indent=2))
    else:
        print("Failed to execute interfaces query")

def test_schema_introspection():
    """Test GraphQL schema introspection to verify union types"""
    print("\nTesting schema introspection...")
    
    query = """
    query IntrospectSchema {
        __schema {
            types {
                name
                kind
                possibleTypes {
                    name
                }
            }
        }
    }
    """
    
    result = test_graphql_query(query)
    if result and 'data' in result:
        # Look for union types
        union_types = [
            t for t in result['data']['__schema']['types'] 
            if t['kind'] == 'UNION'
        ]
        
        print("Union types found:")
        for union_type in union_types:
            print(f"  - {union_type['name']}: {[pt['name'] for pt in union_type['possibleTypes'] or []]}")
    else:
        print("Failed to execute schema introspection")

def main():
    """Main test function"""
    print("Starting GraphQL schema tests...")
    
    # Wait a moment for the server to be ready
    time.sleep(2)
    
    # Test search union
    test_search_union()
    
    # Test payment methods
    test_payment_methods()
    
    # Test interfaces
    test_interfaces()
    
    # Test schema introspection
    test_schema_introspection()
    
    print("\nTests completed!")

if __name__ == "__main__":
    main()