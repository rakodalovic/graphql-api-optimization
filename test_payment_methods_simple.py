#!/usr/bin/env python3
import requests
import json

GRAPHQL_URL = "http://localhost:5001/graphql"

def test_payment_methods():
    # Test individual queries first
    queries = [
        {
            "name": "CreditCardPayments",
            "query": """
            query {
                creditCardPayments {
                    id
                    amount
                    currency
                    lastFourDigits
                    cardBrand
                }
            }
            """
        },
        {
            "name": "PaypalPayments", 
            "query": """
            query {
                paypalPayments {
                    id
                    amount
                    currency
                    paypalTransactionId
                    payerEmail
                }
            }
            """
        },
        {
            "name": "PaymentMethods",
            "query": """
            query {
                paymentMethods(paymentId: 1) {
                    creditCardPayments {
                        id
                        amount
                        lastFourDigits
                    }
                    paypalPayments {
                        id
                        amount
                        paypalTransactionId
                    }
                }
            }
            """
        }
    ]
    
    for test_case in queries:
        print(f"\nTesting {test_case['name']}...")
        response = requests.post(GRAPHQL_URL, json={"query": test_case["query"]})
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Response:", json.dumps(response.json(), indent=2))
        else:
            print("Error:", response.text)

if __name__ == "__main__":
    test_payment_methods()