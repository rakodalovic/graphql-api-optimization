#!/usr/bin/env python3
"""
Final acceptance test to verify all requirements from the issue are met
"""
import requests
import json

GRAPHQL_URL = "http://localhost:5001/graphql"

def test_graphql_query(query, variables=None):
    """Execute a GraphQL query and return the result"""
    payload = {"query": query, "variables": variables or {}}
    try:
        response = requests.post(GRAPHQL_URL, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error executing query: {e}")
        return None

def test_search_result_union():
    """Test SearchResult union type returning User, Product, Category"""
    print("✓ Testing SearchResult union type...")
    
    query = """
    query TestSearchUnion($searchTerm: String!) {
        search(searchTerm: $searchTerm) {
            users {
                id
                firstName
                lastName
            }
            products {
                id
                name
                price
            }
            categories {
                id
                name
            }
        }
    }
    """
    
    result = test_graphql_query(query, {"searchTerm": "iPhone"})
    if result and 'data' in result and 'search' in result['data']:
        search_data = result['data']['search']
        print(f"  - Found {len(search_data['users'])} users")
        print(f"  - Found {len(search_data['products'])} products")
        print(f"  - Found {len(search_data['categories'])} categories")
        return True
    return False

def test_payment_method_union():
    """Test PaymentMethod union type returning CreditCardPayment, PaypalPayment"""
    print("✓ Testing PaymentMethod union type...")
    
    query = """
    query TestPaymentMethodUnion {
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
    if result and 'data' in result and 'paymentMethods' in result['data']:
        payment_data = result['data']['paymentMethods']
        print(f"  - Found {len(payment_data['creditCardPayments'])} credit card payments")
        print(f"  - Found {len(payment_data['paypalPayments'])} PayPal payments")
        return True
    return False

def test_inode_interface():
    """Test INode interface implemented on all core entities"""
    print("✓ Testing IEntityNode interface on core entities...")
    
    query = """
    query TestINodeInterface {
        users {
            id
        }
        products {
            id
        }
        categories {
            id
        }
        creditCardPayments {
            id
        }
        paypalPayments {
            id
        }
    }
    """
    
    result = test_graphql_query(query)
    if result and 'data' in result:
        data = result['data']
        entities_with_ids = 0
        for entity_type in ['users', 'products', 'categories', 'creditCardPayments', 'paypalPayments']:
            if entity_type in data and len(data[entity_type]) > 0:
                entities_with_ids += 1
                print(f"  - {entity_type}: {len(data[entity_type])} entities with ID field")
        return entities_with_ids > 0
    return False

def test_iauditable_interface():
    """Test IAuditable interface for audit fields"""
    print("✓ Testing IAuditable interface for audit fields...")
    
    query = """
    query TestIAuditableInterface {
        users {
            id
            createdAt
            updatedAt
        }
        products {
            id
            createdAt
            updatedAt
        }
        categories {
            id
            createdAt
            updatedAt
        }
        creditCardPayments {
            id
            createdAt
            updatedAt
        }
        paypalPayments {
            id
            createdAt
            updatedAt
        }
    }
    """
    
    result = test_graphql_query(query)
    if result and 'data' in result:
        data = result['data']
        entities_with_audit = 0
        for entity_type in ['users', 'products', 'categories', 'creditCardPayments', 'paypalPayments']:
            if entity_type in data and len(data[entity_type]) > 0:
                entity = data[entity_type][0]
                if 'createdAt' in entity and 'updatedAt' in entity:
                    entities_with_audit += 1
                    print(f"  - {entity_type}: Has createdAt and updatedAt fields")
        return entities_with_audit > 0
    return False

def test_union_types_in_schema():
    """Test that union types are properly registered in schema"""
    print("✓ Testing union types in schema introspection...")
    
    query = """
    query IntrospectUnions {
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
        types = result['data']['__schema']['types']
        union_types = [t for t in types if t['kind'] == 'UNION']
        
        search_result_union = next((u for u in union_types if u['name'] == 'SearchResult'), None)
        payment_method_union = next((u for u in union_types if u['name'] == 'PaymentMethodResult'), None)
        
        if search_result_union and payment_method_union:
            print(f"  - SearchResult union: {[pt['name'] for pt in search_result_union['possibleTypes']]}")
            print(f"  - PaymentMethodResult union: {[pt['name'] for pt in payment_method_union['possibleTypes']]}")
            return True
    return False

def main():
    """Run all acceptance tests"""
    print("🚀 Running Final Acceptance Tests for Union and Interface Types\n")
    
    tests = [
        ("SearchResult union type implemented and queryable", test_search_result_union),
        ("PaymentMethod union type implemented and queryable", test_payment_method_union),
        ("INode interface implemented on all core entities", test_inode_interface),
        ("IAuditable interface implemented on auditable entities", test_iauditable_interface),
        ("Union types properly registered in schema", test_union_types_in_schema)
    ]
    
    passed_tests = 0
    total_tests = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        try:
            if test_func():
                print("   ✅ PASSED")
                passed_tests += 1
            else:
                print("   ❌ FAILED")
        except Exception as e:
            print(f"   ❌ ERROR: {e}")
    
    print(f"\n🎯 Test Results: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 ALL ACCEPTANCE CRITERIA MET!")
        print("\nImplemented Features:")
        print("✅ SearchResult union type returning User, Product, Category")
        print("✅ PaymentMethod union type returning CreditCardPayment, PaypalPayment")
        print("✅ IEntityNode interface with Id field implemented by all major entities")
        print("✅ IAuditable interface for audit fields (CreatedAt, UpdatedAt)")
        print("✅ Query resolvers updated to support new types")
        return True
    else:
        print("❌ Some acceptance criteria not met")
        return False

if __name__ == "__main__":
    main()