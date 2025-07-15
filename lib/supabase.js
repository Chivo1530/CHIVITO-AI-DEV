import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwaktovpihmhvyhoillk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWt0b3ZwaWhtaHZ5aG9pbGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MjAxMjksImV4cCI6MjA2ODE5NjEyOX0.lFgLWst_1QswoWI5BJRaCmJaGG_qWvXUTqW58Y4I0vc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eWdpc25sbHNhd2t1aHVpdXhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY5MzMwNiwiZXhwIjoyMDY3MjY5MzA2fQ.Cl6iPMtC5ha3LdeLMN8O4xC9xAo1y5QdTloMz6E31Ts'
)

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE_TRIAL: {
    id: 'free_trial',
    name: 'Free Trial',
    price: 0,
    duration: 7, // days
    features: {
      agents: 1,
      leads_per_month: 50,
      workflows: 'basic',
      support: 'community',
      voice_ai: false,
      integrations: 'basic',
    },
    limits: {
      agent_runs: 100,
      lead_generation: 50,
      api_calls: 1000,
    }
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    price: 297,
    priceId: 'price_professional_monthly', // Will be set in Stripe
    features: {
      agents: 3,
      leads_per_month: 1000,
      workflows: 'advanced',
      support: 'priority',
      voice_ai: false,
      integrations: 'advanced',
    },
    limits: {
      agent_runs: 1000,
      lead_generation: 1000,
      api_calls: 10000,
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 697,
    priceId: 'price_enterprise_monthly', // Will be set in Stripe
    features: {
      agents: 'unlimited',
      leads_per_month: 'unlimited',
      workflows: 'advanced',
      support: 'dedicated',
      voice_ai: true,
      integrations: 'custom',
    },
    limits: {
      agent_runs: -1, // unlimited
      lead_generation: -1, // unlimited
      api_calls: -1, // unlimited
    }
  }
}

// User Management Functions
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  return data
}

export const createUserProfile = async (user) => {
  const profile = {
    user_id: user.id,
    email: user.email,
    subscription_plan: 'free_trial',
    subscription_status: 'active',
    business_type: null,
    created_at: new Date().toISOString(),
    trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    usage_stats: {
      agent_runs: 0,
      lead_generation: 0,
      api_calls: 0,
    }
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .insert([profile])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const checkPlanLimits = async (userId, action) => {
  const profile = await getUserProfile(userId)
  if (!profile) return false

  const plan = SUBSCRIPTION_PLANS[profile.subscription_plan.toUpperCase()]
  if (!plan) return false

  const usage = profile.usage_stats || {}

  switch (action) {
    case 'agent_run':
      return plan.limits.agent_runs === -1 || usage.agent_runs < plan.limits.agent_runs
    case 'lead_generation':
      return plan.limits.lead_generation === -1 || usage.lead_generation < plan.limits.lead_generation
    case 'api_call':
      return plan.limits.api_calls === -1 || usage.api_calls < plan.limits.api_calls
    default:
      return false
  }
}

export const incrementUsage = async (userId, action) => {
  const profile = await getUserProfile(userId)
  if (!profile) return

  const currentUsage = profile.usage_stats || {}
  const newUsage = { ...currentUsage }

  switch (action) {
    case 'agent_run':
      newUsage.agent_runs = (currentUsage.agent_runs || 0) + 1
      break
    case 'lead_generation':
      newUsage.lead_generation = (currentUsage.lead_generation || 0) + 1
      break
    case 'api_call':
      newUsage.api_calls = (currentUsage.api_calls || 0) + 1
      break
  }

  await updateUserProfile(userId, { usage_stats: newUsage })
}