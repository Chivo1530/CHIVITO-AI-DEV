'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Bot, Zap, TrendingUp, Target, Crown } from 'lucide-react';
import { ponchPersonality, generatePonchResponse, getContextualResponse } from '../lib/ponch-ai-personality';
import BusinessContextEngine from '../lib/business-context-engine';

export default function PonchAIAssistant({ userProfile, businessData }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [businessContext] = useState(new BusinessContextEngine());

  // Initialize with P$'s personal greeting
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'assistant',
      content: `💰 YO! I'm P$, your 18-year-old business mentor! 

Just got fired from 3 jobs but honestly? BEST thing that happened to me. Now I'm 100% focused on building empires.

I scaled Tahoe Essentials from zero and learned every painful lesson about inventory, marketing, and operations. That's why I built CHIVITO - to automate all the stuff that kept me up at night.

What's your biggest business challenge right now? Let's turn it into profit! 🚀`,
      timestamp: new Date().toISOString(),
      ponchInsight: "Personal intro with real business experience"
    };
    setMessages([welcomeMessage]);
  }, []);

  // Generate contextual business insights
  const generateBusinessInsights = () => {
    if (!businessData) return [];

    const analysis = businessContext.analyzeBusinessType(businessData);
    const recommendations = businessContext.generateSmartRecommendations(businessData);
    const roi = businessContext.calculateROI(businessData);

    return {
      analysis,
      recommendations,
      roi
    };
  };

  // Handle user message with Ponch's personality
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

    // Generate Ponch-style response
    setTimeout(() => {
      const ponchResponse = generatePonchResponseWithContext(inputMessage, businessData);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: ponchResponse.content,
        ponchInsight: ponchResponse.insight,
        businessAdvice: ponchResponse.businessAdvice,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Generate contextual Ponch response
  const generatePonchResponseWithContext = (message, context) => {
    const lowerMessage = message.toLowerCase();
    
    // Inventory-related questions
    if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
      return {
        content: `Man, inventory management nearly killed my clothing brand Tahoe Essentials! 😤

The manual tracking, reorder confusion, stockouts - it's a nightmare. I was spending 15+ hours a week just managing inventory instead of growing the business.

That's exactly why I built CHIVITO's inventory automation. Let me show you how to automate:
• Stock level alerts
• Automatic reorder points  
• Supplier communication
• Inventory forecasting

This would have saved me countless headaches. Let's get your inventory running automatically so you can focus on growth! 🚀`,
        insight: "Personal experience with Tahoe Essentials inventory challenges",
        businessAdvice: "Automate inventory management to save 15+ hours/week"
      };
    }

    // Marketing questions
    if (lowerMessage.includes('marketing') || lowerMessage.includes('customers')) {
      return {
        content: `Marketing without automation is like trying to fill a bucket with holes! 🪣

I learned this the hard way with Tahoe Essentials. You're constantly creating content, managing campaigns, following up with leads - but nothing scales.

Here's what I wish I had back then:
• Automated lead nurturing sequences
• Social media posting schedules
• Customer follow-up campaigns
• Performance tracking dashboards

With CHIVITO, your marketing works 24/7 while you sleep. No more missed opportunities or manual follow-ups that kill momentum.

What's your biggest marketing challenge right now? Let's automate it! 💪`,
        insight: "Marketing automation lessons from clothing brand experience",
        businessAdvice: "Scale marketing with 24/7 automation systems"
      };
    }

    // Pricing questions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return {
        content: `Look, I'm confident but humble - we'll talk about prices after we see how good the results are. 💯

I'm not here to sell you on features. I'm here to solve real problems with actual results.

Here's my approach:
1. First, let's identify your biggest pain points
2. Then, we'll show you exactly how CHIVITO solves them
3. Finally, we'll price based on the value you're getting

I learned this from my clothing brand - demonstrate value first, then charge premium. Your success is literally my business model.

What results are you looking for? Let's start there! 🎯`,
        insight: "Results-first pricing philosophy",
        businessAdvice: "Value demonstration before pricing discussion"
      };
    }

    // General business questions with varied responses
    const businessTopics = [
      {
        keywords: ['help', 'start', 'beginning', 'new'],
        response: `Listen, I started with $200 and a dream. Here's the game plan:

1. Pick ONE problem you can solve better than anyone
2. Find 10 people who'll pay you to solve it
3. Automate the boring stuff (that's where CHIVITO comes in)
4. Scale without losing your mind

What industry are you in? Let's build your automation strategy! 💪`,
        insight: "Practical startup advice from real experience"
      },
      {
        keywords: ['money', 'revenue', 'profit', 'income'],
        response: `Real talk - money follows value, not the other way around.

I learned this scaling Tahoe Essentials. You can't just throw money at problems. You need systems that work while you sleep.

Current revenue breakdown I see working:
• Month 1-3: Nail your core process
• Month 4-6: Automate everything possible  
• Month 7-12: Scale what's working

What's your current monthly revenue? Let's 2x it! 🚀`,
        insight: "Revenue scaling methodology from clothing brand"
      },
      {
        keywords: ['competition', 'competitors', 'market'],
        response: `Competition? I LOVE competition! It validates your market.

When I launched Tahoe Essentials, everyone said "clothing is saturated." But I found my angle - premium outdoor gear for young entrepreneurs.

Your competitive advantage isn't your product. It's your EXECUTION speed.

While they're debating, you're shipping. While they're planning, you're automating.

What makes you different from your competitors? 🎯`,
        insight: "Competitive positioning from real market experience"
      }
    ];

    // Find matching response or use default
    const matchedTopic = businessTopics.find(topic => 
      topic.keywords.some(keyword => lowerMessage.includes(keyword))
    );

    if (matchedTopic) {
      return {
        content: matchedTopic.response,
        insight: matchedTopic.insight,
        businessAdvice: "Tactical business guidance from real experience"
      };
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-royal-red to-red-600 rounded-full flex items-center justify-center">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">P$ AI Assistant</h3>
          <p className="text-gray-600 text-sm">Your 24/7 Business Mentor</p>
        </div>
        <div className="ml-auto">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Business Insights Panel */}
      {businessData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-royal-red mb-2">
            🎯 P$'s Business Insights
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">20+</div>
              <div className="text-xs text-gray-600">Hours/Week Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+25%</div>
              <div className="text-xs text-gray-600">Revenue Increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-xs text-gray-600">AI Execution</div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-royal-red text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-royal-red" />
                  <span className="text-xs font-semibold text-royal-red">P$</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {message.ponchInsight && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                  💡 {message.ponchInsight}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-royal-red" />
                <span className="text-xs font-semibold text-royal-red">P$</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-royal-red rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-royal-red rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-royal-red rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask P$ anything about your business..."
          className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-royal-red focus:ring-1 focus:ring-royal-red"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="bg-royal-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Zap size={16} />
          Send
        </button>
      </div>
    </div>
  );
}