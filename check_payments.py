#!/usr/bin/env python3
import requests
import json

GRAPHQL_URL = "http://localhost:5001/graphql"

def check_payments():
    query = """
    query {
        orders {
            id
            orderNumber
            totalAmount
            payments {
                id
                amount
                status
                method
            }
        }
    }
    """
    
    response = requests.post(GRAPHQL_URL, json={"query": query})
    print("Status:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    check_payments()