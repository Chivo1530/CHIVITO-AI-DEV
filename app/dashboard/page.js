'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Crown from '../../components/Crown'
import PonchAIAssistant from '../../components/PonchAIAssistant'
import LiveEmailCampaign from '../../components/LiveEmailCampaign'
import WorkflowHub from '../../components/WorkflowHub'
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
  Mail,
  DollarSign,
  Bell
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
  const [notification, setNotification] = useState(null)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Show success notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    setIsClient(true)
    
    // Load real user data from Supabase
    loadUserData()
    
    initializeData()
    
    setCurrentTime(new Date())
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // For preview environment, immediately set loading to false
    if (process.env.NODE_ENV === 'development') {
      setLoading(false)
    }

    return () => {
      clearInterval(timeInterval)
    }
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
        showNotification('Dashboard loaded successfully! Welcome back! 🎉', 'success')
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
        name: 'Revenue Maximizer Pro',
        icon: '💰',
        status: 'active',
        currentTask: 'Optimizing pricing strategy for Q4 pipeline',
        progress: 92,
        lastAction: '30s ago',
        nextRun: 'In 2 min',
        tasksCompleted: 1589,
        successRate: 97,
        revenue: 156800,
        tier: 'premium'
      },
      {
        id: 2,
        name: 'Lead Generation Engine',
        icon: '🎯',
        status: 'active',
        currentTask: 'Qualifying Fortune 500 decision makers',
        progress: 78,
        lastAction: '1 min ago',
        nextRun: 'In 4 min',
        tasksCompleted: 2234,
        successRate: 94,
        revenue: 234500,
        tier: 'premium'
      },
      {
        id: 3,
        name: 'Customer Success AI',
        icon: '🤝',
        status: 'active',
        currentTask: 'Proactive churn prevention outreach',
        progress: 85,
        lastAction: '45s ago',
        nextRun: 'In 8 min',
        tasksCompleted: 1876,
        successRate: 96,
        revenue: 87400,
        tier: 'premium'
      }
    ]

    const premiumLeads = [
      {
        id: 1,
        name: 'Alexandra Martinez',
        email: 'alexandra.martinez@techgiant.com',
        company: 'TechGiant Solutions',
        position: 'VP of Digital Transformation',
        status: 'hot',
        score: 97,
        source: 'LinkedIn Sales Navigator',
        lastTouch: '23 min ago',
        nextAction: 'C-Level demo presentation',
        value: 287000,
        stage: 'Final Negotiation'
      },
      {
        id: 2,
        name: 'Robert Chen',
        email: 'robert.chen@innovatecorp.com',
        company: 'InnovateCorp Industries',
        position: 'Chief Technology Officer',
        status: 'hot',
        score: 94,
        source: 'Industry Conference',
        lastTouch: '1 hour ago',
        nextAction: 'Technical architecture review',
        value: 445000,
        stage: 'Solution Design'
      },
      {
        id: 3,
        name: 'Jennifer Walsh',
        email: 'jennifer.walsh@globalenterprise.com',
        company: 'Global Enterprise Group',
        position: 'Director of Operations',
        status: 'warm',
        score: 89,
        source: 'Partner Referral',
        lastTouch: '2 hours ago',
        nextAction: 'ROI analysis presentation',
        value: 156000,
        stage: 'Business Case'
      },
      {
        id: 4,
        name: 'David Kim',
        email: 'david.kim@scaletech.io',
        company: 'ScaleTech Ventures',
        position: 'CEO & Founder',
        status: 'warm',
        score: 91,
        source: 'Webinar Attendee',
        lastTouch: '4 hours ago',
        nextAction: 'Strategic partnership discussion',
        value: 678000,
        stage: 'Discovery'
      }
    ]

    const premiumMetrics = {
      totalRevenue: 1247800,
      monthlyGrowth: 67.4,
      activeAgents: 3,
      totalLeads: 127,
      conversionRate: 42.8,
      avgDealSize: 234600,
      tasksToday: 1247,
      automationHours: 156.7,
      pipelineValue: 5247000,
      mrr: 387600,
      customerSatisfaction: 96.5,
      responseTime: 2.3,
      upsellRate: 34.2,
      churnRate: 2.1
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
      showNotification('Successfully signed out. See you soon! 👋', 'info')
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    showNotification(`Switched to ${tabId} section`, 'info')
  }

  const handleAgentOptimize = (agent) => {
    showNotification(`Optimizing ${agent.name}... This will improve performance by 15-20%! 🚀`, 'success')
  }

  const handleLeadGenerate = () => {
    showNotification('Generating high-quality leads... AI is scanning 50,000+ prospects! 🎯', 'success')
  }

  if (loading) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Crown className="w-16 h-16 mx-auto mb-4 animate-pulse text-royal-500" />
          <div className="text-xl font-semibold text-gray-800 mb-2">Loading your AI empire...</div>
          <div className="text-sm text-gray-600">Preparing your premium dashboard experience</div>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-royal-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-royal-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-royal-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen luxury-gradient">
      {/* Success Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border-l-4 animate-slide-in ${
          notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
          'bg-blue-50 border-blue-500 text-blue-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
            {notification.type === 'info' && <Bell className="w-5 h-5 mr-2" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-10 h-10 text-royal-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CHIVITO AI</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Premium Business Intelligence</span>
                  {profile && getPlanBadge(profile.subscription_plan)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">SYSTEM ONLINE</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">hello@chivito.ai</span>
              </div>
              <div className="text-sm text-gray-600 font-mono">
                {isClient && currentTime ? currentTime.toLocaleTimeString() : '...'}
              </div>
              <div className="flex items-center space-x-2">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.email}&background=DC143C&color=fff&size=32`}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'agents', label: 'AI Agents', icon: Bot },
              { id: 'leads', label: 'Lead Empire', icon: Users },
              { id: 'workflows', label: 'Automation', icon: Zap },
              { id: 'workflow-hub', label: 'Workflow Hub', icon: Sparkles },
              { id: 'email-campaigns', label: 'Email Automation', icon: Mail },
              { id: 'assistant', label: 'AI Consultant', icon: MessageCircle },
              { id: 'analytics', label: 'Intelligence', icon: TrendingUp },
              { id: 'billing', label: 'Billing', icon: CreditCard }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-royal-500 text-royal-600 bg-royal-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.email?.split('@')[0] || 'Executive'}! 👋</h2>
                  <p className="text-gray-600">Your AI empire is generating exceptional results across all metrics</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Monthly Recurring Revenue</div>
                  <div className="text-3xl font-bold text-royal-600">${metrics.mrr?.toLocaleString()}</div>
                  <div className="text-sm text-green-600 flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    +{metrics.monthlyGrowth}% growth
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Total Revenue</div>
                    <DollarSign className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">${metrics.totalRevenue?.toLocaleString()}</div>
                  <div className="text-sm text-green-600">+{metrics.monthlyGrowth}% growth</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Active Agents</div>
                    <Bot className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">{metrics.activeAgents}</div>
                  <div className="text-sm text-royal-600">AI-powered workforce</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Pipeline Value</div>
                    <Target className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">${(metrics.pipelineValue / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-royal-600">{metrics.totalLeads} qualified leads</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Automation Hours</div>
                    <Clock className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">{metrics.automationHours}h</div>
                  <div className="text-sm text-royal-600">Time saved monthly</div>
                </div>
              </div>
            </div>

            {/* AI Agents Section */}
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">🤖 Premium AI Agents</h2>
                <button 
                  onClick={handleLeadGenerate}
                  className="royal-button hover-glow"
                >
                  <Sparkles size={16} className="mr-2" />
                  Deploy New Agent
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agents.map(agent => (
                  <div key={agent.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-royal-200 transition-all hover-lift">
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
                        <button 
                          onClick={() => handleAgentOptimize(agent)}
                          className="royal-button flex-1 text-sm hover-glow"
                        >
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
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">💼 High-Value Lead Pipeline</h2>
                <button 
                  onClick={handleLeadGenerate}
                  className="royal-button hover-glow"
                >
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
                      <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                                className="bg-royal-500 h-2 rounded-full transition-all"
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
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🧠 P$ Business Intelligence Assistant</h2>
                  <p className="text-gray-600">Your 24/7 strategic business consultant and automation expert</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">ONLINE</span>
                </div>
              </div>
              
              <PonchAIAssistant 
                userProfile={profile}
                businessData={{
                  type: 'premium',
                  monthlyRevenue: metrics.totalRevenue || 0,
                  activeAgents: metrics.activeAgents || 0,
                  totalLeads: metrics.totalLeads || 0,
                  automationHours: metrics.automationHours || 0
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">🤖 Premium AI Agents</h2>
                <button 
                  onClick={handleLeadGenerate}
                  className="royal-button hover-glow"
                >
                  <Sparkles size={16} className="mr-2" />
                  Deploy New Agent
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agents.map(agent => (
                  <div key={agent.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-royal-200 transition-all hover-lift">
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
                        <button 
                          onClick={() => handleAgentOptimize(agent)}
                          className="royal-button flex-1 text-sm hover-glow"
                        >
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
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">💼 High-Value Lead Pipeline</h2>
                <button 
                  onClick={handleLeadGenerate}
                  className="royal-button hover-glow"
                >
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
                      <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                            <div className="text-lg font-bold text-gray-900">{lead.score}</div>
                            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-royal-600 rounded-full transition-all"
                                style={{ width: `${lead.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-gray-900">{lead.stage}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-lg font-bold text-green-600">${lead.value.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-gray-900">{lead.nextAction}</div>
                          <div className="text-xs text-gray-500">{lead.lastTouch}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ Business Process Automation</h2>
              <p className="text-gray-600 mb-8">Transform your operations with intelligent automation workflows</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover-lift">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">💎 Lead Scoring Automation</h3>
                  <p className="text-sm text-blue-700 mb-4">AI-powered lead qualification with 94% accuracy</p>
                  <div className="text-sm font-medium text-blue-800 mb-4">Expected Results: +60% conversion rate</div>
                  <button className="royal-button w-full hover-glow">Configure Workflow</button>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover-lift">
                  <h3 className="text-lg font-bold text-green-900 mb-2">📧 Email Sequence Automation</h3>
                  <p className="text-sm text-green-700 mb-4">Personalized nurture campaigns with behavioral triggers</p>
                  <div className="text-sm font-medium text-green-800 mb-4">Expected Results: 3x engagement rate</div>
                  <button className="royal-button w-full hover-glow">Configure Workflow</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Business Intelligence Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover-lift">
                  <h3 className="text-lg font-bold text-purple-900 mb-4">💰 Revenue Analytics</h3>
                  <div className="text-4xl font-bold text-purple-600 mb-2">${metrics.totalRevenue?.toLocaleString()}</div>
                  <div className="text-sm text-purple-600 mb-4">+{metrics.monthlyGrowth}% growth this month</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MRR</span>
                      <span className="text-sm font-medium">${metrics.mrr?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pipeline</span>
                      <span className="text-sm font-medium">${(metrics.pipelineValue / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 hover-lift">
                  <h3 className="text-lg font-bold text-orange-900 mb-4">📈 Conversion Analytics</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">{metrics.conversionRate}%</div>
                  <div className="text-sm text-orange-600 mb-4">Lead to customer conversion</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Deal Size</span>
                      <span className="text-sm font-medium">${metrics.avgDealSize?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sales Cycle</span>
                      <span className="text-sm font-medium">28 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Premium Subscription Plans</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover-lift">
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

                <div className="bg-white rounded-xl p-6 border-2 border-royal-500 relative hover-lift">
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
                      <li>• API access</li>
                    </ul>
                    <button className="royal-button w-full hover-glow">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-300 hover-lift">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Enterprise</h3>
                    <div className="text-3xl font-bold text-yellow-600 mb-4">$697<span className="text-sm text-gray-500">/mo</span></div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li>• Unlimited AI Agents</li>
                      <li>• Unlimited Leads</li>
                      <li>• Voice AI included</li>
                      <li>• White-label options</li>
                      <li>• Dedicated success manager</li>
                    </ul>
                    <button className="gold-gradient text-black font-semibold py-2 px-4 rounded-lg w-full hover-glow">
                      Go Enterprise
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workflow-hub' && (
          <div className="space-y-8 animate-fade-in">
            <WorkflowHub />
          </div>
        )}

        {activeTab === 'email-campaigns' && (
          <div className="space-y-8 animate-fade-in">
            <LiveEmailCampaign />
          </div>
        )}
      </main>
    </div>
  )
}
