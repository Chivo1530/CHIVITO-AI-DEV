// CHIVITO AI - Auto-Usage Limits & Alerts System
// "You can use it free... until it prints. Then you gotta pay."

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// Usage limits by plan
const USAGE_LIMITS = {
  free_trial: {
    workflows_per_day: 5,
    emails_per_day: 10,
    ai_requests_per_day: 20,
    storage_mb: 50
  },
  professional: {
    workflows_per_day: 100,
    emails_per_day: 500,
    ai_requests_per_day: 1000,
    storage_mb: 1000
  },
  enterprise: {
    workflows_per_day: 1000,
    emails_per_day: 5000,
    ai_requests_per_day: 10000,
    storage_mb: 10000
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    
    switch (action) {
      case 'check_limits':
        return await checkUserLimits(userId)
      
      case 'usage_stats':
        return await getUserUsageStats(userId)
      
      case 'all_usage':
        return await getAllUsageStats()
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Usage limits error:', error)
    return NextResponse.json(
      { success: false, error: 'Usage limits check failed' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { action, data } = await request.json()
    
    switch (action) {
      case 'track_usage':
        return await trackUsage(data)
      
      case 'reset_limits':
        return await resetUserLimits(data)
      
      case 'upgrade_prompt':
        return await sendUpgradePrompt(data)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid usage action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Usage tracking error:', error)
    return NextResponse.json(
      { success: false, error: 'Usage tracking failed' },
      { status: 500 }
    )
  }
}

async function checkUserLimits(userId) {
  try {
    // Get user plan
    const { data: user } = await supabase
      .from('user_profiles')
      .select('subscription_plan, usage_stats')
      .eq('id', userId)
      .single()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    const userPlan = user.subscription_plan || 'free_trial'
    const limits = USAGE_LIMITS[userPlan]
    const usage = user.usage_stats || {}
    
    // Get today's usage
    const today = new Date().toISOString().split('T')[0]
    const todayUsage = usage[today] || {
      workflows: 0,
      emails: 0,
      ai_requests: 0,
      storage_mb: 0
    }
    
    // Check limits
    const limitChecks = {
      workflows: {
        used: todayUsage.workflows,
        limit: limits.workflows_per_day,
        remaining: limits.workflows_per_day - todayUsage.workflows,
        exceeded: todayUsage.workflows >= limits.workflows_per_day
      },
      emails: {
        used: todayUsage.emails,
        limit: limits.emails_per_day,
        remaining: limits.emails_per_day - todayUsage.emails,
        exceeded: todayUsage.emails >= limits.emails_per_day
      },
      ai_requests: {
        used: todayUsage.ai_requests,
        limit: limits.ai_requests_per_day,
        remaining: limits.ai_requests_per_day - todayUsage.ai_requests,
        exceeded: todayUsage.ai_requests >= limits.ai_requests_per_day
      },
      storage: {
        used: todayUsage.storage_mb,
        limit: limits.storage_mb,
        remaining: limits.storage_mb - todayUsage.storage_mb,
        exceeded: todayUsage.storage_mb >= limits.storage_mb
      }
    }
    
    // Check if any limits are exceeded
    const hasExceededLimits = Object.values(limitChecks).some(check => check.exceeded)
    
    // Send upgrade prompt if approaching limits
    const approachingLimits = Object.values(limitChecks).some(check => 
      check.remaining < check.limit * 0.2 // 20% remaining
    )
    
    if (approachingLimits && userPlan === 'free_trial') {
      await sendUpgradePrompt({
        userId,
        reason: 'approaching_limits',
        limits: limitChecks
      })
    }
    
    return NextResponse.json({
      success: true,
      userId,
      plan: userPlan,
      limits: limitChecks,
      hasExceededLimits,
      approachingLimits,
      upgradeRecommended: approachingLimits && userPlan === 'free_trial',
      ponchInsight: hasExceededLimits ? 
        "🚨 Usage limits exceeded! Time to upgrade and unlock the full empire!" :
        "✅ Usage within limits - keep building the empire!"
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to check limits' },
      { status: 500 }
    )
  }
}

async function trackUsage(data) {
  try {
    const { userId, usageType, amount = 1 } = data
    
    // Get current usage
    const { data: user } = await supabase
      .from('user_profiles')
      .select('usage_stats')
      .eq('id', userId)
      .single()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    const currentUsage = user.usage_stats || {}
    const today = new Date().toISOString().split('T')[0]
    
    // Initialize today's usage if not exists
    if (!currentUsage[today]) {
      currentUsage[today] = {
        workflows: 0,
        emails: 0,
        ai_requests: 0,
        storage_mb: 0
      }
    }
    
    // Update usage
    currentUsage[today][usageType] += amount
    
    // Clean up old usage data (keep last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    Object.keys(currentUsage).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete currentUsage[date]
      }
    })
    
    // Save updated usage
    const { error } = await supabase
      .from('user_profiles')
      .update({
        usage_stats: currentUsage,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (error) throw error
    
    // Check if limits exceeded after update
    const limitsCheck = await checkUserLimits(userId)
    
    return NextResponse.json({
      success: true,
      userId,
      usageType,
      amount,
      newUsage: currentUsage[today][usageType],
      date: today,
      limitsCheck: limitsCheck.body,
      ponchInsight: `Usage tracked: ${usageType} +${amount}. Empire growing!`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to track usage' },
      { status: 500 }
    )
  }
}

async function sendUpgradePrompt(data) {
  try {
    const { userId, reason, limits } = data
    
    // Get user info
    const { data: user } = await supabase
      .from('user_profiles')
      .select('email, subscription_plan')
      .eq('id', userId)
      .single()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Create upgrade prompt
    const upgradePrompt = {
      userId,
      userEmail: user.email,
      currentPlan: user.subscription_plan,
      reason,
      limits,
      timestamp: new Date().toISOString(),
      message: generateUpgradeMessage(reason, limits),
      urgency: reason === 'exceeded_limits' ? 'high' : 'medium'
    }
    
    // Send email notification (in production)
    await sendUpgradeEmail(upgradePrompt)
    
    // Log upgrade prompt
    console.log(`📈 Upgrade prompt sent to ${user.email}: ${reason}`)
    
    return NextResponse.json({
      success: true,
      upgradePrompt,
      ponchInsight: "Upgrade prompt sent - time to convert free users to paying customers!"
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send upgrade prompt' },
      { status: 500 }
    )
  }
}

async function getUserUsageStats(userId) {
  try {
    const { data: user } = await supabase
      .from('user_profiles')
      .select('usage_stats, subscription_plan')
      .eq('id', userId)
      .single()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    const usage = user.usage_stats || {}
    const plan = user.subscription_plan || 'free_trial'
    
    // Calculate usage trends
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      return date.toISOString().split('T')[0]
    })
    
    const usageTrend = last7Days.map(date => ({
      date,
      workflows: usage[date]?.workflows || 0,
      emails: usage[date]?.emails || 0,
      ai_requests: usage[date]?.ai_requests || 0,
      storage_mb: usage[date]?.storage_mb || 0
    }))
    
    return NextResponse.json({
      success: true,
      userId,
      plan,
      usageTrend,
      totalUsage: calculateTotalUsage(usage),
      ponchInsight: "Usage analytics ready - optimize the empire!"
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get usage stats' },
      { status: 500 }
    )
  }
}

async function getAllUsageStats() {
  try {
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id, email, subscription_plan, usage_stats')
    
    const aggregateStats = {
      totalUsers: users.length,
      planBreakdown: {},
      dailyUsage: {},
      heavyUsers: []
    }
    
    users.forEach(user => {
      const plan = user.subscription_plan || 'free_trial'
      aggregateStats.planBreakdown[plan] = (aggregateStats.planBreakdown[plan] || 0) + 1
      
      // Calculate user's daily usage
      const today = new Date().toISOString().split('T')[0]
      const todayUsage = user.usage_stats?.[today] || {}
      const totalTodayUsage = Object.values(todayUsage).reduce((sum, val) => sum + val, 0)
      
      if (totalTodayUsage > 50) { // Heavy user threshold
        aggregateStats.heavyUsers.push({
          userId: user.id,
          email: user.email,
          plan: plan,
          usage: totalTodayUsage
        })
      }
    })
    
    return NextResponse.json({
      success: true,
      stats: aggregateStats,
      ponchInsight: `Empire usage: ${users.length} users, ${aggregateStats.heavyUsers.length} heavy users!`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get all usage stats' },
      { status: 500 }
    )
  }
}

function generateUpgradeMessage(reason, limits) {
  const messages = {
    approaching_limits: "🚨 You're approaching your usage limits! Upgrade to keep building your empire without interruption.",
    exceeded_limits: "⚠️ You've exceeded your usage limits! Upgrade now to unlock unlimited automation power.",
    heavy_usage: "🚀 You're a power user! Upgrade to Professional for unlimited workflows and priority support."
  }
  
  return messages[reason] || "Upgrade to unlock the full power of CHIVITO AI!"
}

async function sendUpgradeEmail(promptData) {
  // In production, send actual email
  console.log(`📧 Upgrade email sent to ${promptData.userEmail}`)
  console.log(`Message: ${promptData.message}`)
}

function calculateTotalUsage(usage) {
  const totals = {
    workflows: 0,
    emails: 0,
    ai_requests: 0,
    storage_mb: 0
  }
  
  Object.values(usage).forEach(dayUsage => {
    totals.workflows += dayUsage.workflows || 0
    totals.emails += dayUsage.emails || 0
    totals.ai_requests += dayUsage.ai_requests || 0
    totals.storage_mb += dayUsage.storage_mb || 0
  })
  
  return totals
}

// Helper function to check if user can perform action
export async function canUserPerformAction(userId, actionType) {
  try {
    const response = await fetch(`/api/usage-limits?action=check_limits&userId=${userId}`)
    const result = await response.json()
    
    if (!result.success) return false
    
    const actionLimits = {
      'trigger_workflow': 'workflows',
      'send_email': 'emails',
      'ai_request': 'ai_requests',
      'upload_file': 'storage'
    }
    
    const limitType = actionLimits[actionType]
    if (!limitType) return true
    
    return !result.limits[limitType]?.exceeded
  } catch (error) {
    console.error('Usage check failed:', error)
    return false
  }
}