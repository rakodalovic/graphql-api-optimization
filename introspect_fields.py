#!/usr/bin/env python3
import requests
import json

GRAPHQL_URL = "http://localhost:5001/graphql"

def introspect_query_fields():
    query = """
    query {
        __schema {
            queryType {
                fields {
                    name
                    type {
                        name
                        kind
                    }
                }
            }
        }
    }
    """
    
    response = requests.post(GRAPHQL_URL, json={"query": query})
    if response.status_code == 200:
        fields = response.json()["data"]["__schema"]["queryType"]["fields"]
        print("Available Query fields:")
        for field in fields:
            print(f"  - {field['name']}: {field['type']['name'] or field['type']['kind']}")
    else:
        print("Error:", response.text)

if __name__ == "__main__":
    introspect_query_fields()