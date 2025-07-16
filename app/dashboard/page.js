'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Crown from '../../components/Crown'
import PonchAIAssistant from '../../components/PonchAIAssistant'
import LiveEmailCampaign from '../../components/LiveEmailCampaign'
import { 
  Bot, 
  Activity, 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  Target, 
  AlertCircle, 
  MessageCircle, 
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
  ArrowUpRight,
  Play,
  Pause,
  CheckCircle,
  Mail
} from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [agents, setAgents] = useState([])
  const [leads, setLeads] = useState([])
  const [metrics, setMetrics] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(null)
  const [isClient, setIsClient] = useState(false)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    
    // Load real user data from Supabase
    loadUserData()
    
    initializeData()
    
    setCurrentTime(new Date())
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        // Get user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        setProfile(profile)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeData = () => {
    // Premium sample data for demonstration
    const premiumAgents = [
      {
        id: 1,
        name: 'Lead Hunter Pro',
        icon: '🎯',
        status: 'active',
        currentTask: 'Scanning Apollo.io for Fortune 500 prospects',
        progress: 89,
        lastAction: '2 min ago',
        nextRun: 'In 3 min',
        tasksCompleted: 1247,
        successRate: 96,
        revenue: 45800,
        tier: 'premium'
      },
      {
        id: 2,
        name: 'Sales Closer AI',
        icon: '🤝',
        status: 'active',
        currentTask: 'Negotiating with TechCorp executives',
        progress: 67,
        lastAction: '1 min ago',
        nextRun: 'In 5 min',
        tasksCompleted: 567,
        successRate: 89,
        revenue: 87600,
        tier: 'premium'
      },
      {
        id: 3,
        name: 'Content Genius',
        icon: '✍️',
        status: 'active',
        currentTask: 'Creating personalized outreach sequences',
        progress: 45,
        lastAction: '4 min ago',
        nextRun: 'In 12 min',
        tasksCompleted: 892,
        successRate: 92,
        revenue: 23400,
        tier: 'premium'
      }
    ]

    const premiumLeads = [
      {
        id: 1,
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        company: 'TechCorp Solutions',
        position: 'VP of Operations',
        status: 'hot',
        score: 98,
        source: 'Apollo.io',
        lastTouch: '1 hour ago',
        nextAction: 'Executive demo scheduled',
        value: 85000,
        stage: 'Negotiation'
      },
      {
        id: 2,
        name: 'Michael Rodriguez',
        email: 'michael@growthventures.com',
        company: 'Growth Ventures',
        position: 'CEO',
        status: 'warm',
        score: 87,
        source: 'LinkedIn',
        lastTouch: '3 hours ago',
        nextAction: 'Send ROI case study',
        value: 125000,
        stage: 'Interest'
      },
      {
        id: 3,
        name: 'Emma Thompson',
        email: 'emma.thompson@scaleup.io',
        company: 'ScaleUp Technologies',
        position: 'CTO',
        status: 'warm',
        score: 79,
        source: 'Referral',
        lastTouch: '6 hours ago',
        nextAction: 'Technical deep-dive',
        value: 67000,
        stage: 'Discovery'
      }
    ]

    const premiumMetrics = {
      totalRevenue: 247800,
      monthlyGrowth: 47.2,
      activeAgents: 3,
      totalLeads: 47,
      conversionRate: 34.8,
      avgDealSize: 87600,
      tasksToday: 287,
      automationHours: 23.4,
      pipelineValue: 1247000,
      mrr: 82600
    }

    setAgents(premiumAgents)
    setLeads(premiumLeads)
    setMetrics(premiumMetrics)
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
      // Clear any demo data and redirect
      localStorage.removeItem('demoUser')
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback: clear storage and redirect anyway
      localStorage.removeItem('demoUser')
      router.push('/')
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getLeadStatusColor = (status) => {
    switch(status) {
      case 'hot': return 'bg-red-500'
      case 'warm': return 'bg-yellow-500'
      case 'cold': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlanBadge = (plan) => {
    switch(plan) {
      case 'professional':
        return <span className="px-2 py-1 bg-royal-500 text-white text-xs rounded-full">PRO</span>
      case 'enterprise':
        return <span className="px-2 py-1 bg-gold-500 text-black text-xs rounded-full">ENTERPRISE</span>
      default:
        return <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full">TRIAL</span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <div className="text-xl font-semibold text-gray-800">Loading your AI empire...</div>
        </div>
      </div>
    )
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
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Premium SaaS Platform</span>
                  {profile && getPlanBadge(profile.subscription_plan)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm status-online">SYSTEM ONLINE</span>
              </div>
              <div className="text-sm text-gray-600 font-mono">
                {isClient && currentTime ? currentTime.toLocaleTimeString() : '...'}
              </div>
              <div className="flex items-center space-x-2">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.email}&background=DC143C&color=fff`}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'agents', label: 'AI Agents', icon: Bot },
              { id: 'leads', label: 'Lead Empire', icon: Users },
              { id: 'workflows', label: 'Automation', icon: Zap },
              { id: 'email-campaigns', label: 'Email Automation', icon: Mail },
              { id: 'assistant', label: 'AI Consultant', icon: MessageCircle },
              { id: 'analytics', label: 'Intelligence', icon: TrendingUp },
              { id: 'billing', label: 'Billing', icon: CreditCard }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-royal-500 text-royal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="premium-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.email?.split('@')[0]}</h2>
                  <p className="text-gray-600">Your AI empire is generating incredible results</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Monthly Recurring Revenue</div>
                  <div className="text-3xl font-bold text-royal-600">${metrics.mrr?.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Total Revenue</div>
                    <TrendingUp className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">${metrics.totalRevenue?.toLocaleString()}</div>
                  <div className="text-sm text-green-600">+{metrics.monthlyGrowth}% growth</div>
                </div>
                
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Active Agents</div>
                    <Bot className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">{metrics.activeAgents}</div>
                  <div className="text-sm text-royal-600">Premium AI agents</div>
                </div>
                
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Pipeline Value</div>
                    <Target className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">${(metrics.pipelineValue / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-royal-600">{metrics.totalLeads} active leads</div>
                </div>
                
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Time Saved</div>
                    <Clock className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">{metrics.automationHours}h</div>
                  <div className="text-sm text-royal-600">This month</div>
                </div>
              </div>
            </div>

            {/* AI Agents Section */}
            <div className="premium-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">🤖 Premium AI Agents</h2>
                <button className="royal-button">
                  <Sparkles size={16} className="mr-2" />
                  Deploy New Agent
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agents.map(agent => (
                  <div key={agent.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-royal-200 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{agent.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-900">{agent.name}</h3>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                            <span className="text-sm text-gray-600 capitalize">{agent.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Revenue</div>
                        <div className="text-lg font-bold text-royal-600">${agent.revenue.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Current Task</div>
                        <div className="text-sm font-medium">{agent.currentTask}</div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">Progress</span>
                          <span className="text-sm font-medium text-royal-600">{agent.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${agent.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Tasks</div>
                          <div className="font-medium">{agent.tasksCompleted}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Success</div>
                          <div className="font-medium">{agent.successRate}%</div>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <button className="royal-button flex-1 text-sm">
                          <Play size={14} className="mr-1" />
                          Optimize
                        </button>
                        <button className="premium-button flex-1 text-sm">
                          <Settings size={14} className="mr-1" />
                          Config
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Pipeline Section */}
            <div className="premium-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">💼 High-Value Lead Pipeline</h2>
                <button className="royal-button">
                  <Target size={16} className="mr-2" />
                  Generate Leads
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Contact</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Company</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Score</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Stage</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Value</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Next Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-600">{lead.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{lead.company}</div>
                            <div className="text-sm text-gray-600">{lead.position}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeadStatusColor(lead.status)} text-white`}>
                            {lead.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{lead.score}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-royal-500 h-2 rounded-full"
                                style={{ width: `${lead.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-gray-900">{lead.stage}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-royal-600">${lead.value.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">{lead.nextAction}</span>
                            <ArrowUpRight size={14} className="text-gray-400" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assistant' && (
          <div className="space-y-8 animate-fade-in">
            {/* Ponch AI Assistant */}
            <div className="premium-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🧠 Ponch AI Assistant</h2>
                  <p className="text-gray-600">Your 24/7 personal business mentor and AI consultant</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">ONLINE</span>
                </div>
              </div>
              
              <PonchAIAssistant 
                userProfile={profile}
                businessData={{
                  type: 'general',
                  monthlyRevenue: metrics.totalRevenue || 0,
                  activeAgents: metrics.activeAgents || 0,
                  totalLeads: metrics.totalLeads || 0
                }}
              />
            </div>

            {/* Business Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="premium-card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Ponch's Business Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Time Saved This Month</div>
                      <div className="text-sm text-gray-600">Through AI automation</div>
                    </div>
                    <div className="text-2xl font-bold text-royal-600">{metrics.automationHours || 0}h</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Revenue Potential</div>
                      <div className="text-sm text-gray-600">From optimizations</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">+${((metrics.totalRevenue || 0) * 0.25).toLocaleString()}</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Pipeline Health</div>
                      <div className="text-sm text-gray-600">Lead conversion rate</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">28%</div>
                  </div>
                </div>
              </div>

              <div className="premium-card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Smart Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-royal-50 border border-royal-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-5 h-5 text-royal-600" />
                      <span className="font-medium text-royal-900">Inventory Automation</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      I learned the hard way with Tahoe Essentials - automate your inventory management to save 10+ hours/week.
                    </p>
                    <div className="text-xs text-royal-600 font-medium">ROI: $2,000/month saved</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Lead Nurturing</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Automate your follow-up sequences to convert 40% more leads into customers.
                    </p>
                    <div className="text-xs text-green-600 font-medium">ROI: +$5,000/month revenue</div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">24/7 Customer Support</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Never miss a customer inquiry again. AI responds instantly, humans handle complex cases.
                    </p>
                    <div className="text-xs text-blue-600 font-medium">ROI: 95% faster response time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Subscription Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Trial Card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Free Trial</h3>
                    <div className="text-3xl font-bold text-gray-600 mb-4">$0</div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li>• 1 AI Agent</li>
                      <li>• 50 Leads/month</li>
                      <li>• Basic workflows</li>
                      <li>• Community support</li>
                    </ul>
                    <button className="premium-button w-full" disabled>
                      Current Plan
                    </button>
                  </div>
                </div>

                {/* Professional Card */}
                <div className="bg-white rounded-xl p-6 border-2 border-royal-500 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-royal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      POPULAR
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Professional</h3>
                    <div className="text-3xl font-bold text-royal-600 mb-4">$297<span className="text-sm text-gray-500">/mo</span></div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li>• 3 AI Agents</li>
                      <li>• 1,000 Leads/month</li>
                      <li>• Advanced workflows</li>
                      <li>• Priority support</li>
                    </ul>
                    <button className="royal-button w-full">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>

                {/* Enterprise Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-300">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Enterprise</h3>
                    <div className="text-3xl font-bold text-yellow-600 mb-4">$697<span className="text-sm text-gray-500">/mo</span></div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li>• Unlimited AI Agents</li>
                      <li>• Unlimited Leads</li>
                      <li>• Voice AI included</li>
                      <li>• Dedicated success manager</li>
                    </ul>
                    <button className="gold-gradient text-black font-semibold py-2 px-4 rounded-lg w-full">
                      Go Enterprise
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}