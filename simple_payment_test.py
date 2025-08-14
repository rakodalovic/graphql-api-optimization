#!/usr/bin/env python3
import requests
import json

GRAPHQL_URL = "http://localhost:5001/graphql"

def test_simple_payment_query():
    query = """
    query {
        creditCardPayments {
            id
            amount
            lastFourDigits
        }
    }
    """
    
    response = requests.post(GRAPHQL_URL, json={"query": query})
    print("Status:", response.status_code)
    print("Response:", response.text)

if __name__ == "__main__":
    test_simple_payment_query()