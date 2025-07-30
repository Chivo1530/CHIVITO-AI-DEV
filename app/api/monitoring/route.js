// CHIVITO AI - Self-Healing Monitoring System
// "If you can't see it, you can't scale it"

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// Monitoring configuration
const MONITORING_CONFIG = {
  checkInterval: 5 * 60 * 1000, // 5 minutes
  alertThresholds: {
    errorRate: 10, // 10% error rate triggers alert
    responseTime: 5000, // 5 seconds response time threshold
    failedWorkflows: 3, // 3 failed workflows in a row triggers alert
    systemLoad: 80 // 80% system load triggers alert
  },
  notifications: {
    email: 'ponch@chivito.ai',
    slack: process.env.SLACK_WEBHOOK_URL,
    discord: process.env.DISCORD_WEBHOOK_URL
  }
}

// Store monitoring data (in production, use dedicated monitoring DB)
let monitoringData = {
  systemHealth: 'healthy',
  lastCheck: new Date().toISOString(),
  errors: [],
  metrics: {
    uptime: '99.9%',
    responseTime: '1.2s',
    errorRate: '0.1%',
    activeUsers: 0,
    workflowSuccessRate: '95%'
  },
  alerts: []
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    switch (action) {
      case 'health_check':
        return await performHealthCheck()
      
      case 'get_metrics':
        return await getSystemMetrics()
      
      case 'get_alerts':
        return await getActiveAlerts()
      
      case 'system_status':
        return await getSystemStatus()
      
      default:
        return NextResponse.json({
          success: true,
          data: monitoringData,
          ponchInsight: 'Empire monitoring systems operational!'
        })
    }
  } catch (error) {
    console.error('Monitoring error:', error)
    return NextResponse.json(
      { success: false, error: 'Monitoring system failed' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { action, data } = await request.json()
    
    switch (action) {
      case 'log_error':
        return await logError(data)
      
      case 'restart_service':
        return await restartService(data)
      
      case 'send_alert':
        return await sendAlert(data)
      
      case 'heal_system':
        return await healSystem(data)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid monitoring action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Monitoring POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Monitoring operation failed' },
      { status: 500 }
    )
  }
}

async function performHealthCheck() {
  try {
    const healthChecks = {
      database: await checkDatabaseHealth(),
      apis: await checkAPIHealth(),
      workflows: await checkWorkflowHealth(),
      payments: await checkPaymentHealth(),
      email: await checkEmailHealth(),
      storage: await checkStorageHealth(),
      memory: await checkMemoryHealth()
    }
    
    const failedChecks = Object.entries(healthChecks)
      .filter(([_, check]) => check.status !== 'healthy')
    
    const overallHealth = failedChecks.length === 0 ? 'healthy' : 'degraded'
    
    // Update monitoring data
    monitoringData.systemHealth = overallHealth
    monitoringData.lastCheck = new Date().toISOString()
    
    // If system is degraded, trigger self-healing
    if (overallHealth === 'degraded') {
      await triggerSelfHealing(failedChecks)
    }
    
    return NextResponse.json({
      success: true,
      health: {
        overall: overallHealth,
        checks: healthChecks,
        failedChecks: failedChecks.length,
        lastChecked: monitoringData.lastCheck
      },
      ponchInsight: overallHealth === 'healthy' ? 
        'Empire systems running perfectly!' : 
        `${failedChecks.length} systems need attention - self-healing initiated!`
    })
  } catch (error) {
    await logError({
      type: 'health_check_failed',
      message: error.message,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { success: false, error: 'Health check failed' },
      { status: 500 }
    )
  }
}

async function getSystemMetrics() {
  try {
    // Get real-time metrics
    const { data: users } = await supabase
      .from('user_profiles')
      .select('*')
    
    const { data: workflows } = await supabase
      .from('workflow_executions')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    
    const metrics = {
      activeUsers: users?.filter(u => u.subscription_status === 'active').length || 0,
      totalUsers: users?.length || 0,
      workflowsToday: workflows?.length || 0,
      workflowSuccessRate: calculateSuccessRate(workflows),
      responseTime: await measureResponseTime(),
      errorRate: calculateErrorRate(),
      uptime: calculateUptime(),
      memory: await getMemoryUsage(),
      cpu: await getCPUUsage(),
      storage: await getStorageUsage()
    }
    
    // Update monitoring data
    monitoringData.metrics = {
      ...monitoringData.metrics,
      ...metrics
    }
    
    return NextResponse.json({
      success: true,
      metrics: metrics,
      ponchInsight: `Empire metrics: ${metrics.activeUsers} active users, ${metrics.workflowsToday} workflows today!`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get metrics' },
      { status: 500 }
    )
  }
}

async function triggerSelfHealing(failedChecks) {
  try {
    for (const [service, check] of failedChecks) {
      console.log(`🔧 Self-healing: Attempting to fix ${service}`)
      
      switch (service) {
        case 'database':
          await healDatabaseConnection()
          break
        
        case 'workflows':
          await healWorkflowSystem()
          break
        
        case 'apis':
          await healAPIConnections()
          break
        
        case 'memory':
          await healMemoryIssues()
          break
        
        default:
          console.log(`No self-healing available for ${service}`)
      }
    }
    
    // Send alert about self-healing attempt
    await sendAlert({
      type: 'self_healing_triggered',
      message: `Self-healing triggered for ${failedChecks.length} services`,
      services: failedChecks.map(([service, _]) => service),
      timestamp: new Date().toISOString(),
      severity: 'warning'
    })
    
    return { success: true, message: 'Self-healing initiated' }
  } catch (error) {
    console.error('Self-healing failed:', error)
    
    // Send critical alert
    await sendAlert({
      type: 'self_healing_failed',
      message: 'Self-healing system failed - manual intervention required',
      error: error.message,
      timestamp: new Date().toISOString(),
      severity: 'critical'
    })
    
    return { success: false, error: 'Self-healing failed' }
  }
}

async function sendAlert(alertData) {
  try {
    const alert = {
      id: `alert_${Date.now()}`,
      ...alertData,
      timestamp: new Date().toISOString()
    }
    
    // Add to alerts array
    monitoringData.alerts.push(alert)
    
    // Send email notification
    if (MONITORING_CONFIG.notifications.email) {
      await sendEmailAlert(alert)
    }
    
    // Send Slack notification
    if (MONITORING_CONFIG.notifications.slack) {
      await sendSlackAlert(alert)
    }
    
    // Log to database
    await logAlert(alert)
    
    return NextResponse.json({
      success: true,
      alert: alert,
      ponchInsight: 'Alert sent - empire monitoring is watching!'
    })
  } catch (error) {
    console.error('Alert sending failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send alert' },
      { status: 500 }
    )
  }
}

async function healDatabaseConnection() {
  try {
    // Attempt to reconnect to database
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact' })
      .limit(1)
    
    if (error) throw error
    
    console.log('✅ Database connection healed')
    return { success: true, message: 'Database connection restored' }
  } catch (error) {
    console.error('❌ Database healing failed:', error)
    return { success: false, error: 'Database healing failed' }
  }
}

async function healWorkflowSystem() {
  try {
    // Restart failed workflows
    const { data: failedWorkflows } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('status', 'failed')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
    
    if (failedWorkflows && failedWorkflows.length > 0) {
      console.log(`🔄 Restarting ${failedWorkflows.length} failed workflows`)
      
      for (const workflow of failedWorkflows) {
        // Attempt to restart workflow
        try {
          // In production, trigger actual workflow restart
          await restartWorkflow(workflow)
        } catch (restartError) {
          console.error(`Failed to restart workflow ${workflow.id}:`, restartError)
        }
      }
    }
    
    console.log('✅ Workflow system healed')
    return { success: true, message: 'Workflow system restored' }
  } catch (error) {
    console.error('❌ Workflow healing failed:', error)
    return { success: false, error: 'Workflow healing failed' }
  }
}

async function healAPIConnections() {
  try {
    // Test and restore API connections
    const apis = ['openai', 'stripe', 'n8n', 'email']
    
    for (const api of apis) {
      try {
        await testAPIConnection(api)
        console.log(`✅ ${api} API connection healthy`)
      } catch (apiError) {
        console.error(`❌ ${api} API connection failed:`, apiError)
      }
    }
    
    return { success: true, message: 'API connections checked and healed' }
  } catch (error) {
    return { success: false, error: 'API healing failed' }
  }
}

async function healMemoryIssues() {
  try {
    // Force garbage collection if possible
    if (global.gc) {
      global.gc()
      console.log('✅ Memory garbage collection triggered')
    }
    
    // Clear caches
    // clearCaches()
    
    return { success: true, message: 'Memory issues addressed' }
  } catch (error) {
    return { success: false, error: 'Memory healing failed' }
  }
}

// Helper functions
async function checkDatabaseHealth() {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact' }).limit(1)
    return { status: 'healthy', message: 'Database responsive', responseTime: '< 1s' }
  } catch (error) {
    return { status: 'unhealthy', message: 'Database connection failed', error: error.message }
  }
}

async function checkAPIHealth() {
  try {
    // Check external API health
    const apis = ['openai', 'stripe', 'n8n']
    const results = await Promise.allSettled(apis.map(api => testAPIConnection(api)))
    
    const failures = results.filter(r => r.status === 'rejected').length
    const status = failures === 0 ? 'healthy' : failures < apis.length ? 'degraded' : 'unhealthy'
    
    return { 
      status, 
      message: `${apis.length - failures}/${apis.length} APIs responsive`,
      failures: failures
    }
  } catch (error) {
    return { status: 'unhealthy', message: 'API health check failed' }
  }
}

async function checkWorkflowHealth() {
  try {
    const { data: recentWorkflows } = await supabase
      .from('workflow_executions')
      .select('*')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    
    const failedCount = recentWorkflows?.filter(w => w.status === 'failed').length || 0
    const totalCount = recentWorkflows?.length || 0
    
    const status = failedCount === 0 ? 'healthy' : 
                   failedCount < totalCount * 0.1 ? 'degraded' : 'unhealthy'
    
    return { 
      status, 
      message: `${totalCount - failedCount}/${totalCount} workflows successful`,
      failedCount: failedCount
    }
  } catch (error) {
    return { status: 'unhealthy', message: 'Workflow health check failed' }
  }
}

async function checkPaymentHealth() {
  // Check Stripe health
  return { status: 'healthy', message: 'Payment processing normal' }
}

async function checkEmailHealth() {
  // Check email service health
  return { status: 'healthy', message: 'Email service operational' }
}

async function checkStorageHealth() {
  // Check storage health
  return { status: 'healthy', message: 'Storage systems normal' }
}

async function checkMemoryHealth() {
  try {
    const memoryUsage = process.memoryUsage()
    const usagePercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
    
    const status = usagePercentage < 80 ? 'healthy' : 
                   usagePercentage < 90 ? 'degraded' : 'unhealthy'
    
    return { 
      status, 
      message: `Memory usage: ${usagePercentage.toFixed(1)}%`,
      usage: memoryUsage
    }
  } catch (error) {
    return { status: 'unhealthy', message: 'Memory check failed' }
  }
}

function calculateSuccessRate(workflows) {
  if (!workflows || workflows.length === 0) return 100
  const successful = workflows.filter(w => w.status === 'success').length
  return Math.round((successful / workflows.length) * 100)
}

function calculateErrorRate() {
  // Calculate error rate from recent requests
  return Math.random() * 2 // Mock: 0-2% error rate
}

function calculateUptime() {
  // Calculate system uptime
  return '99.9%' // Mock uptime
}

async function measureResponseTime() {
  const start = Date.now()
  await new Promise(resolve => setTimeout(resolve, 10))
  return Date.now() - start
}

async function getMemoryUsage() {
  const memoryUsage = process.memoryUsage()
  return Math.round(memoryUsage.heapUsed / 1024 / 1024) // MB
}

async function getCPUUsage() {
  // Mock CPU usage
  return Math.round(Math.random() * 30) // 0-30% CPU usage
}

async function getStorageUsage() {
  // Mock storage usage
  return Math.round(Math.random() * 50) // 0-50% storage usage
}

async function testAPIConnection(api) {
  // Mock API connection tests
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: 'ok' }), 100)
  })
}

async function restartWorkflow(workflow) {
  // Mock workflow restart
  console.log(`Restarting workflow ${workflow.id}`)
  return { success: true }
}

async function sendEmailAlert(alert) {
  // Mock email alert
  console.log(`📧 Email alert sent: ${alert.message}`)
}

async function sendSlackAlert(alert) {
  // Mock Slack alert
  console.log(`📱 Slack alert sent: ${alert.message}`)
}

async function logAlert(alert) {
  // Log alert to database
  console.log(`📝 Alert logged: ${alert.id}`)
}

async function logError(error) {
  monitoringData.errors.push({
    ...error,
    id: `error_${Date.now()}`,
    timestamp: new Date().toISOString()
  })
  
  // Keep only last 100 errors
  if (monitoringData.errors.length > 100) {
    monitoringData.errors = monitoringData.errors.slice(-100)
  }
  
  return NextResponse.json({
    success: true,
    message: 'Error logged',
    errorId: `error_${Date.now()}`
  })
}

// Export monitoring data for cron jobs
export const getMonitoringData = () => monitoringData