#!/usr/bin/env python3
"""
Health check script for Skribe
Verifies that all components are working correctly
"""

import requests
import json
import os
import sys
from urllib.parse import urlparse

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"
WS_URL = "ws://localhost:8000"

def check_backend():
    """Check if backend is running and healthy"""
    print("🔧 Checking backend...")
    
    try:
        # Health check endpoint
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print("  ✅ Backend health check passed")
        else:
            print(f"  ❌ Backend health check failed: {response.status_code}")
            return False
            
        # Root endpoint
        response = requests.get(f"{BACKEND_URL}/", timeout=5)
        if response.status_code == 200:
            print("  ✅ Backend root endpoint accessible")
        else:
            print(f"  ❌ Backend root endpoint failed: {response.status_code}")
            return False
            
        # API docs
        response = requests.get(f"{BACKEND_URL}/docs", timeout=5)
        if response.status_code == 200:
            print("  ✅ API documentation accessible")
        else:
            print(f"  ❌ API documentation failed: {response.status_code}")
            return False
            
        return True
        
    except requests.exceptions.ConnectionError:
        print("  ❌ Cannot connect to backend - is it running?")
        return False
    except requests.exceptions.Timeout:
        print("  ❌ Backend request timed out")
        return False
    except Exception as e:
        print(f"  ❌ Backend check failed: {e}")
        return False

def check_frontend():
    """Check if frontend is running"""
    print("🎨 Checking frontend...")
    
    try:
        response = requests.get(FRONTEND_URL, timeout=10)
        if response.status_code == 200:
            print("  ✅ Frontend is accessible")
            return True
        else:
            print(f"  ❌ Frontend returned status: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("  ❌ Cannot connect to frontend - is it running?")
        return False
    except requests.exceptions.Timeout:
        print("  ❌ Frontend request timed out")
        return False
    except Exception as e:
        print(f"  ❌ Frontend check failed: {e}")
        return False

def check_openai_key():
    """Check if OpenAI API key is configured"""
    print("🤖 Checking OpenAI configuration...")
    
    # Check backend .env file
    env_path = "backend/.env"
    if not os.path.exists(env_path):
        print("  ❌ Backend .env file not found")
        return False
    
    with open(env_path, 'r') as f:
        env_content = f.read()
    
    if "OPENAI_API_KEY=" in env_content:
        # Check if it's not the placeholder
        for line in env_content.split('\n'):
            if line.startswith('OPENAI_API_KEY='):
                key = line.split('=', 1)[1].strip()
                if key and key != "your_openai_api_key_here":
                    print("  ✅ OpenAI API key is configured")
                    return True
                else:
                    print("  ⚠️  OpenAI API key is not set (using placeholder)")
                    return False
    
    print("  ❌ OpenAI API key not found in .env file")
    return False

def check_database():
    """Check if database is accessible"""
    print("💾 Checking database...")
    
    try:
        # Try to get sessions list
        response = requests.get(f"{BACKEND_URL}/api/v1/sessions/", timeout=5)
        if response.status_code == 200:
            sessions = response.json()
            print(f"  ✅ Database accessible ({len(sessions)} sessions found)")
            return True
        else:
            print(f"  ❌ Database check failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"  ❌ Database check failed: {e}")
        return False

def check_api_endpoints():
    """Test key API endpoints"""
    print("🔗 Checking API endpoints...")
    
    endpoints = [
        ("/api/v1/sessions/", "Sessions endpoint"),
        ("/api/v1/qr/summary/test", "QR code endpoint (should return 404, which is expected)"),
    ]
    
    success_count = 0
    for endpoint, description in endpoints:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=5)
            # For sessions, expect 200. For QR test, expect 404 (normal)
            if (endpoint.endswith("sessions/") and response.status_code == 200) or \
               (endpoint.endswith("/test") and response.status_code == 404):
                print(f"  ✅ {description}")
                success_count += 1
            else:
                print(f"  ⚠️  {description} - unexpected status: {response.status_code}")
        except Exception as e:
            print(f"  ❌ {description} - error: {e}")
    
    return success_count == len(endpoints)

def print_summary(results):
    """Print overall health check summary"""
    print("\n" + "="*60)
    print("🏥 SKRIBE HEALTH CHECK SUMMARY")
    print("="*60)
    
    total_checks = len(results)
    passed_checks = sum(results.values())
    
    for check, status in results.items():
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {check}")
    
    print(f"\n📊 Overall Status: {passed_checks}/{total_checks} checks passed")
    
    if passed_checks == total_checks:
        print("🎉 All systems are healthy! Ready for demo.")
        print("\n🚀 Next steps:")
        print("   1. Open http://localhost:3000 to access Skribe")
        print("   2. Check out the DEMO_GUIDE.md for presentation tips")
        print("   3. Create a new session to test live transcription")
        return True
    else:
        print("⚠️  Some issues detected. Please review the failed checks above.")
        print("\n🔧 Common fixes:")
        if not results.get("Backend"):
            print("   - Make sure backend is running: cd backend && uvicorn main:app --reload")
        if not results.get("Frontend"):
            print("   - Make sure frontend is running: cd frontend && npm run dev")
        if not results.get("OpenAI Configuration"):
            print("   - Set your OpenAI API key in backend/.env")
        return False

def main():
    """Run all health checks"""
    print("🏥 Starting Skribe Health Check...\n")
    
    results = {
        "Backend": check_backend(),
        "Frontend": check_frontend(),
        "OpenAI Configuration": check_openai_key(),
        "Database": check_database(),
        "API Endpoints": check_api_endpoints(),
    }
    
    success = print_summary(results)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
