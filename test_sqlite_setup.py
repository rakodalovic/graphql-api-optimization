#!/usr/bin/env python3

import subprocess
import time
import requests
import os
import sqlite3
import json

def run_command(cmd, cwd=None):
    """Run a command and return the result"""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd)
    return result

def test_sqlite_database():
    """Test SQLite database setup"""
    project_dir = "/tmp/5308f3564d2a4bd6ad9d22cebf285125"
    db_path = os.path.join(project_dir, "graphql_api.db")
    
    print("🔍 Testing SQLite Database Configuration...")
    
    # Start the application in background
    print("🚀 Starting the GraphQL API application...")
    app_process = subprocess.Popen(
        ["dotnet", "run"],
        cwd=project_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for application to start
    print("⏳ Waiting for application to start...")
    time.sleep(10)
    
    try:
        # Check if database file was created
        if os.path.exists(db_path):
            print("✅ SQLite database file created successfully")
            
            # Connect to database and check tables
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Get list of tables
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [row[0] for row in cursor.fetchall()]
            
            print(f"📊 Found {len(tables)} tables in database:")
            for table in sorted(tables):
                if not table.startswith('__'):  # Skip EF migration tables
                    cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    count = cursor.fetchone()[0]
                    print(f"   - {table}: {count} records")
            
            # Check foreign key constraints are enabled
            cursor.execute("PRAGMA foreign_keys;")
            fk_status = cursor.fetchone()[0]
            if fk_status == 1:
                print("✅ Foreign key constraints are enabled")
            else:
                print("❌ Foreign key constraints are NOT enabled")
            
            conn.close()
            
        else:
            print("❌ SQLite database file was not created")
            return False
            
        # Test API endpoint
        try:
            response = requests.get("http://localhost:5000/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print("✅ API is responding correctly")
                print(f"   Database: {data.get('database', 'Unknown')}")
            else:
                print(f"❌ API returned status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to connect to API: {e}")
            
        # Test GraphQL endpoint
        try:
            graphql_query = {
                "query": "{ __schema { types { name } } }"
            }
            response = requests.post(
                "http://localhost:5000/graphql", 
                json=graphql_query,
                timeout=5
            )
            if response.status_code == 200:
                print("✅ GraphQL endpoint is working")
            else:
                print(f"❌ GraphQL endpoint returned status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to connect to GraphQL endpoint: {e}")
            
    finally:
        # Stop the application
        print("🛑 Stopping the application...")
        app_process.terminate()
        app_process.wait(timeout=5)
    
    print("✅ SQLite configuration test completed!")
    return True

if __name__ == "__main__":
    test_sqlite_database()