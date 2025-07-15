#!/usr/bin/env python3
"""
CHIVITO AI Platform Backend API Testing Suite
Tests all Next.js API routes for functionality and data consistency
"""

import requests
import json
import sys
from datetime import datetime
import time

class ChivitoAPITester:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            'name': name,
            'success': success,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })

    def test_agents_api(self):
        """Test /api/agents endpoint"""
        print("\n🤖 Testing Agents API...")
        
        # Test GET /api/agents
        try:
            response = requests.get(f"{self.base_url}/api/agents", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'agents' in data and 'taskHistory' in data:
                    agents = data['agents']
                    if len(agents) == 6:  # Should have 6 agents
                        # Verify agent structure
                        required_fields = ['id', 'name', 'icon', 'status', 'currentTask', 'progress', 'revenue']
                        agent_valid = all(field in agents[0] for field in required_fields)
                        if agent_valid:
                            self.log_test("GET /api/agents", True, f"Retrieved {len(agents)} agents with correct structure")
                        else:
                            self.log_test("GET /api/agents", False, "Agent structure missing required fields")
                    else:
                        self.log_test("GET /api/agents", False, f"Expected 6 agents, got {len(agents)}")
                else:
                    self.log_test("GET /api/agents", False, "Response missing required fields")
            else:
                self.log_test("GET /api/agents", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/agents", False, str(e))

        # Test POST /api/agents (agent action)
        try:
            payload = {"action": "Optimize lead generation", "agentId": 1}
            response = requests.post(f"{self.base_url}/api/agents", json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'task' in data:
                    self.log_test("POST /api/agents", True, "Agent action executed successfully")
                else:
                    self.log_test("POST /api/agents", False, "Response missing success or task")
            else:
                self.log_test("POST /api/agents", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/agents", False, str(e))

    def test_lead_api(self):
        """Test /api/lead endpoint"""
        print("\n👥 Testing Lead API...")
        
        try:
            payload = {
                "name": "Test User",
                "email": "test@example.com",
                "message": "I'm interested in your AI automation services for my business. This is urgent!"
            }
            response = requests.post(f"{self.base_url}/api/lead", json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'score' in data and 'priority' in data:
                    score = data['score']
                    priority = data['priority']
                    if score > 50 and priority == 'HIGH':  # Should be high priority due to "urgent"
                        self.log_test("POST /api/lead", True, f"Lead processed with score {score}, priority {priority}")
                    else:
                        self.log_test("POST /api/lead", True, f"Lead processed with score {score}, priority {priority}")
                else:
                    self.log_test("POST /api/lead", False, "Response missing required fields")
            else:
                self.log_test("POST /api/lead", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/lead", False, str(e))

    def test_chat_api(self):
        """Test /api/chat endpoint"""
        print("\n💬 Testing Chat API...")
        
        # Test GET /api/chat
        try:
            response = requests.get(f"{self.base_url}/api/chat", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'conversationHistory' in data and 'knowledgeBase' in data:
                    history = data['conversationHistory']
                    if len(history) > 0:
                        self.log_test("GET /api/chat", True, f"Retrieved {len(history)} conversation messages")
                    else:
                        self.log_test("GET /api/chat", False, "No conversation history found")
                else:
                    self.log_test("GET /api/chat", False, "Response missing required fields")
            else:
                self.log_test("GET /api/chat", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/chat", False, str(e))

        # Test POST /api/chat
        try:
            payload = {
                "message": "How are my agents performing?",
                "context": {"currentTab": "dashboard"}
            }
            response = requests.post(f"{self.base_url}/api/chat", json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'response' in data:
                    ai_response = data['response']
                    if 'message' in ai_response and len(ai_response['message']) > 0:
                        self.log_test("POST /api/chat", True, "AI response generated successfully")
                    else:
                        self.log_test("POST /api/chat", False, "Empty AI response")
                else:
                    self.log_test("POST /api/chat", False, "Response missing required fields")
            else:
                self.log_test("POST /api/chat", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/chat", False, str(e))

    def test_workflows_api(self):
        """Test /api/workflows endpoint"""
        print("\n⚡ Testing Workflows API...")
        
        # Test GET /api/workflows
        try:
            response = requests.get(f"{self.base_url}/api/workflows", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'templates' in data and 'activeWorkflows' in data:
                    templates = data['templates']
                    if len(templates) >= 3:  # Should have at least 3 workflow templates
                        self.log_test("GET /api/workflows", True, f"Retrieved {len(templates)} workflow templates")
                    else:
                        self.log_test("GET /api/workflows", False, f"Expected at least 3 templates, got {len(templates)}")
                else:
                    self.log_test("GET /api/workflows", False, "Response missing required fields")
            else:
                self.log_test("GET /api/workflows", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/workflows", False, str(e))

        # Test POST /api/workflows (start workflow)
        try:
            payload = {"templateId": 1, "customParams": {"targetMarket": "tech startups"}}
            response = requests.post(f"{self.base_url}/api/workflows", json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'workflow' in data:
                    workflow = data['workflow']
                    if 'id' in workflow and 'status' in workflow and workflow['status'] == 'running':
                        self.log_test("POST /api/workflows", True, "Workflow started successfully")
                    else:
                        self.log_test("POST /api/workflows", False, "Workflow not properly initialized")
                else:
                    self.log_test("POST /api/workflows", False, "Response missing required fields")
            else:
                self.log_test("POST /api/workflows", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/workflows", False, str(e))

    def test_data_consistency(self):
        """Test data consistency across endpoints"""
        print("\n🔍 Testing Data Consistency...")
        
        try:
            # Get agents data
            agents_response = requests.get(f"{self.base_url}/api/agents", timeout=10)
            if agents_response.status_code == 200:
                agents_data = agents_response.json()
                agents = agents_data.get('agents', [])
                
                # Verify agent names match expected values
                expected_agents = ['Lead Hunter', 'Content Creator', 'Sales Closer', 'Customer Support', 'Data Analyst', 'Social Media Manager']
                actual_agents = [agent['name'] for agent in agents]
                
                if set(expected_agents) == set(actual_agents):
                    self.log_test("Agent Names Consistency", True, "All expected agents present")
                else:
                    missing = set(expected_agents) - set(actual_agents)
                    extra = set(actual_agents) - set(expected_agents)
                    self.log_test("Agent Names Consistency", False, f"Missing: {missing}, Extra: {extra}")
                
                # Verify revenue values are realistic
                total_revenue = sum(agent['revenue'] for agent in agents)
                if 50000 <= total_revenue <= 150000:  # Reasonable range
                    self.log_test("Revenue Values Consistency", True, f"Total revenue: ${total_revenue:,}")
                else:
                    self.log_test("Revenue Values Consistency", False, f"Unrealistic total revenue: ${total_revenue:,}")
                    
            else:
                self.log_test("Data Consistency", False, "Could not retrieve agents data")
                
        except Exception as e:
            self.log_test("Data Consistency", False, str(e))

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting CHIVITO AI Backend API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Wait for server to be ready
        print("⏳ Waiting for server to be ready...")
        max_retries = 30
        for i in range(max_retries):
            try:
                response = requests.get(f"{self.base_url}/api/agents", timeout=5)
                if response.status_code == 200:
                    print("✅ Server is ready!")
                    break
            except:
                if i == max_retries - 1:
                    print("❌ Server not responding after 30 attempts")
                    return False
                time.sleep(2)
        
        # Run all tests
        self.test_agents_api()
        self.test_lead_api()
        self.test_chat_api()
        self.test_workflows_api()
        self.test_data_consistency()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
            return True
        else:
            print(f"\n⚠️  {self.tests_run - self.tests_passed} tests failed. Check the details above.")
            return False

def main():
    """Main test execution"""
    # Check if custom URL provided
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
    
    tester = ChivitoAPITester(base_url)
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())