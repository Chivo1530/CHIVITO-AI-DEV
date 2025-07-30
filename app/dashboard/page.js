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
  Bell,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Globe,
  Shield,
  Cpu,
  Briefcase,
  Phone,
  Award,
  Star,
  Gem,
  Layers,
  Database,
  Cloud,
  Lock,
  Key,
  Folder,
  FileText,
  Image,
  Code,
  Terminal
} from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [agents, setAgents] = useState([])
  const [leads, setLeads] = useState([])
  const [workflows, setWorkflows] = useState([])
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
    
    // For demo purposes, set a demo user immediately
    const demoUser = {
      email: 'executive@fortune500.com',
      id: 'demo-user-id'
    }
    setUser(demoUser)
    
    // Try to load real user data, but don't block on it
    loadUserData()
    
    // Load real data from APIs
    loadAgentsData()
    loadWorkflowsData()
    initializeData()
    
    setCurrentTime(new Date())
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Always set loading to false for demo
    setLoading(false)

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
      // Continue with demo mode
    }
  }

  const initializeData = () => {
    // AIGENTZ (renamed from AI Agents) - Premium sample data
    const premiumAgents = [
      {
        id: 1,
        name: 'Revenue Maximizer Pro',
        icon: '💰',
        status: 'active',
        currentTask: 'Optimizing pricing strategy for enterprise clients',
        progress: 94,
        lastAction: '12s ago',
        nextRun: 'In 1 min',
        tasksCompleted: 2847,
        successRate: 98,
        revenue: 287600,
        tier: 'premium',
        description: 'AI-powered revenue optimization engine that analyzes market trends, competitor pricing, and customer behavior to maximize profitability.',
        capabilities: ['Dynamic Pricing', 'Market Analysis', 'Revenue Forecasting', 'Profit Optimization']
      },
      {
        id: 2,
        name: 'Lead Generation Titan',
        icon: '🎯',
        status: 'active',
        currentTask: 'Scanning Fortune 1000 decision makers',
        progress: 89,
        lastAction: '24s ago',
        nextRun: 'In 2 min',
        tasksCompleted: 3542,
        successRate: 96,
        revenue: 456700,
        tier: 'premium',
        description: 'Advanced lead generation system that identifies, qualifies, and nurtures high-value prospects automatically.',
        capabilities: ['Prospect Research', 'Lead Scoring', 'Contact Discovery', 'Outreach Automation']
      },
      {
        id: 3,
        name: 'Customer Success Guardian',
        icon: '🛡️',
        status: 'active',
        currentTask: 'Monitoring client health scores & preventing churn',
        progress: 91,
        lastAction: '8s ago',
        nextRun: 'In 4 min',
        tasksCompleted: 1987,
        successRate: 99,
        revenue: 198400,
        tier: 'premium',
        description: 'Proactive customer success management that predicts churn, identifies upsell opportunities, and maintains client satisfaction.',
        capabilities: ['Churn Prediction', 'Health Scoring', 'Upsell Detection', 'Support Automation']
      },
      {
        id: 4,
        name: 'Content Creation Engine',
        icon: '✍️',
        status: 'active',
        currentTask: 'Generating personalized email sequences',
        progress: 76,
        lastAction: '1 min ago',
        nextRun: 'In 8 min',
        tasksCompleted: 4521,
        successRate: 94,
        revenue: 125300,
        tier: 'premium',
        description: 'AI content generator that creates personalized marketing materials, emails, and proposals at scale.',
        capabilities: ['Content Generation', 'Personalization', 'A/B Testing', 'Performance Tracking']
      }
    ]

    // Enhanced Lead Empire data
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
        value: 487000,
        stage: 'Final Negotiation',
        probability: 92,
        lastActivity: 'Viewed pricing proposal',
        tags: ['Enterprise', 'High-Value', 'Decision Maker']
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
        value: 652000,
        stage: 'Solution Design',
        probability: 87,
        lastActivity: 'Downloaded case study',
        tags: ['Tech Leader', 'Enterprise', 'Influencer']
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
        value: 234000,
        stage: 'Business Case',
        probability: 78,
        lastActivity: 'Attended webinar',
        tags: ['Operations', 'Efficiency', 'ROI-Focused']
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
        value: 789000,
        stage: 'Discovery',
        probability: 82,
        lastActivity: 'Requested demo',
        tags: ['CEO', 'Startup', 'Growth-Focused']
      },
      {
        id: 5,
        name: 'Sarah Thompson',
        email: 'sarah.thompson@megacorp.com',
        company: 'MegaCorp International',
        position: 'Head of Business Development',
        status: 'cold',
        score: 73,
        source: 'Cold Outreach',
        lastTouch: '1 day ago',
        nextAction: 'Follow-up email sequence',
        value: 145000,
        stage: 'Initial Contact',
        probability: 45,
        lastActivity: 'Opened email',
        tags: ['Business Development', 'Large Corp', 'Prospect']
      }
    ]

    // Enhanced workflows data
    const premiumWorkflows = [
      {
        id: 1,
        name: 'Lead Scoring & Qualification',
        type: 'lead-management',
        status: 'active',
        description: 'AI-powered lead scoring system that automatically qualifies prospects based on behavior, demographics, and engagement.',
        triggers: ['New lead created', 'Email opened', 'Website visit'],
        actions: ['Score calculation', 'Lead routing', 'Follow-up scheduling'],
        results: {
          processed: 1247,
          qualified: 456,
          revenue: 234600
        },
        lastRun: '2 min ago',
        nextRun: 'Continuous',
        efficiency: 94
      },
      {
        id: 2,
        name: 'Email Nurture Sequences',
        type: 'marketing-automation',
        status: 'active',
        description: 'Personalized email sequences that adapt based on recipient behavior and engagement patterns.',
        triggers: ['Lead score threshold', 'Demo request', 'Trial signup'],
        actions: ['Send personalized email', 'Track engagement', 'Adjust sequence'],
        results: {
          sent: 2847,
          opened: 1523,
          clicked: 687
        },
        lastRun: '5 min ago',
        nextRun: 'Every 15 min',
        efficiency: 87
      },
      {
        id: 3,
        name: 'Customer Health Monitoring',
        type: 'customer-success',
        status: 'active',
        description: 'Continuous monitoring of customer health scores with automated interventions for at-risk accounts.',
        triggers: ['Usage decline', 'Support tickets', 'NPS score'],
        actions: ['Health score update', 'Alert creation', 'Outreach trigger'],
        results: {
          monitored: 456,
          alerts: 23,
          saved: 12
        },
        lastRun: '1 min ago',
        nextRun: 'Every 5 min',
        efficiency: 96
      }
    ]

    // Enhanced metrics
    const premiumMetrics = {
      totalRevenue: 2847600,
      monthlyGrowth: 73.4,
      activeAgents: 4,
      totalLeads: 127,
      qualifiedLeads: 89,
      conversionRate: 47.8,
      avgDealSize: 387600,
      tasksToday: 2847,
      automationHours: 234.7,
      pipelineValue: 8247000,
      mrr: 687600,
      customerSatisfaction: 97.8,
      responseTime: 1.2,
      upsellRate: 42.3,
      churnRate: 1.8,
      activeWorkflows: 12,
      completionRate: 94.2,
      timesSaved: 450,
      costReduction: 68
    }

    setAgents(premiumAgents)
    setLeads(premiumLeads)
    setWorkflows(premiumWorkflows)
    setMetrics(premiumMetrics)
  }

  const loadAgentsData = async () => {
    try {
      const response = await fetch('/api/agents')
      const result = await response.json()
      if (result.success) {
        setAgents(result.agents)
        // Merge task history into existing data structure
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          tasksCompleted: result.taskHistory.length,
          activeAgents: result.agents.filter(a => a.status === 'active').length
        }))
      }
    } catch (error) {
      console.error('Error loading agents data:', error)
      // Fall back to demo data
      initializeData()
    }
  }

  const loadWorkflowsData = async () => {
    try {
      const response = await fetch('/api/workflows')
      const result = await response.json()
      if (result.success) {
        setWorkflows(result.activeWorkflows || [])
        // Update workflows from templates if no active ones
        if (result.templates && result.templates.length > 0) {
          const sampleWorkflows = result.templates.slice(0, 3).map(template => ({
            id: template.id,
            name: template.name,
            description: template.description,
            status: 'active',
            progress: Math.floor(Math.random() * 100),
            estimatedTime: template.estimatedTime,
            agents: template.agents || [],
            lastRun: 'Recently',
            nextRun: 'In progress'
          }))
          setWorkflows(sampleWorkflows)
        }
      }
    } catch (error) {
      console.error('Error loading workflows data:', error)
      // Fall back to demo data
      initializeData()
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
      showNotification('Successfully signed out. See you soon! 👋', 'info')
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
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
    showNotification(`🚀 Switched to ${tabId === 'aigentz' ? 'AIGENTZ' : tabId.replace('-', ' ').toUpperCase()} section!`, 'info')
  }

  const handleAgentOptimize = (agent) => {
    showNotification(`🚀 Optimizing ${agent.name}... Performance will improve by 15-20%! Revenue potential: +$${(agent.revenue * 0.2).toLocaleString()}`, 'success')
  }

  const handleAgentDeploy = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deploy_new_agent', agentId: 'new' })
      })
      
      const result = await response.json()
      if (result.success) {
        showNotification('🚀 New AIGENTZ deployment initiated! Your custom AI agent will be ready in 2 minutes.', 'success')
        // Refresh agents data
        loadAgentsData()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Agent deployment error:', error)
      showNotification('Failed to deploy new agent. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLeadGenerate = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: 1, customParams: { targetCount: 50 } })
      })
      
      const result = await response.json()
      if (result.success) {
        showNotification('🎯 Lead generation blast initiated! Scanning 10,000+ prospects across LinkedIn and industry databases.', 'success')
        // Refresh workflows data
        loadWorkflowsData()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Lead generation error:', error)
      showNotification('Failed to start lead generation. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleExportCRM = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/export-crm', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        // Create download link
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `crm-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        showNotification('📊 CRM data exported successfully! Download starting now.', 'success')
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('CRM export error:', error)
      showNotification('Failed to export CRM data. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAutomation = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: 2, customParams: { type: 'custom_automation' } })
      })
      
      const result = await response.json()
      if (result.success) {
        showNotification('⚡ New automation workflow created! Setting up intelligent business processes.', 'success')
        loadWorkflowsData()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Automation creation error:', error)
      showNotification('Failed to create automation. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradePlan = async (planId) => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      })
      
      const result = await response.json()
      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url
      } else {
        throw new Error(result.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Plan upgrade error:', error)
      showNotification('Failed to upgrade plan. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleWorkflowTrigger = (workflow) => {
    showNotification(`⚡ Triggered ${workflow.name}... Automation is now processing!`, 'success')
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
                  <span className="text-sm text-gray-600">Premium Business Intelligence Platform</span>
                  {getPlanBadge('enterprise')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">ALL SYSTEMS ONLINE</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">support@chivito.ai</span>
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
              { id: 'aigentz', label: 'AIGENTZ', icon: Bot },
              { id: 'lead-empire', label: 'Lead Empire', icon: Users },
              { id: 'automations', label: 'Automations', icon: Zap },
              { id: 'intelligence', label: 'Intelligence', icon: TrendingUp },
              { id: 'assistant', label: 'AI Consultant', icon: MessageCircle },
              { id: 'settings', label: 'Settings', icon: Settings },
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Executive! 👋</h2>
                  <p className="text-gray-600">Your AI empire is generating exceptional results across all business metrics</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Monthly Recurring Revenue</div>
                  <div className="text-3xl font-bold text-royal-600">${(metrics.mrr / 1000).toFixed(0)}K</div>
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
                  <div className="metric-value">${(metrics.totalRevenue / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-green-600">+{metrics.monthlyGrowth}% growth</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Active AIGENTZ</div>
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="premium-card p-6 hover-lift">
                <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={handleAgentDeploy}
                    className="royal-button w-full text-left flex items-center space-x-2 hover-glow"
                  >
                    <Plus size={16} />
                    <span>Deploy New AIGENT</span>
                  </button>
                  <button 
                    onClick={handleLeadGenerate}
                    className="royal-button w-full text-left flex items-center space-x-2 hover-glow"
                  >
                    <Target size={16} />
                    <span>Generate Leads</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('automations')}
                    className="premium-button w-full text-left flex items-center space-x-2"
                  >
                    <Zap size={16} />
                    <span>Create Automation</span>
                  </button>
                </div>
              </div>

              <div className="premium-card p-6 hover-lift">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-sm font-bold text-royal-600">{metrics.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <span className="text-sm font-bold text-green-600">{metrics.customerSatisfaction}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-bold text-blue-600">{metrics.responseTime}s</span>
                  </div>
                </div>
              </div>

              <div className="premium-card p-6 hover-lift">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Today's Goals</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">Generate 50 qualified leads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-yellow-500" />
                    <span className="text-sm">Optimize 3 workflows</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target size={16} className="text-royal-500" />
                    <span className="text-sm">Close 2 enterprise deals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'aigentz' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🤖 AIGENTZ - Your AI Workforce</h2>
                  <p className="text-gray-600">Deploy, manage, and optimize your intelligent business automation agents</p>
                </div>
                <button 
                  onClick={handleAgentDeploy}
                  className="royal-button hover-glow"
                >
                  <Plus size={16} className="mr-2" />
                  Deploy New AIGENT
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map(agent => (
                  <div key={agent.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-royal-200 transition-all hover-lift">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl">{agent.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                            <span className="text-sm text-gray-600 capitalize">{agent.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Revenue Generated</div>
                        <div className="text-xl font-bold text-royal-600">${(agent.revenue / 1000).toFixed(0)}K</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Current Task</div>
                        <div className="text-sm font-medium text-gray-900">{agent.currentTask}</div>
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
                          <div className="text-gray-500">Tasks Completed</div>
                          <div className="font-medium text-gray-900">{agent.tasksCompleted.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Success Rate</div>
                          <div className="font-medium text-green-600">{agent.successRate}%</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-2">Capabilities</div>
                        <div className="flex flex-wrap gap-2">
                          {agent.capabilities.map((capability, index) => (
                            <span key={index} className="px-2 py-1 bg-royal-50 text-royal-700 text-xs rounded-full border border-royal-200">
                              {capability}
                            </span>
                          ))}
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
                          Configure
                        </button>
                        <button className="premium-button text-sm px-3">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lead-empire' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">👑 Lead Empire - CRM Intelligence</h2>
                  <p className="text-gray-600">Advanced lead management system with AI-powered insights and automation</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleLeadGenerate}
                    className="royal-button hover-glow"
                  >
                    <Target size={16} className="mr-2" />
                    Generate Leads
                  </button>
                  <button 
                    onClick={handleExportCRM}
                    className="premium-button"
                  >
                    <Download size={16} className="mr-2" />
                    Export CRM
                  </button>
                </div>
              </div>
              
              {/* Lead Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Total Pipeline</div>
                    <Target className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">${(metrics.pipelineValue / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-royal-600">{leads.length} active leads</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Conversion Rate</div>
                    <TrendingUp className="text-green-500" size={20} />
                  </div>
                  <div className="metric-value">{metrics.conversionRate}%</div>
                  <div className="text-sm text-green-600">Above industry avg</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Avg Deal Size</div>
                    <DollarSign className="text-blue-500" size={20} />
                  </div>
                  <div className="metric-value">${(metrics.avgDealSize / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-blue-600">Enterprise focused</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Hot Leads</div>
                    <AlertCircle className="text-red-500" size={20} />
                  </div>
                  <div className="metric-value">{leads.filter(lead => lead.status === 'hot').length}</div>
                  <div className="text-sm text-red-600">High priority</div>
                </div>
              </div>

              {/* Lead Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Contact</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Company</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Score</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Stage</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Value</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${lead.name}&background=DC143C&color=fff&size=40`}
                              alt={lead.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{lead.name}</div>
                              <div className="text-sm text-gray-600">{lead.email}</div>
                              <div className="text-xs text-gray-500">{lead.lastActivity}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-semibold text-gray-900">{lead.company}</div>
                            <div className="text-sm text-gray-600">{lead.position}</div>
                            <div className="text-xs text-gray-500">{lead.source}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLeadStatusColor(lead.status)} text-white uppercase tracking-wide`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg font-bold text-gray-900">{lead.score}</div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-royal-600 rounded-full transition-all"
                                style={{ width: `${lead.score}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{lead.probability}% chance</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">{lead.stage}</div>
                          <div className="text-sm text-gray-600">{lead.nextAction}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-lg font-bold text-green-600">${lead.value.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{lead.lastTouch}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-600 hover:text-royal-600 transition-colors" title="View Details">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600 transition-colors" title="Send Email">
                              <Mail size={16} />
                            </button>
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

        {activeTab === 'automations' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">⚡ Business Process Automation</h2>
                  <p className="text-gray-600">Intelligent workflows that run your business operations automatically</p>
                </div>
                <button 
                  onClick={handleCreateAutomation}
                  className="royal-button hover-glow"
                >
                  <Plus size={16} className="mr-2" />
                  Create Automation
                </button>
              </div>

              {/* Automation Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Active Workflows</div>
                    <Zap className="text-royal-500" size={20} />
                  </div>
                  <div className="metric-value">{workflows.length}</div>
                  <div className="text-sm text-royal-600">Running 24/7</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Time Saved</div>
                    <Clock className="text-green-500" size={20} />
                  </div>
                  <div className="metric-value">{metrics.timesSaved}h</div>
                  <div className="text-sm text-green-600">This month</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Success Rate</div>
                    <CheckCircle className="text-blue-500" size={20} />
                  </div>
                  <div className="metric-value">{metrics.completionRate}%</div>
                  <div className="text-sm text-blue-600">Highly reliable</div>
                </div>
                
                <div className="metric-card hover-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Cost Reduction</div>
                    <TrendingUp className="text-purple-500" size={20} />
                  </div>
                  <div className="metric-value">{metrics.costReduction}%</div>
                  <div className="text-sm text-purple-600">vs manual processes</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map(workflow => (
                  <div key={workflow.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-royal-200 transition-all hover-lift">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{workflow.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)} animate-pulse`}></div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Triggers</div>
                        <div className="flex flex-wrap gap-1">
                          {workflow.triggers.slice(0, 2).map((trigger, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {trigger}
                            </span>
                          ))}
                          {workflow.triggers.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{workflow.triggers.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Efficiency</div>
                          <div className="font-bold text-royal-600">{workflow.efficiency}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Last Run</div>
                          <div className="font-medium text-gray-900">{workflow.lastRun}</div>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Performance</span>
                          <span className="font-semibold text-green-600">
                            {workflow.type === 'lead-management' && `${workflow.results.qualified} qualified`}
                            {workflow.type === 'marketing-automation' && `${workflow.results.clicked} clicked`}
                            {workflow.type === 'customer-success' && `${workflow.results.saved} accounts saved`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => handleWorkflowTrigger(workflow)}
                        className="royal-button flex-1 text-sm hover-glow"
                      >
                        <Play size={14} className="mr-1" />
                        Trigger
                      </button>
                      <button className="premium-button text-sm px-3">
                        <Settings size={14} />
                      </button>
                      <button className="premium-button text-sm px-3">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'intelligence' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🧠 Business Intelligence Center</h2>
                  <p className="text-gray-600">Advanced analytics, insights, and predictive intelligence for strategic decision making</p>
                </div>
                <button className="royal-button hover-glow">
                  <Download size={16} className="mr-2" />
                  Export Report
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover-lift">
                  <h3 className="text-lg font-bold text-purple-900 mb-4">💰 Revenue Intelligence</h3>
                  <div className="text-4xl font-bold text-purple-600 mb-2">${(metrics.totalRevenue / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-purple-600 mb-4">+{metrics.monthlyGrowth}% growth this month</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MRR</span>
                      <span className="text-sm font-medium">${(metrics.mrr / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pipeline</span>
                      <span className="text-sm font-medium">${(metrics.pipelineValue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Upsell Rate</span>
                      <span className="text-sm font-medium text-green-600">{metrics.upsellRate}%</span>
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
                      <span className="text-sm font-medium">${(metrics.avgDealSize / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sales Cycle</span>
                      <span className="text-sm font-medium">28 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Win Rate</span>
                      <span className="text-sm font-medium text-green-600">73%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover-lift">
                  <h3 className="text-lg font-bold text-green-900 mb-4">⚡ Efficiency Analytics</h3>
                  <div className="text-4xl font-bold text-green-600 mb-2">{metrics.automationHours}h</div>
                  <div className="text-sm text-green-600 mb-4">Time saved through automation</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tasks Automated</span>
                      <span className="text-sm font-medium">{metrics.tasksToday.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-sm font-medium text-green-600">{metrics.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cost Reduction</span>
                      <span className="text-sm font-medium text-green-600">{metrics.costReduction}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover-lift">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">🎯 Customer Intelligence</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{metrics.customerSatisfaction}%</div>
                  <div className="text-sm text-blue-600 mb-4">Customer satisfaction score</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Churn Rate</span>
                      <span className="text-sm font-medium text-green-600">{metrics.churnRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="text-sm font-medium">{metrics.responseTime}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">NPS Score</span>
                      <span className="text-sm font-medium text-blue-600">87</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover-lift">
                  <h3 className="text-lg font-bold text-indigo-900 mb-4">🔮 Predictive Insights</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-white rounded-lg border border-indigo-100">
                      <div className="text-sm font-medium text-indigo-900">Next Month Forecast</div>
                      <div className="text-xs text-indigo-600">Revenue: +{(metrics.monthlyGrowth + 5).toFixed(1)}% growth expected</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-100">
                      <div className="text-sm font-medium text-green-900">Opportunity Alert</div>
                      <div className="text-xs text-green-600">3 high-value prospects ready to close</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-amber-100">
                      <div className="text-sm font-medium text-amber-900">Risk Analysis</div>
                      <div className="text-xs text-amber-600">2 accounts at risk - intervention suggested</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 hover-lift">
                  <h3 className="text-lg font-bold text-teal-900 mb-4">📊 Market Intelligence</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Market Position</span>
                      <span className="text-sm font-bold text-teal-600">Top 5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Competitor Analysis</span>
                      <span className="text-sm font-medium text-green-600">Ahead</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Market Trend</span>
                      <span className="text-sm font-medium text-blue-600">Growing</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Industry Score</span>
                      <span className="text-sm font-bold text-teal-600">94/100</span>
                    </div>
                  </div>
                </div>
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

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Settings & Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input type="email" value={user?.email || 'executive@fortune500.com'} className="form-input" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input type="text" value="Fortune 500 Enterprises" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                      <select className="form-input">
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+0 (GMT)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Auto-generate leads</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-royal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royal-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Email notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-royal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royal-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Advanced analytics</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-royal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royal-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <button className="premium-button">Reset to Defaults</button>
                  <button 
                    onClick={() => showNotification('✅ Settings saved successfully!', 'success')}
                    className="royal-button hover-glow"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8 animate-fade-in">
            <div className="premium-card p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Subscription & Billing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover-lift">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Professional</h3>
                    <div className="text-3xl font-bold text-gray-600 mb-4">$297<span className="text-sm text-gray-500">/mo</span></div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li>• 3 AI Agents</li>
                      <li>• 1,000 Leads/month</li>
                      <li>• Basic workflows</li>
                      <li>• Email support</li>
                    </ul>
                    <button className="premium-button w-full">
                      Current Plan
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-royal-500 relative hover-lift">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-royal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      RECOMMENDED
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Enterprise</h3>
                    <div className="text-3xl font-bold text-royal-600 mb-4">$697<span className="text-sm text-gray-500">/mo</span></div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li>• Unlimited AI Agents</li>
                      <li>• Unlimited Leads</li>
                      <li>• Advanced workflows</li>
                      <li>• Priority support</li>
                      <li>• Custom integrations</li>
                    </ul>
                    <button 
                      onClick={() => handleUpgradePlan('enterprise')}
                      className="royal-button w-full hover-glow"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-300 hover-lift">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Custom</h3>
                    <div className="text-3xl font-bold text-yellow-600 mb-4">Contact<span className="text-sm text-gray-500"> us</span></div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li>• White-label solution</li>
                      <li>• Dedicated infrastructure</li>
                      <li>• Custom AI models</li>
                      <li>• 24/7 dedicated support</li>
                      <li>• SLA guarantees</li>
                    </ul>
                    <button className="gold-gradient text-black font-semibold py-2 px-4 rounded-lg w-full hover-glow">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Description</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Amount</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-sm text-gray-900">Jan 15, 2024</td>
                        <td className="p-4 text-sm text-gray-900">Professional Plan - Monthly</td>
                        <td className="p-4 text-sm font-medium text-gray-900">$297.00</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                        </td>
                        <td className="p-4">
                          <button className="text-royal-600 hover:text-royal-700 text-sm">Download</button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-sm text-gray-900">Dec 15, 2023</td>
                        <td className="p-4 text-sm text-gray-900">Professional Plan - Monthly</td>
                        <td className="p-4 text-sm font-medium text-gray-900">$297.00</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                        </td>
                        <td className="p-4">
                          <button className="text-royal-600 hover:text-royal-700 text-sm">Download</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}