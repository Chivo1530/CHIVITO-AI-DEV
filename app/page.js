## 2. Create `app/page.js`
```javascript
'use client'
import { useState } from 'react'

export default function Home() {
  const [leads, setLeads] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'website'
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      setLeads(prev => [result, ...prev])
      setFormData({ name: '', email: '', message: '' })
      alert('🚀 Lead captured! AI agent processing...')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="p-6 border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            🤖 CHIVITO AI
          </h1>
          <div className="text-green-400 font-mono">
            SYSTEM ONLINE 🟢
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">
              🚀 AI Agent Lead Capture
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-purple-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-purple-900/30 border border-purple-500/50 rounded-lg text-white placeholder-purple-300"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-purple-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 bg-purple-900/30 border border-purple-500/50 rounded-lg text-white placeholder-purple-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-purple-300 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full p-3 bg-purple-900/30 border border-purple-500/50 rounded-lg text-white placeholder-purple-300 h-32"
                  placeholder="Tell us about your AI agent needs..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                🤖 ACTIVATE AI AGENT
              </button>
            </form>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">
              📊 Live Leads Dashboard
            </h2>
            
            <div className="space-y-4">
              {leads.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-purple-300">
                    No leads yet. AI agents standing by...
                  </p>
                </div>
              ) : (
                leads.map((lead, index) => (
                  <div key={index} className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-bold">{lead.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        lead.priority === 'HIGH' ? 'bg-red-500 text-white' :
                        lead.priority === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                        'bg-green-500 text-white'
                      }`}>
                        {lead.priority}
                      </span>
                    </div>
                    <p className="text-purple-300 text-sm mb-2">{lead.email}</p>
                    <p className="text-gray-300 text-sm mb-2">{lead.message}</p>
                    <div className="flex justify-between items-center text-xs text-purple-400">
                      <span>Score: {lead.score}/100</span>
                      <span>{new Date(lead.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-green-400">{leads.length}</div>
            <div className="text-purple-300">Total Leads</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-red-400">
              {leads.filter(l => l.priority === 'HIGH').length}
            </div>
            <div className="text-purple-300">High Priority</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {leads.filter(l => l.priority === 'MEDIUM').length}
            </div>
            <div className="text-purple-300">Medium Priority</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-blue-400">100%</div>
            <div className="text-purple-300">AI Powered</div>
          </div>
        </div>
      </div>
    </div>
  )
}
```
