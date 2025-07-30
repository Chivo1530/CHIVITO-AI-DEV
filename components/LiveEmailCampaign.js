'use client';

import { useState, useEffect } from 'react';

export default function LiveEmailCampaign() {
  const [campaigns, setCampaigns] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ totalCampaigns: 0, totalContacts: 0, monthlyLimit: 2000, emailsUsed: 0 });
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [campaignResults, setCampaignResults] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Demo contact data for instant campaigns
  const DEMO_CONTACTS = [
    { email: 'ceo@techstartup.com', name: 'Sarah Johnson', company: 'TechStartup Inc' },
    { email: 'founder@growthcorp.com', name: 'Mike Chen', company: 'GrowthCorp' },
    { email: 'director@innovate.co', name: 'Alex Rodriguez', company: 'Innovate Co' },
    { email: 'owner@localservice.com', name: 'Jessica Smith', company: 'Local Service' },
    { email: 'manager@retailplus.com', name: 'David Wilson', company: 'RetailPlus' }
  ];

  useEffect(() => {
    loadCampaignData();
  }, []);

  const loadCampaignData = async () => {
    try {
      const response = await fetch('/api/email-automation');
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.campaigns);
        setContacts(data.contacts);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      // Fallback to demo data for preview environment
      setCampaigns([
        {
          id: 'demo-1',
          name: 'Fortune 500 Outreach',
          status: 'ready',
          contacts: 25,
          subject: 'Transform Your Business with AI Automation',
          preview: 'Hi {{name}}, Your business could be generating $100K+ more monthly revenue...'
        },
        {
          id: 'demo-2', 
          name: 'CEO Follow-up Sequence',
          status: 'ready',
          contacts: 15,
          subject: 'Your AI Empire Awaits - Quick Question',
          preview: 'Hey {{name}}, I noticed {{company}} is scaling fast. Want to see how we automated...'
        }
      ]);
      setContacts(DEMO_CONTACTS);
      setStats({ 
        totalCampaigns: 2, 
        totalContacts: 25, 
        monthlyLimit: 2000, 
        emailsUsed: 347 
      });
    }
  };

  const addDemoContacts = async () => {
    for (const contact of DEMO_CONTACTS) {
      try {
        await fetch('/api/email-automation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add_contact', data: contact })
        });
      } catch (error) {
        console.error('Error adding contact:', error);
      }
    }
    loadCampaignData();
  };

  const createDemoCampaign = async () => {
    const campaignData = {
      name: `Lead Generation Blast - ${new Date().toLocaleTimeString()}`,
      subject: '🚀 Automate Your Business Operations - CHIVITO AI Demo',
      content: `Hi {{name}},

I'm Ponch, 18 years old and founder of CHIVITO AI. Just got laid off from 3 jobs, but this is all I have right now - and I have a plan.

Built Tahoe Essentials (my clothing brand) and dealt with inventory nightmares, supply chain chaos, marketing struggles. That's why CHIVITO exists.

It automates moves most people still do by hand:
• Lead generation (like this email)
• Customer support  
• Sales follow-up
• Content creation
• Revenue tracking

Think of it as your Swiss Army knife for business operations.

You trying to replace manual work or scale something specific?

Let's talk. I can show you exactly how this works for {{company}}.

- Ponch
Founder, CHIVITO AI

P.S. This email was sent automatically by CHIVITO AI during a live demo. Pretty cool, right?`,
      contact_ids: contacts.map(c => c.id)
    };

    try {
      const response = await fetch('/api/email-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_campaign', data: campaignData })
      });
      
      const result = await response.json();
      if (result.success) {
        loadCampaignData();
        setSelectedCampaign(result.campaign);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const launchCampaign = async (campaignId) => {
    setIsLaunching(true);
    setCampaignResults(null);
    
    try {
      const response = await fetch('/api/email-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'launch_campaign', data: { campaign_id: campaignId } })
      });
      
      const result = await response.json();
      if (result.success) {
        setCampaignResults(result);
        loadCampaignData();
      }
    } catch (error) {
      console.error('Error launching campaign:', error);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🚀 Live Email Campaign Demo</h1>
        <p className="text-gray-600">Watch CHIVITO AI send emails in real-time - Perfect for closing prospects!</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="premium-card text-center">
          <div className="text-2xl font-bold text-royal-600">{stats.totalCampaigns}</div>
          <div className="text-sm text-gray-600">Total Campaigns</div>
        </div>
        <div className="premium-card text-center">
          <div className="text-2xl font-bold text-royal-600">{stats.totalContacts}</div>
          <div className="text-sm text-gray-600">Total Contacts</div>
        </div>
        <div className="premium-card text-center">
          <div className="text-2xl font-bold text-royal-600">{stats.emailsUsed}</div>
          <div className="text-sm text-gray-600">Emails Sent</div>
        </div>
        <div className="premium-card text-center">
          <div className="text-2xl font-bold text-royal-600">{stats.monthlyLimit - stats.emailsUsed}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
      </div>

      {/* Quick Demo Setup */}
      <div className="premium-card">
        <h2 className="text-xl font-bold mb-4">⚡ Quick Demo Setup</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={addDemoContacts}
            className="premium-button"
            disabled={contacts.length > 0}
          >
            {contacts.length > 0 ? '✅ Demo Contacts Added' : '📋 Add Demo Contacts'}
          </button>
          <button 
            onClick={createDemoCampaign}
            className="premium-button"
            disabled={contacts.length === 0}
          >
            📧 Create Demo Campaign
          </button>
        </div>
      </div>

      {/* Campaign Results */}
      {campaignResults && (
        <div className="premium-card bg-green-50 border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Campaign Results</h3>
          <div className="space-y-2">
            <p><strong>Campaign:</strong> {campaignResults.campaign.name}</p>
            <p><strong>Emails Sent:</strong> {campaignResults.campaign.sent_count}</p>
            <p><strong>Status:</strong> {campaignResults.campaign.status}</p>
            <p className="text-sm text-green-700">{campaignResults.message}</p>
            <p className="text-sm font-semibold text-royal-600">{campaignResults.ponchInsight}</p>
          </div>
        </div>
      )}

      {/* Campaign Launch Section */}
      {selectedCampaign && (
        <div className="premium-card">
          <h2 className="text-xl font-bold mb-4">🚀 Launch Campaign</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">{selectedCampaign.name}</h3>
              <p className="text-sm text-gray-600">Subject: {selectedCampaign.subject}</p>
              <p className="text-sm text-gray-600">Recipients: {selectedCampaign.contact_ids.length} contacts</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => launchCampaign(selectedCampaign.id)}
                disabled={isLaunching}
                className="royal-button"
              >
                {isLaunching ? '🚀 Launching...' : '🚀 Launch Campaign Now'}
              </button>
              <button 
                onClick={() => setSelectedCampaign(null)}
                className="premium-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="premium-card">
        <h2 className="text-xl font-bold mb-4">📧 Email Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No campaigns yet. Create your first demo campaign above!</p>
        ) : (
          <div className="space-y-4">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">{campaign.subject}</p>
                    <p className="text-xs text-gray-500">Created: {new Date(campaign.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'sending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {campaign.sent_count} sent
                    </div>
                  </div>
                </div>
                {campaign.status === 'draft' && (
                  <button 
                    onClick={() => setSelectedCampaign(campaign)}
                    className="mt-3 premium-button text-sm"
                  >
                    Select Campaign
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contacts List */}
      <div className="premium-card">
        <h2 className="text-xl font-bold mb-4">👥 Contact List</h2>
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No contacts yet. Add demo contacts above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map(contact => (
              <div key={contact.id} className="border rounded-lg p-3">
                <div className="font-semibold">{contact.name}</div>
                <div className="text-sm text-gray-600">{contact.email}</div>
                <div className="text-xs text-gray-500">{contact.company}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}