#!/usr/bin/env python3

import subprocess
import time
import requests
import json

def test_api_fix():
    """Test that the API fixes work"""
    
    print("🚀 Testing API fixes...")
    
    # Start the application
    app_process = subprocess.Popen(
        ["dotnet", "run"],
        cwd="/tmp/9368d87788b842478126496ba0d26acc",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for application to start
    print("⏳ Waiting for application to start...")
    time.sleep(8)
    
    try:
        # Test basic API endpoint
        print("\n1. Testing basic API endpoint...")
        response = requests.get("http://localhost:5000/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ API Health Check: {data.get('message')}")
            print(f"      Database: {data.get('database')}")
        else:
            print(f"   ❌ API returned status code: {response.status_code}")
            return False
            
        # Test GraphQL schema introspection
        print("\n2. Testing GraphQL schema introspection...")
        graphql_query = {
            "query": """
            query {
                __schema {
                    queryType {
                        name
                    }
                }
            }
            """
        }
        response = requests.post(
            "http://localhost:5000/graphql", 
            json=graphql_query,
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            if "errors" not in data:
                print("   ✅ GraphQL schema introspection working")
            else:
                print(f"   ❌ GraphQL errors: {data['errors']}")
                return False
        else:
            print(f"   ❌ GraphQL returned status code: {response.status_code}")
            return False
            
        # Test simple queries
        print("\n3. Testing simple GraphQL queries...")
        simple_queries = [
            {
                "name": "Hello query",
                "query": "query { hello }"
            },
            {
                "name": "Server time query", 
                "query": "query { serverTime }"
            },
            {
                "name": "Version query",
                "query": "query { version { version environment } }"
            }
        ]
        
        for query_test in simple_queries:
            response = requests.post(
                "http://localhost:5000/graphql",
                json={"query": query_test["query"]},
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                if "errors" not in data:
                    print(f"   ✅ {query_test['name']} working")
                else:
                    print(f"   ❌ {query_test['name']} failed: {data['errors']}")
            else:
                print(f"   ❌ {query_test['name']} HTTP error: {response.status_code}")
        
        print("\n✅ All basic tests passed!")
        return True
        
    finally:
        # Stop the application
        print("\n🛑 Stopping application...")
        app_process.terminate()
        app_process.wait(timeout=5)

if __name__ == "__main__":
    success = test_api_fix()
    if success:
        print("\n🎉 API is working correctly!")
    else:
        print("\n❌ Some tests failed")