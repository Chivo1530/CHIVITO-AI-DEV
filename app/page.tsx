'use client'

import { useState } from 'react'
import { Bot, DollarSign, Zap, Users, TrendingUp, Settings } from 'lucide-react'

export default function Home() {
  const [agents] = useState([
    { id: 1, name: 'Lead Gen Agent', status: 'Active', revenue: '$1,247', leads: 23 },
    { id: 2, name: 'Customer Support', status: 'Active', revenue: '$892', tickets: 47 },
    { id: 3, name: 'Content Creator', status: 'Paused', revenue: '$0', posts: 0 },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-chivito-dark via-chivito-gray to-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 chivito-gradient rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CHIVITO AI</h1>
                <p className="text-sm text-gray-400">Agent Homebase</p>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="agent-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">$2,139</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="agent-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Agents</p>
                <p className="text-2xl font-bold text-chivito-orange">2</p>
              </div>
              <Zap className="w-8 h-8 text-chivito-orange" />
            </div>
          </div>
          
          <div className="agent-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Leads</p>
                <p className="text-2xl font-bold text-blue-400">70</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="agent-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Growth</p>
                <p className="text-2xl font-bold text-purple-400">+24%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Agents List */}
        <div className="agent-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your AI Agents</h2>
            <button className="chivito-gradient px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              + Add Agent
            </button>
          </div>
          
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-gray-400">
                      {agent.status === 'Active' ? 
                        `${agent.leads || agent.tickets || agent.posts} ${agent.leads ? 'leads' : agent.tickets ? 'tickets' : 'posts'} today` : 
                        'Currently paused'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-green-400">{agent.revenue}</p>
                    <p className="text-sm text-gray-400">Revenue</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    agent.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {agent.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 agent-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 transition-colors">
              <Zap className="w-6 h-6 text-blue-400 mb-2" />
              <p className="font-medium">Create Lead Gen Agent</p>
              <p className="text-sm text-gray-400">Generate leads automatically</p>
            </button>
            
            <button className="p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg border border-green-500/30 transition-colors">
              <Users className="w-6 h-6 text-green-400 mb-2" />
              <p className="font-medium">Setup Support Bot</p>
              <p className="text-sm text-gray-400">Handle customer inquiries</p>
            </button>
            
            <button className="p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors">
              <TrendingUp className="w-6 h-6 text-purple-400 mb-2" />
              <p className="font-medium">Analytics Dashboard</p>
              <p className="text-sm text-gray-400">View detailed metrics</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
