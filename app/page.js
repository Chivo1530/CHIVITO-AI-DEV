'use client'
import { useState, useEffect } from 'react'
import { Bot, Activity, TrendingUp, Users, Zap, Clock, Target, AlertCircle } from 'lucide-react'

export default function ChivitoAI() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [agents, setAgents] = useState([])
  const [leads, setLeads] = useState([])
  const [metrics, setMetrics] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Initialize sample data
    initializeSampleData()
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simulate real-time updates every 10 seconds
    const updateInterval = setInterval(() => {
      updateAgentProgress()
    }, 10000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(updateInterval)
    }
  }, [])

  const initializeSampleData = () => {
    const sampleAgents = [
      {
        id: 1,
        name: 'Lead Hunter',
        icon: '🎯',
        status: 'active',
        currentTask: 'Scanning LinkedIn for tech CEOs',
        progress: 73,
        lastAction: '2 min ago',
        nextRun: 'In 8 min',
        tasksCompleted: 847,
        successRate: 94,
        revenue: 18500
      },
      {
        id: 2,
        name: 'Content Creator',
        icon: '✍️',
        status: 'active',
        currentTask: 'Writing email sequence for SaaS leads',
        progress: 45,
        lastAction: '5 min ago',
        nextRun: 'In 15 min',
        tasksCompleted: 312,
        successRate: 87,
        revenue: 12200
      },
      {
        id: 3,
        name: 'Sales Closer',
        icon: '🤝',
        status: 'active',
        currentTask: 'Following up with warm prospects',
        progress: 89,
        lastAction: '1 min ago',
        nextRun: 'In 5 min',
        tasksCompleted: 156,
        successRate: 78,
        revenue: 31000
      },
      {
        id: 4,
        name: 'Customer Support',
        icon: '🎧',
        status: 'idle',
        currentTask: 'Monitoring support tickets',
        progress: 100,
        lastAction: '12 min ago',
        nextRun: 'In 3 min',
        tasksCompleted: 423,
        successRate: 96,
        revenue: 8400
      },
      {
        id: 5,
        name: 'Data Analyst',
        icon: '📊',
        status: 'active',
        currentTask: 'Analyzing conversion patterns',
        progress: 62,
        lastAction: '3 min ago',
        nextRun: 'In 12 min',
        tasksCompleted: 89,
        successRate: 91,
        revenue: 5200
      },
      {
        id: 6,
        name: 'Social Media Manager',
        icon: '📱',
        status: 'active',
        currentTask: 'Scheduling LinkedIn posts',
        progress: 28,
        lastAction: '7 min ago',
        nextRun: 'In 18 min',
        tasksCompleted: 234,
        successRate: 83,
        revenue: 6800
      }
    ]

    const sampleLeads = [
      {
        id: 1,
        name: 'Marcus Chen',
        email: 'marcus@techstartup.com',
        company: 'TechStartup Inc',
        position: 'CEO',
        status: 'hot',
        score: 94,
        source: 'LinkedIn',
        lastTouch: '2 hours ago',
        nextAction: 'Demo call scheduled',
        value: 25000,
        stage: 'Demo'
      },
      {
        id: 2,
        name: 'Sarah Rodriguez',
        email: 'sarah@growthco.io',
        company: 'GrowthCo',
        position: 'VP Marketing',
        status: 'warm',
        score: 78,
        source: 'Cold Email',
        lastTouch: '1 day ago',
        nextAction: 'Send case study',
        value: 18000,
        stage: 'Interest'
      },
      {
        id: 3,
        name: 'David Kim',
        email: 'david@scaleit.com',
        company: 'ScaleIt Solutions',
        position: 'CTO',
        status: 'cold',
        score: 45,
        source: 'Website',
        lastTouch: '3 days ago',
        nextAction: 'Nurture sequence',
        value: 12000,
        stage: 'Awareness'
      }
    ]

    const sampleMetrics = {
      totalRevenue: 82100,
      monthlyGrowth: 34.5,
      activeAgents: 5,
      totalLeads: 23,
      conversionRate: 23.4,
      avgDealSize: 18500,
      tasksToday: 156,
      automationHours: 8.5
    }

    setAgents(sampleAgents)
    setLeads(sampleLeads)
    setMetrics(sampleMetrics)
  }

  const updateAgentProgress = () => {
    setAgents(prev => prev.map(agent => ({
      ...agent,
      progress: agent.status === 'active' ? Math.min(100, agent.progress + Math.floor(Math.random() * 15)) : agent.progress,
      tasksCompleted: agent.status === 'active' ? agent.tasksCompleted + Math.floor(Math.random() * 3) : agent.tasksCompleted
    })))
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold">🤖 CHIVITO AI</div>
              <div className="text-sm text-gray-400">v2.0</div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">SYSTEM ONLINE</span>
              </div>
              <div className="text-sm text-gray-400 font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'agents', label: 'Agent Command', icon: Bot },
              { id: 'leads', label: 'Lead Pipeline', icon: Users },
              { id: 'aigentz', label: 'AIGENTZ', icon: Zap },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">Total Revenue</div>
                  <TrendingUp className="text-green-400" size={20} />
                </div>
                <div className="text-3xl font-bold text-green-400">${metrics.totalRevenue?.toLocaleString()}</div>
                <div className="text-sm text-green-400">+{metrics.monthlyGrowth}% this month</div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">Active Agents</div>
                  <Bot className="text-blue-400" size={20} />
                </div>
                <div className="text-3xl font-bold text-blue-400">{metrics.activeAgents}</div>
                <div className="text-sm text-blue-400">of 6 total agents</div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">Pipeline Value</div>
                  <Target className="text-purple-400" size={20} />
                </div>
                <div className="text-3xl font-bold text-purple-400">${(metrics.totalLeads * metrics.avgDealSize)?.toLocaleString()}</div>
                <div className="text-sm text-purple-400">{metrics.totalLeads} active leads</div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">Automation Hours</div>
                  <Clock className="text-orange-400" size={20} />
                </div>
                <div className="text-3xl font-bold text-orange-400">{metrics.automationHours}h</div>
                <div className="text-sm text-orange-400">saved today</div>
              </div>
            </div>

            {/* Active Agents Overview */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">🤖 Active Agents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.filter(agent => agent.status === 'active').map(agent => (
                  <div key={agent.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{agent.icon}</span>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{agent.currentTask}</div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs text-blue-400">{agent.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${agent.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Last: {agent.lastAction}</span>
                      <span>Next: {agent.nextRun}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">⚡ Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { time: '2 min ago', agent: 'Lead Hunter', action: 'Found 3 new qualified prospects on LinkedIn', type: 'success' },
                  { time: '5 min ago', agent: 'Content Creator', action: 'Generated personalized email for Marcus Chen', type: 'success' },
                  { time: '8 min ago', agent: 'Sales Closer', action: 'Booked demo call with TechStartup Inc', type: 'success' },
                  { time: '12 min ago', agent: 'Customer Support', action: 'Resolved 2 support tickets automatically', type: 'success' },
                  { time: '15 min ago', agent: 'Data Analyst', action: 'Identified high-value customer segment', type: 'info' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.agent} • {activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">🤖 Agent Command Center</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                + Create Agent
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map(agent => (
                <div key={agent.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{agent.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold">{agent.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <span className="text-sm text-gray-400 capitalize">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Revenue</div>
                      <div className="text-lg font-bold text-green-400">${agent.revenue.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Current Task</div>
                      <div className="text-sm">{agent.currentTask}</div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm text-blue-400">{agent.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${agent.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Tasks Completed</div>
                        <div className="font-medium">{agent.tasksCompleted}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Success Rate</div>
                        <div className="font-medium">{agent.successRate}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Last Action</div>
                        <div className="font-medium">{agent.lastAction}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Next Run</div>
                        <div className="font-medium">{agent.nextRun}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm">
                      Configure
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm">
                      View Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">👥 Lead Pipeline</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                + Add Lead
              </button>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4">Contact</th>
                      <th className="text-left p-4">Company</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Score</th>
                      <th className="text-left p-4">Stage</th>
                      <th className="text-left p-4">Value</th>
                      <th className="text-left p-4">Last Touch</th>
                      <th className="text-left p-4">Next Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-gray-400">{lead.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{lead.company}</div>
                            <div className="text-sm text-gray-400">{lead.position}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeadStatusColor(lead.status)} text-white`}>
                            {lead.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{lead.score}</span>
                            <div className="w-16 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${lead.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{lead.stage}</td>
                        <td className="p-4 font-medium text-green-400">${lead.value.toLocaleString()}</td>
                        <td className="p-4 text-sm text-gray-400">{lead.lastTouch}</td>
                        <td className="p-4 text-sm">{lead.nextAction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'aigentz' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">🚀 AIGENTZ Marketplace</h1>
              <p className="text-gray-400">Pre-built AI agents ready to deploy in your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Lead Hunter Pro', icon: '🎯', price: '$299/mo', description: 'Advanced lead generation with Apollo.io integration', features: ['LinkedIn scraping', 'Email validation', 'CRM sync'] },
                { name: 'Content Wizard', icon: '✍️', price: '$199/mo', description: 'AI-powered content creation for all channels', features: ['Blog posts', 'Social media', 'Email campaigns'] },
                { name: 'Sales Closer', icon: '🤝', price: '$399/mo', description: 'Automated sales conversations and follow-ups', features: ['Call scheduling', 'Objection handling', 'Deal closing'] },
                { name: 'Support Hero', icon: '🎧', price: '$149/mo', description: '24/7 customer support automation', features: ['Ticket routing', 'Knowledge base', 'Escalation'] },
                { name: 'Analytics Master', icon: '📊', price: '$249/mo', description: 'Advanced business intelligence and insights', features: ['Custom dashboards', 'Predictive analytics', 'ROI tracking'] },
                { name: 'Social Media Manager', icon: '📱', price: '$179/mo', description: 'Complete social media automation', features: ['Content scheduling', 'Engagement tracking', 'Growth optimization'] }
              ].map((agent, index) => (
                <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{agent.icon}</div>
                    <h3 className="text-xl font-bold">{agent.name}</h3>
                    <div className="text-2xl font-bold text-blue-400 mt-2">{agent.price}</div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{agent.description}</p>
                  <ul className="space-y-2 mb-6">
                    {agent.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                    Deploy Agent
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">📊 Business Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Revenue Trend</h3>
                <div className="h-64 flex items-end justify-center space-x-2">
                  {[45, 52, 48, 61, 55, 67, 73, 82].map((height, index) => (
                    <div key={index} className="bg-blue-500 rounded-t" style={{ height: `${height}%`, width: '20px' }}></div>
                  ))}
                </div>
                <div className="text-center mt-4 text-sm text-gray-400">Last 8 weeks</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Agent Performance</h3>
                <div className="space-y-4">
                  {agents.map(agent => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{agent.icon}</span>
                        <span className="text-sm">{agent.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${agent.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-400">{agent.successRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">${metrics.totalRevenue?.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{metrics.conversionRate}%</div>
                  <div className="text-sm text-gray-400">Conversion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">${metrics.avgDealSize?.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Avg Deal Size</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">{metrics.tasksToday}</div>
                  <div className="text-sm text-gray-400">Tasks Today</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}