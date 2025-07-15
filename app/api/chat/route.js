import { NextResponse } from 'next/server'

// Sample conversation history
let conversationHistory = [
  {
    id: 1,
    type: 'ai',
    message: 'Welcome to CHIVITO AI! I\'m your AI assistant. I can help you manage your agents, analyze performance, and optimize your business operations. What would you like to know?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    context: {
      totalRevenue: 82100,
      activeAgents: 5,
      recentTasks: 156
    }
  },
  {
    id: 2,
    type: 'user',
    message: 'How are my agents performing today?',
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    type: 'ai',
    message: 'Your agents are performing excellently today! 🚀\n\n**Top Performers:**\n• Lead Hunter: 94% success rate, $18.5K revenue\n• Customer Support: 96% success rate, resolved 423 tickets\n• Sales Closer: 78% success rate, $31K revenue\n\n**Key Insights:**\n• Total automation hours saved: 8.5h\n• 156 tasks completed today\n• Revenue up 34.5% this month\n\nWould you like me to dive deeper into any specific agent\'s performance?',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    context: {
      agentPerformance: 'analyzed',
      topAgent: 'Customer Support'
    }
  },
  {
    id: 4,
    type: 'user',
    message: 'Can you help me create a workflow to generate more leads?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    type: 'ai',
    message: 'Absolutely! I recommend the **Lead Generation Blast** workflow. Here\'s what it will do:\n\n🎯 **Workflow Overview:**\n• Find 50 qualified leads in your target market\n• Estimated completion: 15 minutes\n• Agents involved: Lead Hunter + Content Creator\n\n📋 **Process:**\n1. Scan LinkedIn for target profiles\n2. Extract & validate contact info\n3. Generate personalized outreach messages\n4. Schedule follow-up sequences\n\n**Expected Results:**\n• 50 new qualified leads\n• 15-20 positive responses\n• 3-5 demo bookings\n\nWould you like me to start this workflow now?',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    context: {
      workflowSuggestion: 'Lead Generation Blast',
      expectedResults: '50 leads, 15-20 responses'
    }
  }
]

// Knowledge base entries
const knowledgeBase = [
  {
    id: 1,
    title: 'Agent Performance Optimization',
    content: 'Best practices for maximizing AI agent efficiency and success rates',
    category: 'optimization',
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: 'Lead Qualification Framework',
    content: 'Comprehensive guide to identifying and scoring qualified leads',
    category: 'sales',
    lastUpdated: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: 'Workflow Automation Strategies',
    content: 'Advanced techniques for creating efficient business workflows',
    category: 'automation',
    lastUpdated: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    conversationHistory,
    knowledgeBase
  })
}

export async function POST(request) {
  try {
    const { message, context } = await request.json()
    
    // Add user message to history
    const userMessage = {
      id: conversationHistory.length + 1,
      type: 'user',
      message,
      timestamp: new Date().toISOString(),
      context
    }
    
    conversationHistory.push(userMessage)
    
    // Generate AI response (simulated)
    const aiResponse = generateAIResponse(message, context)
    
    const aiMessage = {
      id: conversationHistory.length + 1,
      type: 'ai',
      message: aiResponse.message,
      timestamp: new Date().toISOString(),
      context: aiResponse.context
    }
    
    conversationHistory.push(aiMessage)
    
    return NextResponse.json({
      success: true,
      response: aiMessage,
      conversationHistory
    })
    
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

function generateAIResponse(userMessage, context) {
  const lowerMessage = userMessage.toLowerCase()
  
  // Simple AI response logic (in real implementation, this would use OpenAI/Claude)
  if (lowerMessage.includes('agent') && lowerMessage.includes('performance')) {
    return {
      message: 'Your agents are performing excellently! 🚀\n\n**Current Status:**\n• 5 out of 6 agents active\n• Average success rate: 88%\n• Total revenue generated: $82,100\n• Tasks completed today: 156\n\n**Top Performer:** Customer Support (96% success rate)\n**Needs Attention:** Social Media Manager (28% progress)\n\nWould you like me to analyze any specific agent in detail?',
      context: { analyzed: 'agent_performance' }
    }
  }
  
  if (lowerMessage.includes('revenue') || lowerMessage.includes('money')) {
    return {
      message: '💰 **Revenue Analysis:**\n\n**Current Month:** $82,100 (+34.5% growth)\n**Top Revenue Generators:**\n• Sales Closer: $31,000\n• Lead Hunter: $18,500\n• Content Creator: $12,200\n\n**Pipeline Value:** $425,500 (23 active leads)\n**Projected Monthly:** $95,000\n\n**Recommendations:**\n• Focus on Sales Closer optimization\n• Increase Lead Hunter frequency\n• Expand Content Creator campaigns\n\nWant me to create a revenue optimization workflow?',
      context: { analyzed: 'revenue' }
    }
  }
  
  if (lowerMessage.includes('workflow') || lowerMessage.includes('automation')) {
    return {
      message: '⚡ **Available Workflows:**\n\n🎯 **Lead Generation Blast** (15 min)\n• Find 50 qualified leads\n• Generate personalized outreach\n• Expected: 15-20 responses\n\n📢 **Content Marketing Campaign** (30 min)\n• Create blog posts & social content\n• Distribute across all channels\n• Expected: 2000+ impressions\n\n🚀 **Sales Pipeline Acceleration** (20 min)\n• Follow up with warm leads\n• Book demo calls\n• Expected: 3-5 demos scheduled\n\nWhich workflow interests you most?',
      context: { suggested: 'workflows' }
    }
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return {
      message: '🤖 **I can help you with:**\n\n**Agent Management:**\n• Monitor agent performance\n• Optimize success rates\n• Troubleshoot issues\n\n**Business Intelligence:**\n• Analyze revenue trends\n• Track conversion metrics\n• Identify growth opportunities\n\n**Automation:**\n• Create custom workflows\n• Schedule recurring tasks\n• Manage lead pipelines\n\n**Strategy:**\n• Business optimization advice\n• Market analysis\n• Competitive intelligence\n\nWhat would you like to focus on first?',
      context: { provided: 'help_overview' }
    }
  }
  
  // Default response
  return {
    message: 'I understand you\'re asking about: "' + userMessage + '"\n\nAs your AI assistant, I can help you with:\n• Agent performance optimization\n• Revenue analysis and forecasting\n• Workflow automation\n• Lead generation strategies\n• Business intelligence insights\n\nCould you be more specific about what you\'d like to know or accomplish?',
    context: { processed: 'general_query' }
  }
}