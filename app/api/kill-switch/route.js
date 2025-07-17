// CHIVITO AI - Emergency Kill Switch System
// "Better safe than bankrupt"

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// Global platform control
let globalPlatformStatus = {
  is_platform_paused: false,
  pause_reason: null,
  paused_at: null,
  paused_by: null,
  emergency_mode: false
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    switch (action) {
      case 'status':
        return await getPlatformStatus()
      
      case 'check_user_access':
        const userId = searchParams.get('userId')
        return await checkUserAccess(userId)
      
      default:
        return NextResponse.json({
          success: true,
          status: globalPlatformStatus,
          ponchInsight: "Platform kill switch operational - empire protected!"
        })
    }
  } catch (error) {
    console.error('Kill switch error:', error)
    return NextResponse.json(
      { success: false, error: 'Kill switch system failed' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { action, data } = await request.json()
    
    // Verify admin access
    const adminAuth = await verifyAdminAccess(request)
    if (!adminAuth.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    switch (action) {
      case 'pause_platform':
        return await pausePlatform(data)
      
      case 'resume_platform':
        return await resumePlatform(data)
      
      case 'emergency_pause':
        return await emergencyPause(data)
      
      case 'pause_user':
        return await pauseUser(data)
      
      case 'resume_user':
        return await resumeUser(data)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid kill switch action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Kill switch POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Kill switch operation failed' },
      { status: 500 }
    )
  }
}

async function getPlatformStatus() {
  try {
    // Check database for platform status
    const { data: platformConfig } = await supabase
      .from('platform_config')
      .select('*')
      .eq('config_key', 'platform_status')
      .single()
    
    if (platformConfig) {
      globalPlatformStatus = JSON.parse(platformConfig.config_value)
    }
    
    return NextResponse.json({
      success: true,
      status: globalPlatformStatus,
      ponchInsight: globalPlatformStatus.is_platform_paused ? 
        "🚨 Platform paused - protecting the empire!" : 
        "✅ Platform operational - empire running strong!"
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get platform status' },
      { status: 500 }
    )
  }
}

async function pausePlatform(data) {
  try {
    const { reason, admin_email } = data
    
    globalPlatformStatus = {
      is_platform_paused: true,
      pause_reason: reason || 'Manual pause by admin',
      paused_at: new Date().toISOString(),
      paused_by: admin_email || 'ponch@chivito.ai',
      emergency_mode: false
    }
    
    // Store in database
    await supabase
      .from('platform_config')
      .upsert({
        config_key: 'platform_status',
        config_value: JSON.stringify(globalPlatformStatus),
        updated_at: new Date().toISOString()
      })
    
    // Send alerts
    await sendAlert({
      type: 'platform_paused',
      message: `🚨 Platform paused: ${reason}`,
      admin: admin_email,
      severity: 'critical'
    })
    
    return NextResponse.json({
      success: true,
      status: globalPlatformStatus,
      message: '🚨 Platform paused successfully',
      ponchInsight: "Empire protected! All workflows stopped safely."
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to pause platform' },
      { status: 500 }
    )
  }
}

async function resumePlatform(data) {
  try {
    const { admin_email } = data
    
    globalPlatformStatus = {
      is_platform_paused: false,
      pause_reason: null,
      paused_at: null,
      paused_by: null,
      emergency_mode: false
    }
    
    // Store in database
    await supabase
      .from('platform_config')
      .upsert({
        config_key: 'platform_status',
        config_value: JSON.stringify(globalPlatformStatus),
        updated_at: new Date().toISOString()
      })
    
    // Send alerts
    await sendAlert({
      type: 'platform_resumed',
      message: '✅ Platform resumed - operations normal',
      admin: admin_email,
      severity: 'success'
    })
    
    return NextResponse.json({
      success: true,
      status: globalPlatformStatus,
      message: '✅ Platform resumed successfully',
      ponchInsight: "Empire back online! Workflows ready to dominate."
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to resume platform' },
      { status: 500 }
    )
  }
}

async function emergencyPause(data) {
  try {
    const { reason, admin_email } = data
    
    globalPlatformStatus = {
      is_platform_paused: true,
      pause_reason: `🚨 EMERGENCY: ${reason}`,
      paused_at: new Date().toISOString(),
      paused_by: admin_email || 'ponch@chivito.ai',
      emergency_mode: true
    }
    
    // Store in database
    await supabase
      .from('platform_config')
      .upsert({
        config_key: 'platform_status',
        config_value: JSON.stringify(globalPlatformStatus),
        updated_at: new Date().toISOString()
      })
    
    // Send critical alerts
    await sendAlert({
      type: 'emergency_pause',
      message: `🚨 EMERGENCY PAUSE: ${reason}`,
      admin: admin_email,
      severity: 'critical'
    })
    
    return NextResponse.json({
      success: true,
      status: globalPlatformStatus,
      message: '🚨 Emergency pause activated',
      ponchInsight: "Emergency mode activated! Empire protected from critical threat."
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to emergency pause' },
      { status: 500 }
    )
  }
}

async function checkUserAccess(userId) {
  try {
    // Check global platform status
    if (globalPlatformStatus.is_platform_paused) {
      return NextResponse.json({
        success: false,
        access_denied: true,
        reason: globalPlatformStatus.pause_reason,
        is_emergency: globalPlatformStatus.emergency_mode,
        message: 'Platform is temporarily paused for maintenance'
      })
    }
    
    // Check user-specific pause
    const { data: user } = await supabase
      .from('user_profiles')
      .select('settings')
      .eq('id', userId)
      .single()
    
    if (user?.settings?.is_paused) {
      return NextResponse.json({
        success: false,
        access_denied: true,
        reason: user.settings.pause_reason || 'Account temporarily suspended',
        is_emergency: false,
        message: 'Your account access is temporarily restricted'
      })
    }
    
    return NextResponse.json({
      success: true,
      access_granted: true,
      message: 'Access granted - empire ready!'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Access check failed' },
      { status: 500 }
    )
  }
}

async function pauseUser(data) {
  try {
    const { userId, reason, admin_email } = data
    
    const { error } = await supabase
      .from('user_profiles')
      .update({
        settings: {
          is_paused: true,
          pause_reason: reason,
          paused_at: new Date().toISOString(),
          paused_by: admin_email
        }
      })
      .eq('id', userId)
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      message: `User ${userId} paused successfully`,
      ponchInsight: "User access restricted - empire security maintained."
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to pause user' },
      { status: 500 }
    )
  }
}

async function resumeUser(data) {
  try {
    const { userId, admin_email } = data
    
    const { error } = await supabase
      .from('user_profiles')
      .update({
        settings: {
          is_paused: false,
          pause_reason: null,
          paused_at: null,
          paused_by: null
        }
      })
      .eq('id', userId)
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      message: `User ${userId} resumed successfully`,
      ponchInsight: "User access restored - empire growth continues."
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to resume user' },
      { status: 500 }
    )
  }
}

async function verifyAdminAccess(request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return { success: false, error: 'No authorization header' }
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    if (token === process.env.ADMIN_TOKEN) {
      return { success: true, adminLevel: 'super' }
    }
    
    return { success: false, error: 'Invalid admin token' }
  } catch (error) {
    return { success: false, error: 'Auth verification failed' }
  }
}

async function sendAlert(alertData) {
  try {
    // Send to monitoring system
    await fetch('/api/monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_alert',
        data: alertData
      })
    })
  } catch (error) {
    console.error('Failed to send alert:', error)
  }
}

// Middleware function to check platform access
export async function checkPlatformAccess(userId) {
  try {
    const response = await fetch('/api/kill-switch?action=check_user_access&userId=' + userId)
    const result = await response.json()
    
    return result.success && result.access_granted
  } catch (error) {
    console.error('Platform access check failed:', error)
    return false
  }
}