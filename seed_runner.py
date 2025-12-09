import sys
import os
# Add current directory to path
sys.path.append(os.getcwd())

# Import and run seed function
try:
    from backend.seed_db import seed_data
    if __name__ == "__main__":
        print("🚀 Starting DB Seed via Runner...")
        seed_data()
        print("✅ DB Seed Runner Complete")
except ImportError as e:
    print(f"❌ Import Error: {e}")
    # Print sys.path for debugging
    print(f"System Path: {sys.path}")
except Exception as e:
    print(f"❌ Error: {e}")
