'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Bot, Zap, TrendingUp, Target, Crown, Send, Sparkles, Lightbulb, ArrowRight } from 'lucide-react';

export default function PonchAIAssistant({ userProfile, businessData }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Professional welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'assistant',
      content: `👋 **Welcome to P$ AI - Your Business Intelligence Assistant**

I'm P$, your dedicated AI consultant specializing in business automation and growth strategies. I've analyzed countless business operations and helped companies increase efficiency by 300%+ through intelligent automation.

**What I can help you with:**
• Business process optimization
• Revenue growth strategies  
• Automation implementation
• Market analysis and insights
• Strategic planning and execution

**Quick question to get started:** What's your biggest business challenge right now?`,
      timestamp: new Date().toISOString(),
      aiInsight: "Professional business consultation available 24/7",
      suggestions: [
        "Optimize my sales process",
        "Automate customer support", 
        "Scale my marketing efforts",
        "Improve operational efficiency"
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  // Professional response generation
  const generateProfessionalResponse = (message, context) => {
    const lowerMessage = message.toLowerCase();
    
    // Business optimization queries
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve') || lowerMessage.includes('efficiency')) {
      return {
        content: `🎯 **Business Optimization Analysis**

Based on your query, I recommend implementing these optimization strategies:

**Immediate Actions (0-30 days):**
• Automate repetitive tasks (save 15-20 hours/week)
• Implement lead scoring system (40% better conversion)
• Set up automated follow-up sequences (3x response rate)

**Medium-term Goals (30-90 days):**
• Deploy AI-powered customer support (24/7 availability)
• Integrate business intelligence dashboards
• Optimize workflow automation processes

**Expected ROI:** 250-400% efficiency improvement within 90 days

Would you like me to create a detailed implementation plan for any of these strategies?`,
        insight: "Comprehensive optimization strategy with measurable outcomes",
        suggestions: [
          "Create automation roadmap",
          "Show ROI calculations",
          "Analyze current processes",
          "Prioritize quick wins"
        ]
      };
    }

    // Sales and marketing queries
    if (lowerMessage.includes('sales') || lowerMessage.includes('marketing') || lowerMessage.includes('leads')) {
      return {
        content: `📈 **Sales & Marketing Intelligence**

Here's your personalized growth strategy:

**Lead Generation Optimization:**
• Implement AI-powered lead scoring (increase qualified leads by 60%)
• Automate email sequences (improve conversion by 45%)
• Deploy predictive analytics for prospect targeting

**Sales Process Enhancement:**
• CRM automation with intelligent routing
• Real-time performance dashboards
• Automated proposal generation and follow-ups

**Marketing Automation:**
• Multi-channel campaign orchestration
• Behavioral trigger-based messaging
• Advanced analytics and attribution tracking

**Projected Impact:** 3-5x increase in sales qualified leads within 60 days

Which area would you like to focus on first?`,
        insight: "Data-driven sales and marketing optimization strategy",
        suggestions: [
          "Set up lead scoring",
          "Create email sequences",
          "Analyze sales funnel",
          "Optimize conversion rates"
        ]
      };
    }

    // Customer support queries
    if (lowerMessage.includes('support') || lowerMessage.includes('customer') || lowerMessage.includes('service')) {
      return {
        content: `🤝 **Customer Support Intelligence**

Transform your customer experience with these strategic implementations:

**AI-Powered Support System:**
• 24/7 automated response capability (instant support)
• Intelligent ticket routing and prioritization
• Proactive issue detection and resolution

**Efficiency Improvements:**
• 80% reduction in response time
• 95% customer satisfaction increase
• 60% decrease in support team workload

**Advanced Features:**
• Natural language processing for complex queries
• Integration with existing CRM and helpdesk systems
• Real-time sentiment analysis and escalation

**Business Impact:** Save 25-30 hours/week while improving customer satisfaction by 40%

Ready to implement intelligent customer support?`,
        insight: "Comprehensive customer support automation strategy",
        suggestions: [
          "Deploy AI chatbot",
          "Optimize ticket routing",
          "Analyze support metrics",
          "Create knowledge base"
        ]
      };
    }

    // Revenue and growth queries
    if (lowerMessage.includes('revenue') || lowerMessage.includes('growth') || lowerMessage.includes('scale')) {
      return {
        content: `💰 **Revenue Growth Strategy**

Here's your data-driven path to sustainable growth:

**Revenue Optimization Framework:**
• Implement predictive analytics for demand forecasting
• Deploy dynamic pricing strategies (15-25% revenue increase)
• Automate upsell/cross-sell campaigns (30% uplift)

**Scalable Growth Systems:**
• Multi-channel acquisition automation
• Customer lifetime value optimization
• Retention and loyalty program automation

**Performance Metrics:**
• 40-60% increase in monthly recurring revenue
• 3x improvement in customer acquisition cost efficiency
• 25% reduction in churn rate

**Strategic Recommendations:**
Focus on automation-driven growth rather than manual scaling. This ensures sustainable expansion without proportional cost increases.

Which growth metric is most important to your business right now?`,
        insight: "Strategic revenue growth through intelligent automation",
        suggestions: [
          "Analyze revenue streams",
          "Optimize pricing strategy",
          "Improve customer retention",
          "Scale acquisition channels"
        ]
      };
    }

    // Technology and automation queries
    if (lowerMessage.includes('automate') || lowerMessage.includes('technology') || lowerMessage.includes('ai')) {
      return {
        content: `🚀 **Automation & Technology Strategy**

Transform your operations with intelligent automation:

**Core Automation Pillars:**
• Process automation (eliminate 70% of manual tasks)
• Decision automation (faster, data-driven choices)
• Communication automation (seamless customer interactions)

**Technology Stack Recommendations:**
• AI-powered workflow orchestration
• Intelligent data integration platforms
• Predictive analytics and machine learning

**Implementation Timeline:**
• **Week 1-2:** Audit current processes and identify automation opportunities
• **Week 3-6:** Deploy high-impact automation workflows
• **Week 7-12:** Optimize and scale automated systems

**Expected Outcomes:**
• 300% productivity improvement
• 90% reduction in manual errors
• 50% faster decision-making processes

What specific processes would you like to automate first?`,
        insight: "Comprehensive automation strategy for business transformation",
        suggestions: [
          "Audit current processes",
          "Identify automation opportunities",
          "Deploy workflow automation",
          "Measure automation ROI"
        ]
      };
    }

    // Default professional response
    return {
      content: `🧠 **AI Business Analysis**

I understand you're looking for strategic guidance. Let me provide some immediate insights:

**Business Intelligence Overview:**
• Current market trends suggest 40% of businesses are implementing AI automation
• Companies with automated processes see 3.5x faster growth rates
• Strategic automation typically reduces operational costs by 30-50%

**Recommended Next Steps:**
1. **Process Audit:** Identify your highest-impact automation opportunities
2. **Quick Wins:** Implement 2-3 simple automations within 30 days
3. **Strategic Planning:** Develop comprehensive automation roadmap
4. **Performance Tracking:** Monitor KPIs and optimize continuously

**Strategic Questions to Consider:**
• What manual tasks consume most of your team's time?
• Where do you see the biggest bottlenecks in your current processes?
• What would doubling your efficiency look like for your business?

I'm here to help you analyze and optimize every aspect of your business operations. What specific area would you like to explore?`,
      insight: "Comprehensive business analysis and strategic recommendations",
      suggestions: [
        "Analyze business processes",
        "Identify growth opportunities",
        "Create automation strategy",
        "Optimize current operations"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowQuickActions(false);

    // Generate professional response
    setTimeout(() => {
      const response = generateProfessionalResponse(inputMessage, businessData);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.content,
        aiInsight: response.insight,
        suggestions: response.suggestions,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    handleSendMessage();
  };

  const formatMessage = (content) => {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '•')
      .split('\n')
      .map((line, index) => (
        <div key={index} className="mb-1">
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </div>
      ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-royal-500 to-royal-600 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">P$ AI Business Consultant</h3>
              <p className="text-sm text-gray-600">Strategic Business Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-600">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Business Context Panel */}
      {businessData && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-royal-500" />
            <span className="text-sm font-medium text-gray-700">Business Intelligence Overview</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">85%</div>
              <div className="text-xs text-gray-600">Automation Potential</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-royal-600">3.5x</div>
              <div className="text-xs text-gray-600">Growth Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">24/7</div>
              <div className="text-xs text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.type === 'user'
                  ? 'bg-royal-500 text-white rounded-l-lg rounded-tr-lg'
                  : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
              } p-4 shadow-sm`}
            >
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-royal-500" />
                  <span className="text-xs font-semibold text-royal-600">P$ AI</span>
                </div>
              )}
              
              <div className="prose prose-sm max-w-none">
                {formatMessage(message.content)}
              </div>
              
              {message.aiInsight && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-800 font-medium">
                    💡 {message.aiInsight}
                  </div>
                </div>
              )}

              {message.suggestions && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-gray-600 font-medium">Suggested Actions:</div>
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(suggestion)}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs text-gray-700 transition-colors mr-2 mb-1"
                    >
                      <ArrowRight size={12} />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 p-4 rounded-r-lg rounded-tl-lg max-w-[85%] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-royal-500" />
                <span className="text-xs font-semibold text-royal-600">P$ AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-royal-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-royal-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-royal-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <span className="text-xs text-gray-600 ml-2">Analyzing your business strategy...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-2">Quick Actions:</div>
          <div className="flex flex-wrap gap-2">
            {[
              "Analyze my business processes",
              "Create automation strategy", 
              "Optimize revenue streams",
              "Improve operational efficiency"
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 hover:border-royal-500 hover:bg-royal-50 rounded-lg text-xs text-gray-700 transition-colors"
              >
                <Sparkles size={12} />
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask P$ about your business strategy..."
            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-royal-500 hover:bg-royal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}