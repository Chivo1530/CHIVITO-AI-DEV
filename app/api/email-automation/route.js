// Email Sneek API Integration for CHIVITO AI
// Live Email Campaign Automation for Demo Closing

import { NextResponse } from 'next/server'

// Mock email database (in production, use MongoDB)
let emailCampaigns = []
let emailContacts = []

// Email Sneek API Configuration
const EMAIL_SNEEK_API_KEY = process.env.EMAIL_SNEEK_API_KEY
const EMAIL_SNEEK_BASE_URL = 'https://api.emailsneak.com/v1'

export async function GET() {
  return NextResponse.json({
    success: true,
    campaigns: emailCampaigns,
    contacts: emailContacts,
    stats: {
      totalCampaigns: emailCampaigns.length,
      totalContacts: emailContacts.length,
      monthlyLimit: 2000,
      emailsUsed: emailCampaigns.reduce((sum, campaign) => sum + campaign.sent_count, 0)
    }
  })
}

export async function POST(request) {
  try {
    const { action, data } = await request.json()
    
    switch (action) {
      case 'add_contact':
        return await addContact(data)
      
      case 'launch_campaign':
        return await launchCampaign(data)
      
      case 'create_campaign':
        return await createCampaign(data)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Email Sneek API error:', error)
    return NextResponse.json(
      { success: false, error: 'Email automation failed' },
      { status: 500 }
    )
  }
}

async function addContact(contactData) {
  const newContact = {
    id: emailContacts.length + 1,
    email: contactData.email,
    name: contactData.name || 'Unknown',
    company: contactData.company || '',
    created_at: new Date().toISOString(),
    status: 'active'
  }
  
  emailContacts.push(newContact)
  
  return NextResponse.json({
    success: true,
    contact: newContact,
    message: `✅ Contact ${newContact.name} added successfully`
  })
}

async function createCampaign(campaignData) {
  const newCampaign = {
    id: emailCampaigns.length + 1,
    name: campaignData.name,
    subject: campaignData.subject,
    content: campaignData.content,
    contact_ids: campaignData.contact_ids || [],
    status: 'draft',
    sent_count: 0,
    opened_count: 0,
    created_at: new Date().toISOString(),
    errors: []
  }
  
  emailCampaigns.push(newCampaign)
  
  return NextResponse.json({
    success: true,
    campaign: newCampaign,
    message: `📧 Campaign "${newCampaign.name}" created successfully`
  })
}

async function launchCampaign(campaignData) {
  const campaign = emailCampaigns.find(c => c.id === campaignData.campaign_id)
  
  if (!campaign) {
    return NextResponse.json(
      { success: false, error: 'Campaign not found' },
      { status: 404 }
    )
  }
  
  campaign.status = 'sending'
  campaign.launched_at = new Date().toISOString()
  
  // Get contacts for this campaign
  const campaignContacts = emailContacts.filter(
    contact => campaign.contact_ids.includes(contact.id)
  )
  
  // Simulate sending emails (in production, use actual Email Sneek API)
  const emailResults = await Promise.all(
    campaignContacts.map(contact => sendEmailViaSneek(contact, campaign))
  )
  
  campaign.sent_count = emailResults.filter(result => result.success).length
  campaign.status = 'completed'
  
  return NextResponse.json({
    success: true,
    campaign: campaign,
    results: emailResults,
    message: `🚀 Campaign launched! ${campaign.sent_count} emails sent successfully`,
    ponchInsight: "Live email automation just closed this demo!"
  })
}

async function sendEmailViaSneek(contact, campaign) {
  try {
    // For demo purposes, simulate email sending
    // In production, replace with actual Email Sneek API call
    
    const emailPayload = {
      recipient: contact.email,
      name: contact.name,
      subject: campaign.subject,
      content: personalizeEmailContent(campaign.content, contact),
      campaign_id: campaign.id
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock successful response
    return {
      success: true,
      contact: contact.email,
      message_id: `msg_${Date.now()}_${contact.id}`,
      status: 'sent',
      timestamp: new Date().toISOString()
    }
    
    // TODO: Replace with actual Email Sneek API call
    /*
    const response = await fetch(`${EMAIL_SNEEK_BASE_URL}/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EMAIL_SNEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    })
    
    if (response.ok) {
      return {
        success: true,
        contact: contact.email,
        data: await response.json()
      }
    } else {
      throw new Error(`Email Sneek API error: ${response.status}`)
    }
    */
    
  } catch (error) {
    console.error(`Failed to send email to ${contact.email}:`, error)
    return {
      success: false,
      contact: contact.email,
      error: error.message
    }
  }
}

function personalizeEmailContent(content, contact) {
  return content
    .replace('{{name}}', contact.name)
    .replace('{{company}}', contact.company || 'your company')
    .replace('{{email}}', contact.email)
}

// Demo email templates for live campaigns
export const DEMO_EMAIL_TEMPLATES = {
  leadGeneration: {
    subject: '🚀 Automate Your {{company}} Operations - CHIVITO AI Demo',
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

P.S. This email was sent automatically by CHIVITO AI during a live demo. Pretty cool, right?`
  },
  
  followUp: {
    subject: '⚡ Quick follow-up - CHIVITO AI automation for {{company}}',
    content: `{{name}},

Ponch here again. Quick follow-up on automating {{company}}'s operations.

Most businesses waste 6+ hours daily on manual tasks. CHIVITO handles:
• Lead generation
• Email outreach (like this)
• Customer support
• Sales pipeline management

Real results, not just promises.

Want to see it work for your business? I can show you in 15 minutes.

- Ponch

P.S. This follow-up was automated too. See the pattern?`
  }
}