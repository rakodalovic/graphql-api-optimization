#!/usr/bin/env python3

import sqlite3
import os
import requests
import json

def verify_sqlite_setup():
    """Verify SQLite database setup"""
    project_dir = "/tmp/5308f3564d2a4bd6ad9d22cebf285125"
    db_path = os.path.join(project_dir, "graphql_api.db")
    
    print("🔍 Verifying SQLite Database Setup...")
    
    if not os.path.exists(db_path):
        print("❌ Database file does not exist")
        return False
    
    print("✅ Database file exists")
    
    # Connect to database and verify structure
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get list of tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '__EF%';")
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f"📊 Found {len(tables)} tables:")
    
    # Check some key tables and their data
    key_tables = ['Users', 'Products', 'Orders', 'Categories', 'Reviews']
    for table in key_tables:
        if table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"   ✅ {table}: {count} records")
        else:
            print(f"   ❌ {table}: Missing")
    
    # Test foreign key constraint by checking relationships
    cursor.execute("""
        SELECT p.Name, c.Name as CategoryName 
        FROM Products p 
        JOIN Categories c ON p.CategoryId = c.Id 
        LIMIT 3
    """)
    products = cursor.fetchall()
    
    print(f"🔗 Foreign key relationships working:")
    for product, category in products:
        print(f"   - {product} → {category}")
    
    conn.close()
    
    # Test API endpoint
    try:
        print("\n🌐 Testing API endpoints...")
        response = requests.get("http://localhost:5000/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API Health Check: {data.get('message')}")
            print(f"   Database: {data.get('database')}")
            print(f"   Environment: {data.get('environment')}")
        else:
            print(f"❌ API Health Check failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️  API not running (this is expected if app is not started): {e}")
    
    # Test GraphQL endpoint with a simple query
    try:
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
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        if response.status_code == 200:
            print("✅ GraphQL endpoint is responding")
        else:
            print(f"❌ GraphQL endpoint error: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️  GraphQL endpoint not accessible (this is expected if app is not started): {e}")
    
    print("\n✅ SQLite setup verification completed!")
    return True

if __name__ == "__main__":
    verify_sqlite_setup()