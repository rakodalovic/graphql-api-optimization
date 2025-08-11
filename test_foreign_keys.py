#!/usr/bin/env python3

import sqlite3
import os
import subprocess
import time

def test_foreign_key_constraints():
    """Test that foreign key constraints are working in SQLite"""
    project_dir = "/tmp/5308f3564d2a4bd6ad9d22cebf285125"
    db_path = os.path.join(project_dir, "graphql_api.db")
    
    print("🔍 Testing Foreign Key Constraints...")
    
    # Remove existing database to start fresh
    if os.path.exists(db_path):
        os.remove(db_path)
        print("🗑️  Removed existing database")
    
    # Run the application briefly to create and seed the database
    print("🚀 Starting application to create database...")
    app_process = subprocess.Popen(
        ["dotnet", "run"],
        cwd=project_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for database creation
    time.sleep(8)
    
    # Stop the application
    app_process.terminate()
    app_process.wait(timeout=5)
    print("🛑 Stopped application")
    
    if not os.path.exists(db_path):
        print("❌ Database file was not created")
        return False
    
    # Test foreign key constraints
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if foreign keys are enabled
    cursor.execute("PRAGMA foreign_keys;")
    fk_status = cursor.fetchone()[0]
    print(f"📊 Foreign key status: {fk_status}")
    
    # Enable foreign keys for this connection
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    # Test foreign key constraint by trying to insert invalid data
    try:
        # Try to insert a product with non-existent category
        cursor.execute("""
            INSERT INTO Products (Name, Price, StockQuantity, CategoryId, CreatedAt)
            VALUES ('Test Product', 99.99, 10, 999999, datetime('now'))
        """)
        conn.commit()
        print("❌ Foreign key constraint failed - invalid insert was allowed")
        return False
    except sqlite3.IntegrityError as e:
        if "FOREIGN KEY constraint failed" in str(e):
            print("✅ Foreign key constraint working - invalid insert was rejected")
        else:
            print(f"❌ Unexpected error: {e}")
            return False
    
    # Test valid insert
    try:
        # Get a valid category ID
        cursor.execute("SELECT Id FROM Categories LIMIT 1")
        category_id = cursor.fetchone()[0]
        
        cursor.execute("""
            INSERT INTO Products (Name, Price, StockQuantity, CategoryId, CreatedAt)
            VALUES ('Valid Test Product', 99.99, 10, ?, datetime('now'))
        """, (category_id,))
        conn.commit()
        print("✅ Valid insert successful")
    except sqlite3.Error as e:
        print(f"❌ Valid insert failed: {e}")
        return False
    
    # Check data integrity
    cursor.execute("SELECT COUNT(*) FROM Users")
    user_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM Products")
    product_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM Orders")
    order_count = cursor.fetchone()[0]
    
    print(f"📊 Data verification:")
    print(f"   - Users: {user_count}")
    print(f"   - Products: {product_count}")
    print(f"   - Orders: {order_count}")
    
    conn.close()
    
    print("✅ Foreign key constraints test completed successfully!")
    return True

if __name__ == "__main__":
    test_foreign_key_constraints()