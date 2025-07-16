// CHIVITO AI - Workflow Export & Lite CRM System
// "Trust through transparency, growth through simplicity"

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import JSZip from 'jszip'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    
    switch (action) {
      case 'export_workflows':
        return await exportUserWorkflows(userId)
      
      case 'get_contacts':
        return await getUserContacts(userId)
      
      case 'workflow_templates':
        return await getWorkflowTemplates()
      
      case 'crm_stats':
        return await getCRMStats(userId)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Export/CRM error:', error)
    return NextResponse.json(
      { success: false, error: 'Export/CRM system failed' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { action, data } = await request.json()
    
    switch (action) {
      case 'add_contact':
        return await addContact(data)
      
      case 'update_contact':
        return await updateContact(data)
      
      case 'delete_contact':
        return await deleteContact(data)
      
      case 'import_contacts':
        return await importContacts(data)
      
      case 'create_workflow_backup':
        return await createWorkflowBackup(data)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid export/CRM action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Export/CRM POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Export/CRM operation failed' },
      { status: 500 }
    )
  }
}

async function exportUserWorkflows(userId) {
  try {
    // Get user's workflows
    const { data: workflows, error } = await supabase
      .from('user_workflows')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    
    // Create ZIP file
    const zip = new JSZip()
    
    // Add workflows to ZIP
    workflows.forEach(workflow => {
      const workflowData = {
        id: workflow.id,
        name: workflow.workflow_name,
        type: workflow.workflow_type,
        configuration: workflow.configuration,
        created_at: workflow.created_at,
        updated_at: workflow.updated_at,
        execution_history: workflow.execution_history
      }
      
      zip.file(`${workflow.workflow_name}.json`, JSON.stringify(workflowData, null, 2))
    })
    
    // Add README
    const readme = `# CHIVITO AI Workflow Export

## Your Workflows (${workflows.length} total)

This export contains all your workflows from CHIVITO AI platform.

### Files Included:
${workflows.map(w => `- ${w.workflow_name}.json`).join('\n')}

### How to Use:
1. Import these workflows into your n8n instance
2. Update credentials and webhook URLs
3. Test each workflow before activating
4. Configure any required integrations

### Support:
- Documentation: https://docs.chivito.ai
- Support: support@chivito.ai
- Community: https://community.chivito.ai

Built with CHIVITO AI - Your Swiss Army knife for business automation.
`
    
    zip.file('README.md', readme)
    
    // Add import instructions
    const importInstructions = `# Import Instructions

## n8n Import:
1. Open your n8n instance
2. Go to Workflows section
3. Click "Import from file"
4. Select the .json file
5. Update credentials
6. Test and activate

## CHIVITO AI Import:
1. Go to Workflow Hub
2. Click "Import Template"
3. Select the .json file
4. Configure settings
5. Test and deploy

## Troubleshooting:
- Check all API credentials
- Verify webhook URLs
- Test connections
- Review execution logs
`
    
    zip.file('IMPORT_INSTRUCTIONS.md', importInstructions)
    
    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'base64' })
    
    // Track export usage
    await trackUsage({
      userId,
      usageType: 'exports',
      amount: 1
    })
    
    return NextResponse.json({
      success: true,
      exportData: {
        fileName: `chivito-workflows-${new Date().toISOString().split('T')[0]}.zip`,
        fileSize: zipBuffer.length,
        workflowCount: workflows.length,
        downloadUrl: `data:application/zip;base64,${zipBuffer}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      },
      ponchInsight: `🔒 ${workflows.length} workflows exported! Building trust through transparency.`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to export workflows' },
      { status: 500 }
    )
  }
}

async function getUserContacts(userId) {
  try {
    const { data: contacts, error } = await supabase
      .from('user_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Calculate contact stats
    const stats = {
      totalContacts: contacts.length,
      hotLeads: contacts.filter(c => c.lead_score > 80).length,
      warmLeads: contacts.filter(c => c.lead_score > 50 && c.lead_score <= 80).length,
      coldLeads: contacts.filter(c => c.lead_score <= 50).length,
      recentActivity: contacts.filter(c => {
        const lastActivity = new Date(c.last_activity || c.created_at)
        const daysSince = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        return daysSince <= 7
      }).length
    }
    
    return NextResponse.json({
      success: true,
      contacts,
      stats,
      ponchInsight: `📊 CRM ready: ${stats.totalContacts} contacts, ${stats.hotLeads} hot leads!`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get contacts' },
      { status: 500 }
    )
  }
}

async function addContact(data) {
  try {
    const { userId, contact } = data
    
    // Validate required fields
    if (!contact.email || !contact.name) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Check for duplicates
    const { data: existingContact } = await supabase
      .from('user_contacts')
      .select('id')
      .eq('user_id', userId)
      .eq('email', contact.email)
      .single()
    
    if (existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact already exists' },
        { status: 409 }
      )
    }
    
    // Create new contact
    const newContact = {
      user_id: userId,
      name: contact.name,
      email: contact.email,
      company: contact.company || null,
      position: contact.position || null,
      phone: contact.phone || null,
      lead_score: contact.lead_score || 0,
      status: contact.status || 'cold',
      source: contact.source || 'manual',
      tags: contact.tags || [],
      notes: contact.notes || null,
      last_activity: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data: savedContact, error } = await supabase
      .from('user_contacts')
      .insert([newContact])
      .select()
      .single()
    
    if (error) throw error
    
    // Track usage
    await trackUsage({
      userId,
      usageType: 'contacts',
      amount: 1
    })
    
    return NextResponse.json({
      success: true,
      contact: savedContact,
      message: 'Contact added successfully',
      ponchInsight: `🆕 New contact added: ${newContact.name} from ${newContact.company || 'Unknown Company'}`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add contact' },
      { status: 500 }
    )
  }
}

async function updateContact(data) {
  try {
    const { userId, contactId, updates } = data
    
    const { data: updatedContact, error } = await supabase
      .from('user_contacts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', contactId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      contact: updatedContact,
      message: 'Contact updated successfully',
      ponchInsight: `✏️ Contact updated: ${updatedContact.name}`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

async function importContacts(data) {
  try {
    const { userId, contacts } = data
    
    const importResults = {
      total: contacts.length,
      imported: 0,
      duplicates: 0,
      errors: []
    }
    
    for (const contact of contacts) {
      try {
        // Check for duplicate
        const { data: existingContact } = await supabase
          .from('user_contacts')
          .select('id')
          .eq('user_id', userId)
          .eq('email', contact.email)
          .single()
        
        if (existingContact) {
          importResults.duplicates++
          continue
        }
        
        // Import contact
        const newContact = {
          user_id: userId,
          name: contact.name,
          email: contact.email,
          company: contact.company || null,
          position: contact.position || null,
          phone: contact.phone || null,
          lead_score: contact.lead_score || 0,
          status: contact.status || 'cold',
          source: 'import',
          tags: contact.tags || [],
          notes: contact.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        const { error } = await supabase
          .from('user_contacts')
          .insert([newContact])
        
        if (error) {
          importResults.errors.push({
            contact: contact.email,
            error: error.message
          })
        } else {
          importResults.imported++
        }
      } catch (contactError) {
        importResults.errors.push({
          contact: contact.email,
          error: contactError.message
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      importResults,
      message: `Import complete: ${importResults.imported} contacts imported`,
      ponchInsight: `📥 Bulk import: ${importResults.imported} new contacts, ${importResults.duplicates} duplicates skipped`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to import contacts' },
      { status: 500 }
    )
  }
}

async function getCRMStats(userId) {
  try {
    const { data: contacts } = await supabase
      .from('user_contacts')
      .select('*')
      .eq('user_id', userId)
    
    const { data: workflows } = await supabase
      .from('user_workflows')
      .select('*')
      .eq('user_id', userId)
    
    const stats = {
      contacts: {
        total: contacts?.length || 0,
        hot: contacts?.filter(c => c.lead_score > 80).length || 0,
        warm: contacts?.filter(c => c.lead_score > 50 && c.lead_score <= 80).length || 0,
        cold: contacts?.filter(c => c.lead_score <= 50).length || 0
      },
      workflows: {
        total: workflows?.length || 0,
        active: workflows?.filter(w => w.status === 'active').length || 0,
        templates: workflows?.filter(w => w.workflow_type === 'template').length || 0
      },
      activity: {
        recentContacts: contacts?.filter(c => {
          const daysSince = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24)
          return daysSince <= 7
        }).length || 0,
        recentWorkflows: workflows?.filter(w => {
          const daysSince = (Date.now() - new Date(w.created_at).getTime()) / (1000 * 60 * 60 * 24)
          return daysSince <= 7
        }).length || 0
      }
    }
    
    return NextResponse.json({
      success: true,
      stats,
      ponchInsight: `📊 CRM Empire: ${stats.contacts.total} contacts, ${stats.workflows.active} active workflows!`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get CRM stats' },
      { status: 500 }
    )
  }
}

async function trackUsage(data) {
  try {
    // Track usage via usage limits API
    await fetch('/api/usage-limits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'track_usage',
        data
      })
    })
  } catch (error) {
    console.error('Usage tracking failed:', error)
  }
}