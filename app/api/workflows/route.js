import { NextResponse } from 'next/server'

// Sample workflow templates
const workflowTemplates = [
  {
    id: 1,
    name: 'Lead Generation Blast',
    description: 'Find 50 qualified leads in your target market',
    icon: '🎯',
    estimatedTime: '15 min',
    agents: ['Lead Hunter', 'Content Creator'],
    steps: [
      'Scan LinkedIn for target profiles',
      'Extract contact information',
      'Validate email addresses',
      'Generate personalized outreach messages',
      'Schedule follow-up sequence'
    ]
  },
  {
    id: 2,
    name: 'Content Marketing Campaign',
    description: 'Create and distribute content across all channels',
    icon: '📢',
    estimatedTime: '30 min',
    agents: ['Content Creator', 'Social Media Manager'],
    steps: [
      'Generate blog post ideas',
      'Write high-quality articles',
      'Create social media posts',
      'Schedule content distribution',
      'Monitor engagement metrics'
    ]
  },
  {
    id: 3,
    name: 'Sales Pipeline Acceleration',
    description: 'Follow up with warm leads and book demos',
    icon: '🚀',
    estimatedTime: '20 min',
    agents: ['Sales Closer', 'Customer Support'],
    steps: [
      'Prioritize warm leads',
      'Send personalized follow-ups',
      'Handle objections automatically',
      'Schedule demo calls',
      'Create follow-up tasks'
    ]
  },
  {
    id: 4,
    name: 'Customer Retention Boost',
    description: 'Identify at-risk customers and re-engage them',
    icon: '💎',
    estimatedTime: '25 min',
    agents: ['Data Analyst', 'Customer Support'],
    steps: [
      'Analyze customer behavior patterns',
      'Identify churn risk factors',
      'Create retention campaigns',
      'Send personalized offers',
      'Monitor success metrics'
    ]
  },
  {
    id: 5,
    name: 'Market Research Deep Dive',
    description: 'Analyze competitors and market opportunities',
    icon: '🔍',
    estimatedTime: '45 min',
    agents: ['Data Analyst', 'Lead Hunter'],
    steps: [
      'Gather competitor intelligence',
      'Analyze market trends',
      'Identify opportunity gaps',
      'Create strategic recommendations',
      'Generate actionable insights'
    ]
  }
]

// Active workflows
let activeWorkflows = []

export async function GET() {
  return NextResponse.json({
    success: true,
    templates: workflowTemplates,
    activeWorkflows
  })
}

export async function POST(request) {
  try {
    const { templateId, customParams } = await request.json()
    
    const template = workflowTemplates.find(t => t.id === templateId)
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 })
    }
    
    // Create new workflow execution
    const workflowExecution = {
      id: activeWorkflows.length + 1,
      templateId: template.id,
      name: template.name,
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + (parseInt(template.estimatedTime) * 60 * 1000)).toISOString(),
      agents: template.agents,
      steps: template.steps.map((step, index) => ({
        id: index + 1,
        description: step,
        status: index === 0 ? 'running' : 'pending',
        completedAt: null
      })),
      customParams
    }
    
    activeWorkflows.push(workflowExecution)
    
    return NextResponse.json({
      success: true,
      message: `Workflow "${template.name}" started successfully`,
      workflow: workflowExecution
    })
    
  } catch (error) {
    console.error('Workflow execution error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to start workflow' },
      { status: 500 }
    )
  }
}