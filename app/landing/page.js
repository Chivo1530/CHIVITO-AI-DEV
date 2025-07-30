import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Crown from '../../components/Crown'
import { TrendingUp, Bot, Users, Zap, CheckCircle, ArrowRight, Sparkles, Target, Clock, Play, MessageCircle } from 'lucide-react'

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
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CHIVITO AI</h1>
                <div className="text-sm text-gray-600">Premium Business Automation</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/signin" className="premium-button">
                Sign In
              </a>
              <a href="/signup" className="royal-button">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <Crown className="w-16 h-16 mr-4" />
            <div className="text-6xl font-bold brand-title">CHIVITO AI</div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The AI Platform That
            <br />
            <span className="text-royal-500">EXECUTES</span> Your Business
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop getting advice. Start getting results. CHIVITO AI is the only platform that doesn't just recommend - it executes your entire business operation with AI agents that work 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <a href="/signup" className="royal-button text-lg px-8 py-4">
              <Sparkles className="mr-2" size={20} />
              Start Free Trial
            </a>
            <a href="#demo" className="premium-button text-lg px-8 py-4">
              <Play className="mr-2" size={20} />
              Watch Demo
            </a>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              7-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Why Fortune 500 Companies Choose CHIVITO AI
          </h3>
          <p className="text-xl text-gray-600">
            Real AI execution, not just recommendations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="premium-card p-8 text-center">
            <div className="w-16 h-16 bg-royal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="text-white" size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">AI Agents That Execute</h4>
            <p className="text-gray-600 mb-6">
              Deploy specialized AI agents that don't just advise - they execute your entire sales, marketing, and operations pipeline.
            </p>
            <div className="text-sm text-gray-500">
              Lead Hunter • Sales Closer • Content Creator • Support Agent
            </div>
          </div>
          
          <div className="premium-card p-8 text-center">
            <div className="w-16 h-16 bg-royal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="text-white" size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Real Revenue Results</h4>
            <p className="text-gray-600 mb-6">
              Track actual revenue generated by AI agents. See ROI in real-time with complete attribution and performance analytics.
            </p>
            <div className="text-sm text-gray-500">
              $50K+ average monthly revenue increase
            </div>
          </div>
          
          <div className="premium-card p-8 text-center">
            <div className="w-16 h-16 bg-royal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="text-white" size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">24/7 Automation</h4>
            <p className="text-gray-600 mb-6">
              Your AI agents work around the clock, generating leads, closing deals, and optimizing operations while you sleep.
            </p>
            <div className="text-sm text-gray-500">
              Save 40+ hours per week on average
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your AI Empire Plan
          </h3>
          <p className="text-xl text-gray-600">
            Start free, scale as you grow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Trial */}
          <div className="premium-card p-8">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Free Trial</h4>
              <div className="text-4xl font-bold text-gray-600 mb-4">$0</div>
              <p className="text-gray-600 mb-6">Perfect for testing the waters</p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>1 AI Agent</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>50 Leads/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Basic workflows</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Community support</span>
                </li>
              </ul>
              
              <a href="/signup" className="premium-button w-full">
                Start Free Trial
              </a>
            </div>
          </div>

          {/* Professional */}
          <div className="premium-card p-8 border-2 border-royal-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-royal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                MOST POPULAR
              </span>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Professional</h4>
              <div className="text-4xl font-bold text-royal-600 mb-4">$297<span className="text-lg text-gray-500">/mo</span></div>
              <p className="text-gray-600 mb-6">For growing businesses</p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>3 AI Agents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>1,000 Leads/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Advanced workflows</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Revenue analytics</span>
                </li>
              </ul>
              
              <a href="/signup" className="royal-button w-full">
                Upgrade to Pro
              </a>
            </div>
          </div>

          {/* Enterprise */}
          <div className="premium-card p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-300">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h4>
              <div className="text-4xl font-bold text-yellow-600 mb-4">$697<span className="text-lg text-gray-500">/mo</span></div>
              <p className="text-gray-600 mb-6">For scaling enterprises</p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Unlimited AI Agents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Unlimited Leads</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Voice AI included</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Dedicated success manager</span>
                </li>
              </ul>
              
              <a href="/signup" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg w-full block text-center">
                Go Enterprise
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white/80 backdrop-blur-xl py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Trusted by Industry Leaders
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="premium-card p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">Sarah Chen, CEO</div>
              <div className="text-sm text-gray-600 mb-4">TechCorp Solutions</div>
              <p className="text-gray-700">
                "CHIVITO AI increased our lead generation by 400% and closed $2M in new business in the first quarter. This isn't just software - it's a business transformation."
              </p>
            </div>
            
            <div className="premium-card p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">Michael Rodriguez, Founder</div>
              <div className="text-sm text-gray-600 mb-4">Growth Ventures</div>
              <p className="text-gray-700">
                "The AI agents work 24/7 while I sleep. I wake up to qualified leads, scheduled demos, and closed deals. It's like having a world-class team that never stops working."
              </p>
            </div>
            
            <div className="premium-card p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">Emma Thompson, CTO</div>
              <div className="text-sm text-gray-600 mb-4">ScaleUp Technologies</div>
              <p className="text-gray-700">
                "The ROI is incredible. We've saved 60 hours per week on manual tasks and generated $500K in additional revenue. CHIVITO AI pays for itself in the first week."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="premium-card p-12">
          <Crown className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Build Your AI Empire?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses already using CHIVITO AI to automate and scale their operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/signup" className="royal-button text-lg px-8 py-4">
              <Sparkles className="mr-2" size={20} />
              Start Free Trial
            </a>
            <a href="#contact" className="premium-button text-lg px-8 py-4">
              <MessageCircle className="mr-2" size={20} />
              Talk to Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Crown className="w-8 h-8" />
                <span className="text-xl font-bold">CHIVITO AI</span>
              </div>
              <p className="text-gray-400">
                The premium AI platform that executes your business operations with intelligent automation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">AI Agents</a></li>
                <li><a href="#" className="hover:text-white">Automation</a></li>
                <li><a href="#" className="hover:text-white">Analytics</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CHIVITO AI. All rights reserved. Built for the future of business automation.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}