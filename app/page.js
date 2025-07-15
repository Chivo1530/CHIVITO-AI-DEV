import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Crown from '../components/Crown'
import { TrendingUp, Bot, Users, Zap, CheckCircle, ArrowRight, Sparkles, Target, Clock } from 'lucide-react'

export default async function LandingPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen luxury-gradient">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CHIVITO AI</h1>
                <span className="text-sm text-gray-600">Premium Business Automation</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="/signin" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </a>
              <a href="/signup" className="bg-royal-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Crown className="w-12 h-12 text-royal-red" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              CHIVITO <span className="text-royal-red">AI</span>
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            The AI Platform That
            <br />
            <span className="text-royal-red">EXECUTES</span> Your Business
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop getting advice. Start getting results. CHIVITO AI is the only platform that doesn't 
            just recommend - it executes your entire business operation with AI agents that work 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/signup" className="bg-royal-red hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Free Trial
            </a>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              7-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Fortune 500 Companies Choose CHIVITO AI
          </h2>
          <p className="text-xl text-gray-600">
            Real AI execution, not just recommendations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="premium-card p-8 text-center">
            <div className="w-16 h-16 bg-royal-red rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI Agent Workforce</h3>
            <p className="text-gray-600 mb-6">
              Deploy specialized AI agents that work 24/7 on lead generation, content creation, 
              customer support, and sales closing.
            </p>
            <div className="text-royal-red font-semibold">5-8 Premium AI Agents</div>
          </div>
          
          <div className="premium-card p-8 text-center">
            <div className="w-16 h-16 bg-royal-red rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Intelligence</h3>
            <p className="text-gray-600 mb-6">
              Real-time analytics, lead scoring, revenue tracking, and performance insights 
              that help you make data-driven decisions.
            </p>
            <div className="text-royal-red font-semibold">Real-time Analytics</div>
          </div>
          
          <div className="premium-card p-8 text-center">
            <div className="w-16 h-16 bg-royal-red rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Automation</h3>
            <p className="text-gray-600 mb-6">
              One-click workflows, automated lead nurturing, instant customer responses, 
              and seamless integrations with your existing tools.
            </p>
            <div className="text-royal-red font-semibold">1-Click Execution</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-royal-red to-red-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your AI Business Empire?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of entrepreneurs who've automated their way to success with CHIVITO AI.
          </p>
          <a href="/signup" className="bg-white text-royal-red hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8 text-royal-red" />
              <div>
                <div className="text-lg font-bold text-gray-900">CHIVITO AI</div>
                <div className="text-sm text-gray-600">Premium Business Automation</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 CHIVO ENTERPRISE LLC. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}