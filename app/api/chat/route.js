import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message } = await request.json()

    // Demo response for P$ AI Assistant
    const demoResponses = [
      "🎯 **Strategic Analysis Complete**\n\nBased on your query, here's my recommendation:\n\n**Immediate Actions:**\n• Implement automated lead scoring (40% better conversion)\n• Deploy AI-powered email sequences (3x response rate)\n• Set up predictive analytics for customer behavior\n\n**Expected ROI:** 250-400% efficiency improvement within 90 days\n\nWould you like me to create a detailed implementation roadmap?",
      
      "💰 **Revenue Optimization Strategy**\n\nHere's your personalized growth plan:\n\n**Revenue Drivers:**\n• Dynamic pricing optimization (15-25% revenue increase)\n• Automated upsell/cross-sell campaigns (30% uplift)\n• Customer lifetime value optimization\n\n**Performance Metrics:**\n• 40-60% increase in monthly recurring revenue\n• 3x improvement in customer acquisition efficiency\n• 25% reduction in churn rate\n\nWhich growth metric is most important to your business?",
      
      "🚀 **Automation Intelligence Report**\n\nTransform your operations with these strategic implementations:\n\n**Core Automation Pillars:**\n• Process automation (eliminate 70% of manual tasks)\n• Decision automation (faster, data-driven choices)\n• Communication automation (seamless interactions)\n\n**Expected Outcomes:**\n• 300% productivity improvement\n• 90% reduction in manual errors\n• 50% faster decision-making\n\nWhat specific processes would you like to automate first?",
      
      "🧠 **Business Intelligence Overview**\n\nCurrent market trends and strategic insights:\n\n**Market Intelligence:**\n• 40% of businesses are implementing AI automation\n• Companies with automated processes see 3.5x faster growth\n• Strategic automation reduces operational costs by 30-50%\n\n**Recommended Focus Areas:**\n1. Process audit and optimization\n2. Quick wins implementation (30-day timeline)\n3. Strategic automation roadmap\n4. Performance tracking and optimization\n\nWhat's your biggest operational challenge right now?"
    ]

    // Return a random demo response
    const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]

    return NextResponse.json({ 
      message: randomResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Unable to process request' },
      { status: 500 }
    )
  }
}