#!/usr/bin/env python3

import requests
import json
import subprocess
import time

def test_graphql_queries():
    """Test GraphQL queries against the SQLite database"""
    
    print("🚀 Starting GraphQL API for testing...")
    
    # Start the application
    app_process = subprocess.Popen(
        ["dotnet", "run", "--no-build"],
        cwd="/tmp/5308f3564d2a4bd6ad9d22cebf285125",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for application to start
    print("⏳ Waiting for application to start...")
    time.sleep(8)
    
    try:
        # Test queries
        queries = [
            {
                "name": "Schema Introspection",
                "query": """
                query {
                    __schema {
                        queryType {
                            name
                        }
                    }
                }
                """
            },
            {
                "name": "Get Users",
                "query": """
                query {
                    users {
                        id
                        firstName
                        lastName
                        email
                        isActive
                    }
                }
                """
            },
            {
                "name": "Get Products with Categories",
                "query": """
                query {
                    products {
                        id
                        name
                        price
                        category {
                            name
                        }
                    }
                }
                """
            }
        ]
        
        print("\n🔍 Testing GraphQL Queries...")
        print("=" * 50)
        
        for query_test in queries:
            print(f"\n📝 {query_test['name']}:")
            
            try:
                response = requests.post(
                    "http://localhost:5000/graphql",
                    json={"query": query_test["query"]},
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "errors" in data:
                        print(f"   ❌ GraphQL Error: {data['errors']}")
                    else:
                        print(f"   ✅ Success!")
                        # Print a summary of the data
                        if "data" in data:
                            for key, value in data["data"].items():
                                if isinstance(value, list):
                                    print(f"      {key}: {len(value)} items")
                                else:
                                    print(f"      {key}: {value}")
                else:
                    print(f"   ❌ HTTP Error: {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                print(f"   ❌ Request failed: {e}")
        
        print("\n" + "=" * 50)
        print("✅ GraphQL testing completed!")
        
    finally:
        # Stop the application
        print("\n🛑 Stopping application...")
        app_process.terminate()
        app_process.wait(timeout=5)

if __name__ == "__main__":
    test_graphql_queries()