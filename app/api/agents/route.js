import { NextResponse } from 'next/server'

// Sample agent data
const agents = [
  {
    id: 1,
    name: 'Lead Hunter',
    icon: '🎯',
    status: 'active',
    currentTask: 'Scanning LinkedIn for tech CEOs',
    progress: 73,
    lastAction: '2 min ago',
    nextRun: 'In 8 min',
    tasksCompleted: 847,
    successRate: 94,
    revenue: 18500
  },
  {
    id: 2,
    name: 'Content Creator',
    icon: '✍️',
    status: 'active',
    currentTask: 'Writing email sequence for SaaS leads',
    progress: 45,
    lastAction: '5 min ago',
    nextRun: 'In 15 min',
    tasksCompleted: 312,
    successRate: 87,
    revenue: 12200
  },
  {
    id: 3,
    name: 'Sales Closer',
    icon: '🤝',
    status: 'active',
    currentTask: 'Following up with warm prospects',
    progress: 89,
    lastAction: '1 min ago',
    nextRun: 'In 5 min',
    tasksCompleted: 156,
    successRate: 78,
    revenue: 31000
  },
  {
    id: 4,
    name: 'Customer Support',
    icon: '🎧',
    status: 'idle',
    currentTask: 'Monitoring support tickets',
    progress: 100,
    lastAction: '12 min ago',
    nextRun: 'In 3 min',
    tasksCompleted: 423,
    successRate: 96,
    revenue: 8400
  },
  {
    id: 5,
    name: 'Data Analyst',
    icon: '📊',
    status: 'active',
    currentTask: 'Analyzing conversion patterns',
    progress: 62,
    lastAction: '3 min ago',
    nextRun: 'In 12 min',
    tasksCompleted: 89,
    successRate: 91,
    revenue: 5200
  },
  {
    id: 6,
    name: 'Social Media Manager',
    icon: '📱',
    status: 'active',
    currentTask: 'Scheduling LinkedIn posts',
    progress: 28,
    lastAction: '7 min ago',
    nextRun: 'In 18 min',
    tasksCompleted: 234,
    successRate: 83,
    revenue: 6800
  }
]

// Task history for AI execution engine
const taskHistory = [
  {
    id: 1,
    agentId: 1,
    agentName: 'Lead Hunter',
    task: 'Found 3 new qualified prospects on LinkedIn',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: 'completed',
    result: 'Success: 3 leads added to CRM',
    duration: '2.3 min'
  },
  {
    id: 2,
    agentId: 2,
    agentName: 'Content Creator',
    task: 'Generated personalized email for Marcus Chen',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'completed',
    result: 'Success: Email sent with 67% open rate prediction',
    duration: '1.8 min'
  },
  {
    id: 3,
    agentId: 3,
    agentName: 'Sales Closer',
    task: 'Booked demo call with TechStartup Inc',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    status: 'completed',
    result: 'Success: Demo scheduled for tomorrow 2PM',
    duration: '3.2 min'
  },
  {
    id: 4,
    agentId: 4,
    agentName: 'Customer Support',
    task: 'Resolved 2 support tickets automatically',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'completed',
    result: 'Success: 95% satisfaction rating',
    duration: '0.8 min'
  },
  {
    id: 5,
    agentId: 5,
    agentName: 'Data Analyst',
    task: 'Identified high-value customer segment',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'completed',
    result: 'Success: 34% higher LTV segment discovered',
    duration: '4.1 min'
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    agents,
    taskHistory
  })
}

export async function POST(request) {
  try {
    const { action, agentId } = await request.json()
    
    // Simulate agent action
    const agent = agents.find(a => a.id === agentId)
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 })
    }
    
    // Create new task based on action
    const newTask = {
      id: taskHistory.length + 1,
      agentId: agent.id,
      agentName: agent.name,
      task: `${action} initiated`,
      timestamp: new Date().toISOString(),
      status: 'running',
      result: 'Processing...',
      duration: 'Running'
    }
    
    taskHistory.unshift(newTask)
    
    // Update agent status
    agent.status = 'active'
    agent.currentTask = `${action} in progress`
    agent.progress = 0
    agent.lastAction = 'just now'
    
    return NextResponse.json({
      success: true,
      message: `${action} started for ${agent.name}`,
      task: newTask
    })
    
  } catch (error) {
    console.error('Agent action error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to execute agent action' },
      { status: 500 }
    )
  }
}