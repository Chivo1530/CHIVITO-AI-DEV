#!/usr/bin/env python3
"""
Test the actual authentication flow with the new Supabase project
"""

import requests
import json
import uuid

def test_supabase_auth_direct():
    """Test Supabase authentication directly"""
    print("🔐 Testing Supabase Authentication Flow...")
    
    supabase_url = "https://mwaktovpihmhvyhoillk.supabase.co"
    anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWt0b3ZwaWhtaHZ5aG9pbGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MjAxMjksImV4cCI6MjA2ODE5NjEyOX0.lFgLWst_1QswoWI5BJRaCmJaGG_qWvXUTqW58Y4I0vc"
    
    headers = {
        "apikey": anon_key,
        "Authorization": f"Bearer {anon_key}",
        "Content-Type": "application/json"
    }
    
    # Test 1: Check if auth endpoint is accessible
    print("\n1. Testing auth endpoint accessibility...")
    try:
        response = requests.get(f"{supabase_url}/auth/v1/settings", headers=headers, timeout=10)
        print(f"   Auth settings endpoint: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Auth endpoint is accessible")
        else:
            print(f"   ⚠️  Auth endpoint returned: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Auth endpoint error: {e}")
    
    # Test 2: Test signup with a real email format
    print("\n2. Testing signup flow...")
    test_email = f"test{uuid.uuid4().hex[:8]}@chivitoai.com"
    signup_payload = {
        "email": test_email,
        "password": "ChivitoAI2025!"
    }
    
    try:
        response = requests.post(
            f"{supabase_url}/auth/v1/signup",
            headers=headers,
            json=signup_payload,
            timeout=10
        )
        print(f"   Signup response: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Signup successful!")
            print(f"   User ID: {data.get('user', {}).get('id', 'N/A')}")
            print(f"   Email: {data.get('user', {}).get('email', 'N/A')}")
        elif response.status_code == 400:
            error_data = response.json()
            print(f"   ⚠️  Signup validation error: {error_data}")
        else:
            print(f"   ❌ Signup failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error details: {error_data}")
            except:
                print(f"   Raw response: {response.text}")
                
    except Exception as e:
        print(f"   ❌ Signup test error: {e}")
    
    # Test 3: Test signin with invalid credentials (should fail gracefully)
    print("\n3. Testing signin flow...")
    signin_payload = {
        "email": "test@chivito.ai",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(
            f"{supabase_url}/auth/v1/token?grant_type=password",
            headers=headers,
            json=signin_payload,
            timeout=10
        )
        print(f"   Signin response: {response.status_code}")
        
        if response.status_code == 400:
            error_data = response.json()
            if "Invalid login credentials" in str(error_data):
                print("   ✅ Signin working correctly (invalid credentials rejected)")
            else:
                print(f"   ⚠️  Signin error: {error_data}")
        elif response.status_code == 200:
            print("   ⚠️  Signin unexpectedly succeeded")
        else:
            print(f"   ❌ Signin unexpected response: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Signin test error: {e}")
    
    # Test 4: Check if email confirmation is required
    print("\n4. Testing email confirmation settings...")
    try:
        response = requests.get(f"{supabase_url}/auth/v1/settings", headers=headers, timeout=10)
        if response.status_code == 200:
            settings = response.json()
            email_confirm = settings.get('email_confirm', True)
            print(f"   Email confirmation required: {email_confirm}")
            if not email_confirm:
                print("   ✅ Email confirmation disabled - users can signup directly")
            else:
                print("   ⚠️  Email confirmation required - users need to verify email")
        else:
            print(f"   ⚠️  Could not retrieve auth settings: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Settings test error: {e}")

if __name__ == "__main__":
    test_supabase_auth_direct()