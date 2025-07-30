'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, AlertCircle, Zap, TrendingUp } from 'lucide-react';

export default function WorkflowHub() {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [stats, setStats] = useState({ totalExecutions: 0, successRate: 0, avgExecutionTime: 0 });
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);

  // Demo workflow data
  const DEMO_WORKFLOWS = [
    {
      id: 'lead-scoring',
      name: 'Lead Scoring Automation',
      description: 'Automatically scores leads based on engagement, company size, and behavior patterns',
      category: 'Sales',
      estimatedTime: '2-5 minutes',
      expectedResults: 'Qualified leads with scores 0-100',
      icon: '🎯',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'email-sequence',
      name: 'Email Sequence Automation',
      description: 'Sends personalized follow-up sequences based on lead actions and responses',
      category: 'Marketing',
      estimatedTime: '1-3 minutes',
      expectedResults: 'Automated email campaigns sent',
      icon: '📧',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'data-sync',
      name: 'Data Sync Automation',
      description: 'Syncs customer data between CRM, marketing tools, and analytics platforms',
      category: 'Operations',
      estimatedTime: '3-7 minutes',
      expectedResults: 'Updated customer records across platforms',
      icon: '🔄',
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  useEffect(() => {
    loadWorkflowData();
  }, []);

  const loadWorkflowData = async () => {
    try {
      const response = await fetch('/api/n8n-workflows');
      const data = await response.json();
      if (data.success) {
        setExecutions(data.executions || []);
        setStats(data.stats || { totalExecutions: 0, successRate: 0, avgExecutionTime: 0 });
      }
    } catch (error) {
      console.error('Error loading workflow data:', error);
    }
  };

  const triggerWorkflow = async (workflow) => {
    setIsExecuting(true);
    setExecutionResults(null);
    
    // Demo input data based on workflow type
    const demoInputData = {
      'lead-scoring': {
        email: 'prospect@techstartup.com',
        name: 'Alex Johnson',
        company: 'TechStartup Inc'
      },
      'email-sequence': {
        email: 'ceo@growthcorp.com',
        name: 'Sarah Chen',
        company: 'GrowthCorp',
        sequenceType: 'lead_nurture'
      },
      'data-sync': {
        customerId: 'CUST_001',
        email: 'customer@example.com',
        name: 'John Smith',
        company: 'Example Corp',
        source: 'chivito_dashboard'
      }
    };

    try {
      const response = await fetch('/api/n8n-workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'trigger_workflow', 
          data: {
            workflowId: workflow.id,
            workflowName: workflow.name,
            inputData: demoInputData[workflow.id]
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setExecutionResults(result);
        
        // Start monitoring execution status
        if (result.execution) {
          monitorExecution(result.execution.id);
        }
      }
    } catch (error) {
      console.error('Error triggering workflow:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const monitorExecution = async (executionId) => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/n8n-workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'get_execution_status', 
            data: { executionId } 
          })
        });
        
        const result = await response.json();
        if (result.success) {
          if (result.finished) {
            loadWorkflowData(); // Refresh data
          } else {
            setTimeout(checkStatus, 2000); // Check again in 2 seconds
          }
        }
      } catch (error) {
        console.error('Error checking execution status:', error);
      }
    };

    checkStatus();
  };

  const importWorkflowTemplates = async () => {
    // Demo function to simulate template import
    console.log('Importing workflow templates...');
    
    // In real implementation, this would import the JSON templates
    const templates = [
      { name: 'Lead Scoring Automation', status: 'imported' },
      { name: 'Email Sequence Automation', status: 'imported' },
      { name: 'Data Sync Automation', status: 'imported' }
    ];
    
    alert('Demo templates imported successfully! In production, these would be imported to your n8n instance.');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">⚡ Workflow Hub</h1>
        <p className="text-gray-600">Trigger live business automations - Watch workflows execute in real-time!</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="premium-card text-center">
          <div className="text-2xl font-bold text-royal-600">{stats.totalExecutions}</div>
          <div className="text-sm text-gray-600">Total Executions</div>
        </div>
        <div className="premium-card text-center">
          <div className="text-2xl font-bold text-royal-600">{stats.successRate}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="premium-card text-center">
          <div className="text-2xl font-bold text-royal-600">{stats.avgExecutionTime}s</div>
          <div className="text-sm text-gray-600">Avg Execution Time</div>
        </div>
      </div>

      {/* Template Import */}
      <div className="premium-card">
        <h2 className="text-xl font-bold mb-4">🔧 Quick Setup</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={importWorkflowTemplates}
            className="premium-button"
          >
            📥 Import Demo Templates
          </button>
          <div className="text-sm text-gray-600 mt-2">
            Import ready-to-use workflow templates: Lead Scoring, Email Sequences, Data Sync
          </div>
        </div>
      </div>

      {/* Execution Results */}
      {executionResults && (
        <div className="premium-card bg-green-50 border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Workflow Execution Results</h3>
          <div className="space-y-2">
            <p><strong>Workflow:</strong> {executionResults.execution?.workflowName}</p>
            <p><strong>Status:</strong> {executionResults.execution?.status}</p>
            <p><strong>Start Time:</strong> {new Date(executionResults.execution?.startTime).toLocaleString()}</p>
            <p className="text-sm text-green-700">{executionResults.message}</p>
            <p className="text-sm font-semibold text-royal-600">{executionResults.ponchInsight}</p>
          </div>
        </div>
      )}

      {/* Available Workflows */}
      <div className="premium-card">
        <h2 className="text-xl font-bold mb-4">🚀 Available Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_WORKFLOWS.map(workflow => (
            <div key={workflow.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{workflow.icon}</span>
                  <div>
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${workflow.color}`}>
                      {workflow.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
              
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>Est. Time: {workflow.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp size={12} />
                  <span>Result: {workflow.expectedResults}</span>
                </div>
              </div>
              
              <button 
                onClick={() => triggerWorkflow(workflow)}
                disabled={isExecuting}
                className="w-full mt-4 royal-button text-sm"
              >
                {isExecuting ? (
                  <>
                    <Zap size={14} className="animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Trigger Workflow
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Executions */}
      <div className="premium-card">
        <h2 className="text-xl font-bold mb-4">📊 Recent Executions</h2>
        {executions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No executions yet. Trigger a workflow above to see live results!</p>
        ) : (
          <div className="space-y-4">
            {executions.map(execution => (
              <div key={execution.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{execution.workflowName}</h3>
                    <p className="text-sm text-gray-600">Started: {new Date(execution.startTime).toLocaleString()}</p>
                    {execution.endTime && (
                      <p className="text-xs text-gray-500">Completed: {new Date(execution.endTime).toLocaleString()}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        execution.status === 'success' ? 'bg-green-100 text-green-800' :
                        execution.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                        execution.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {execution.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ID: {execution.id}
                    </div>
                  </div>
                </div>
                
                {execution.results && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <strong>Results:</strong> {JSON.stringify(execution.results, null, 2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}