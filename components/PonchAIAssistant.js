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

  // Initialize with Ponch's personal greeting
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'assistant',
      content: `🧠 YO! I'm Ponch, 18 years old and the founder of CHIVITO AI! 

I just got laid off from 3 jobs, but honestly? This is EXACTLY what I needed. I'm building from zero with pure hunger and determination.

I've been through it all with Tahoe Essentials - my clothing brand where I dealt with inventory nightmares, supply chain chaos, and marketing challenges that kept me up at night. That experience taught me that most businesses are drowning in manual work.

That's why CHIVITO isn't just another automation tool - it's your Swiss Army knife for business domination. I'm here to give you REAL advice from someone who's been in the trenches.

What's your biggest business challenge right now? Let's turn it into your competitive advantage! 🚀💰`,
      timestamp: new Date().toISOString(),
      ponchInsight: "Personal introduction with real Tahoe Essentials experience"
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

    // General business questions
    return {
      content: `I get it - running a business is tough. I'm 18 and just got laid off from 3 jobs, but this is all I have right now. 🔥

Here's what I've learned building Tahoe Essentials and now CHIVITO:
• Systems beat people for repetitive tasks
• Automation gives you time for what matters
• Real results trump fancy features
• 24/7 execution beats 9-5 thinking

CHIVITO isn't just another tool - it's your Swiss Army knife for online business. We don't just automate, we execute your entire operation.

What's your biggest time-waster right now? Let's eliminate it! ⚡`,
      insight: "General business philosophy and approach",
      businessAdvice: "Focus on execution over features"
    };
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-royal-red to-red-600 rounded-full flex items-center justify-center">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Ponch AI Assistant</h3>
          <p className="text-gray-400 text-sm">Your 24/7 Business Mentor</p>
        </div>
        <div className="ml-auto">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Business Insights Panel */}
      {businessData && (
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="text-sm font-semibold text-royal-red mb-2">
            🎯 Ponch's Business Insights
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">20+</div>
              <div className="text-xs text-gray-400">Hours/Week Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">+25%</div>
              <div className="text-xs text-gray-400">Revenue Increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-xs text-gray-400">AI Execution</div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-royal-red text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-royal-red" />
                  <span className="text-xs font-semibold text-royal-red">Ponch</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {message.ponchInsight && (
                <div className="mt-2 p-2 bg-gray-700/50 rounded text-xs text-gray-300">
                  💡 {message.ponchInsight}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-royal-red" />
                <span className="text-xs font-semibold text-royal-red">Ponch</span>
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
          placeholder="Ask Ponch anything about your business..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-royal-red"
        />
        <button
          onClick={handleSendMessage}
          className="bg-royal-red hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Zap className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );
}