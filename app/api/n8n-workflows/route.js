// N8N Workflow Automation Integration for CHIVITO AI
// Complete workflow execution and monitoring system

import { NextResponse } from 'next/server'

// N8N API Configuration
const N8N_API_KEY = process.env.N8N_API_KEY
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678'

// Workflow execution storage (in production, use MongoDB)
let workflowExecutions = []

export async function GET() {
  return NextResponse.json({
    success: true,
    executions: workflowExecutions,
    stats: {
      totalExecutions: workflowExecutions.length,
      successRate: calculateSuccessRate(),
      avgExecutionTime: calculateAvgExecutionTime()
    }
  })
}

export async function POST(request) {
  try {
    const { action, data } = await request.json()
    
    switch (action) {
      case 'trigger_workflow':
        return await triggerWorkflow(data)
      
      case 'get_execution_status':
        return await getExecutionStatus(data)
      
      case 'get_available_workflows':
        return await getAvailableWorkflows()
      
      case 'import_template':
        return await importWorkflowTemplate(data)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('N8N API error:', error)
    return NextResponse.json(
      { success: false, error: 'Workflow automation failed' },
      { status: 500 }
    )
  }
}

async function triggerWorkflow(workflowData) {
  try {
    // Trigger workflow via n8n API
    const response = await fetch(`${N8N_BASE_URL}/rest/workflows/${workflowData.workflowId}/run`, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workflowData.inputData || {})
    })
    
    if (!response.ok) {
      throw new Error(`N8N API error: ${response.status}`)
    }
    
    const result = await response.json()
    
    // Store execution for tracking
    const execution = {
      id: result.id,
      workflowId: workflowData.workflowId,
      workflowName: workflowData.workflowName,
      status: 'running',
      startTime: new Date().toISOString(),
      inputData: workflowData.inputData,
      results: null,
      ponchInsight: "Live workflow execution during demo!"
    }
    
    workflowExecutions.push(execution)
    
    return NextResponse.json({
      success: true,
      execution: execution,
      message: `🚀 Workflow "${workflowData.workflowName}" triggered successfully!`,
      ponchInsight: "Prospect is watching real automation execute right now!"
    })
    
  } catch (error) {
    console.error('Workflow trigger error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function getExecutionStatus(statusData) {
  try {
    const response = await fetch(`${N8N_BASE_URL}/rest/executions/${statusData.executionId}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY
      }
    })
    
    if (!response.ok) {
      throw new Error(`N8N API error: ${response.status}`)
    }
    
    const result = await response.json()
    
    // Update local execution tracking
    const execution = workflowExecutions.find(e => e.id === statusData.executionId)
    if (execution) {
      execution.status = result.status
      execution.endTime = result.finished ? new Date().toISOString() : null
      execution.results = result.data
    }
    
    return NextResponse.json({
      success: true,
      status: result.status,
      finished: result.finished,
      data: result.data,
      execution: execution
    })
    
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function getAvailableWorkflows() {
  try {
    const response = await fetch(`${N8N_BASE_URL}/rest/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY
      }
    })
    
    if (!response.ok) {
      throw new Error(`N8N API error: ${response.status}`)
    }
    
    const workflows = await response.json()
    
    return NextResponse.json({
      success: true,
      workflows: workflows.map(w => ({
        id: w.id,
        name: w.name,
        active: w.active,
        tags: w.tags || [],
        description: getWorkflowDescription(w.name)
      }))
    })
    
  } catch (error) {
    console.error('Get workflows error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function importWorkflowTemplate(templateData) {
  try {
    const response = await fetch(`${N8N_BASE_URL}/rest/workflows/import`, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(templateData.workflowJson)
    })
    
    if (!response.ok) {
      throw new Error(`N8N API error: ${response.status}`)
    }
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      workflow: result,
      message: `✅ Template "${templateData.name}" imported successfully!`
    })
    
  } catch (error) {
    console.error('Import template error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

function getWorkflowDescription(name) {
  const descriptions = {
    'Lead Scoring Automation': 'Automatically scores leads based on engagement, company size, and behavior patterns',
    'Email Sequence Automation': 'Sends personalized email sequences based on lead actions and responses',
    'Data Sync Automation': 'Syncs customer data between CRM, marketing tools, and analytics platforms',
    'Apollo Lead Generation': 'Searches Apollo.io for qualified prospects and adds them to CRM',
    'Stripe Revenue Tracking': 'Tracks payments, updates customer records, and triggers retention workflows'
  }
  
  return descriptions[name] || 'Custom business automation workflow'
}

function calculateSuccessRate() {
  if (workflowExecutions.length === 0) return 0
  const successful = workflowExecutions.filter(e => e.status === 'success').length
  return Math.round((successful / workflowExecutions.length) * 100)
}

function calculateAvgExecutionTime() {
  const completedExecutions = workflowExecutions.filter(e => e.endTime)
  if (completedExecutions.length === 0) return 0
  
  const totalTime = completedExecutions.reduce((sum, e) => {
    const duration = new Date(e.endTime) - new Date(e.startTime)
    return sum + duration
  }, 0)
  
  return Math.round(totalTime / completedExecutions.length / 1000) // seconds
}

// Demo workflow data for instant setup
export const DEMO_WORKFLOWS = [
  {
    id: 'lead-scoring',
    name: 'Lead Scoring Automation',
    description: 'Scores leads based on engagement and company data',
    category: 'Sales',
    estimatedTime: '2-5 minutes',
    expectedResults: 'Qualified leads with scores 0-100'
  },
  {
    id: 'email-sequence',
    name: 'Email Sequence Automation',
    description: 'Sends personalized follow-up sequences',
    category: 'Marketing',
    estimatedTime: '1-3 minutes',
    expectedResults: 'Automated email campaigns sent'
  },
  {
    id: 'data-sync',
    name: 'Data Sync Automation',
    description: 'Syncs data between CRM and marketing tools',
    category: 'Operations',
    estimatedTime: '3-7 minutes',
    expectedResults: 'Updated customer records across platforms'
  }
]