#!/usr/bin/env python3
"""
AI Tutor - Project Setup Script
Automates environment setup, dependency installation, and database initialization.
"""

import os
import sys
import subprocess
import shutil

# Colors for terminal output
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
RESET = '\033[0m'
BOLD = '\033[1m'

def print_step(msg):
    print(f"{GREEN}✓{RESET} {msg}")

def print_warning(msg):
    print(f"{YELLOW}⚠{RESET} {msg}")

def print_error(msg):
    print(f"{RED}✗{RESET} {msg}")

def print_header(msg):
    print(f"\n{BOLD}{'='*50}{RESET}")
    print(f"{BOLD}  {msg}{RESET}")
    print(f"{BOLD}{'='*50}{RESET}\n")

def run_command(cmd, cwd=None, capture=False):
    """Run a shell command."""
    try:
        if capture:
            result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
            return result.returncode == 0, result.stdout
        else:
            result = subprocess.run(cmd, shell=True, cwd=cwd)
            return result.returncode == 0, None
    except Exception as e:
        return False, str(e)

def setup_backend():
    """Set up the backend environment."""
    print_header("Setting up Backend")
    
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    if not os.path.exists(backend_dir):
        backend_dir = os.path.dirname(__file__)
    
    venv_path = os.path.join(backend_dir, ".venv")
    
    # Create virtual environment if not exists
    if not os.path.exists(venv_path):
        print_step("Creating virtual environment...")
        success, _ = run_command(f"{sys.executable} -m venv .venv", cwd=backend_dir)
        if not success:
            print_error("Failed to create virtual environment")
            return False
    else:
        print_step("Virtual environment already exists")
    
    # Determine pip path
    if sys.platform == "win32":
        pip_path = os.path.join(venv_path, "Scripts", "pip")
    else:
        pip_path = os.path.join(venv_path, "bin", "pip")
    
    # Install dependencies
    print_step("Installing Python dependencies...")
    success, _ = run_command(f'"{pip_path}" install -r requirements.txt', cwd=backend_dir)
    if not success:
        print_error("Failed to install dependencies")
        return False
    
    print_step("Backend setup complete!")
    return True

def setup_database():
    """Initialize the database."""
    print_header("Setting up Database")
    
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    if not os.path.exists(backend_dir):
        backend_dir = os.path.dirname(__file__)
    
    # Determine python path
    venv_path = os.path.join(backend_dir, ".venv")
    if sys.platform == "win32":
        python_path = os.path.join(venv_path, "Scripts", "python")
    else:
        python_path = os.path.join(venv_path, "bin", "python")
    
    # Run database initialization
    print_step("Initializing database tables...")
    init_script = '''
import sys
sys.path.insert(0, "..")
from backend.database import Base, engine
from backend.models import *
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
'''
    
    # Write temp script
    temp_file = os.path.join(backend_dir, "_init_db.py")
    with open(temp_file, "w") as f:
        f.write(init_script)
    
    success, _ = run_command(f'"{python_path}" _init_db.py', cwd=backend_dir)
    
    # Cleanup
    if os.path.exists(temp_file):
        os.remove(temp_file)
    
    if success:
        print_step("Database initialized!")
    else:
        print_warning("Database initialization had issues (may already exist)")
    
    return True

def setup_env_file():
    """Create .env file if not exists."""
    print_header("Setting up Environment")
    
    root_dir = os.path.dirname(__file__)
    env_path = os.path.join(root_dir, ".env")
    
    if os.path.exists(env_path):
        print_step(".env file already exists")
        return True
    
    env_template = """# AI Tutor Configuration
# Get your API key from https://euron.one

EURIAI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./tutor.db
PARENT_PIN=1234
"""
    
    with open(env_path, "w") as f:
        f.write(env_template)
    
    print_step(".env file created")
    print_warning("Please update EURIAI_API_KEY in .env file!")
    return True

def setup_frontend():
    """Set up the frontend."""
    print_header("Setting up Frontend")
    
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
    
    if not os.path.exists(frontend_dir):
        print_warning("Frontend directory not found, skipping...")
        return True
    
    node_modules = os.path.join(frontend_dir, "node_modules")
    
    if os.path.exists(node_modules):
        print_step("Node modules already installed")
        return True
    
    # Check if npm is available
    success, _ = run_command("npm --version", capture=True)
    if not success:
        print_warning("npm not found, skipping frontend setup")
        return True
    
    print_step("Installing npm dependencies...")
    success, _ = run_command("npm install", cwd=frontend_dir)
    
    if success:
        print_step("Frontend setup complete!")
    else:
        print_warning("Frontend setup had issues")
    
    return True

def main():
    print(f"""
{BOLD}🎓 AI Tutor - Project Setup{RESET}
This script will set up your development environment.
""")
    
    # Run all setup steps
    steps = [
        ("Environment", setup_env_file),
        ("Backend", setup_backend),
        ("Database", setup_database),
        ("Frontend", setup_frontend),
    ]
    
    for name, func in steps:
        try:
            func()
        except Exception as e:
            print_error(f"{name} setup failed: {e}")
    
    # Final instructions
    print_header("Setup Complete!")
    print(f"""
{GREEN}Next steps:{RESET}

1. Update your API key in .env:
   {YELLOW}EURIAI_API_KEY=your_actual_key{RESET}

2. Start the backend:
   {YELLOW}cd backend && source .venv/bin/activate && python api.py{RESET}

3. Start the frontend (new terminal):
   {YELLOW}cd frontend && npm start{RESET}

4. Open http://localhost:3000 in your browser
""")

if __name__ == "__main__":
    main()
