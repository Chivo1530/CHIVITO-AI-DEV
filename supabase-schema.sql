-- CHIVITO AI - Premium SaaS Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_plan TEXT DEFAULT 'free_trial',
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  business_type TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  usage_stats JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id)
);

-- Create agents table
CREATE TABLE IF NOT EXISTS user_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  configuration JSONB DEFAULT '{}'::jsonb,
  performance_stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create leads table
CREATE TABLE IF NOT EXISTS user_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  position TEXT,
  phone TEXT,
  status TEXT DEFAULT 'cold',
  score INTEGER DEFAULT 0,
  source TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  next_action TEXT,
  value INTEGER DEFAULT 0,
  stage TEXT DEFAULT 'awareness',
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create workflows table
CREATE TABLE IF NOT EXISTS user_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_name TEXT NOT NULL,
  workflow_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  configuration JSONB DEFAULT '{}'::jsonb,
  execution_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS user_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES user_agents(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  task_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  result TEXT,
  execution_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create conversations table for AI assistant
CREATE TABLE IF NOT EXISTS user_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL, -- 'user' or 'ai'
  message_content TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS user_usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create revenue tracking table
CREATE TABLE IF NOT EXISTS user_revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_revenue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own agents" ON user_agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own agents" ON user_agents FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own leads" ON user_leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own leads" ON user_leads FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workflows" ON user_workflows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workflows" ON user_workflows FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks" ON user_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tasks" ON user_tasks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON user_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own conversations" ON user_conversations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON user_usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON user_usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own revenue" ON user_revenue FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own revenue" ON user_revenue FOR ALL USING (auth.uid() = user_id);

-- Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, subscription_plan, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    'free_trial',
    NOW() + INTERVAL '7 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_agents_updated_at BEFORE UPDATE ON user_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_leads_updated_at BEFORE UPDATE ON user_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_workflows_updated_at BEFORE UPDATE ON user_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample subscription plans for reference
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO subscription_plans (id, name, price, features, limits) VALUES
('free_trial', 'Free Trial', 0, 
 '{"agents": 1, "leads_per_month": 50, "workflows": "basic", "support": "community", "voice_ai": false}',
 '{"agent_runs": 100, "lead_generation": 50, "api_calls": 1000}'),
('professional', 'Professional', 29700, 
 '{"agents": 3, "leads_per_month": 1000, "workflows": "advanced", "support": "priority", "voice_ai": false}',
 '{"agent_runs": 1000, "lead_generation": 1000, "api_calls": 10000}'),
('enterprise', 'Enterprise', 69700, 
 '{"agents": "unlimited", "leads_per_month": "unlimited", "workflows": "advanced", "support": "dedicated", "voice_ai": true}',
 '{"agent_runs": -1, "lead_generation": -1, "api_calls": -1}');

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_agents_user_id ON user_agents(user_id);
CREATE INDEX idx_user_leads_user_id ON user_leads(user_id);
CREATE INDEX idx_user_workflows_user_id ON user_workflows(user_id);
CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_user_conversations_user_id ON user_conversations(user_id);
CREATE INDEX idx_user_usage_tracking_user_id ON user_usage_tracking(user_id);
CREATE INDEX idx_user_revenue_user_id ON user_revenue(user_id);

-- Create indexes for common queries
CREATE INDEX idx_user_leads_status ON user_leads(status);
CREATE INDEX idx_user_leads_created_at ON user_leads(created_at);
CREATE INDEX idx_user_tasks_status ON user_tasks(status);
CREATE INDEX idx_user_tasks_created_at ON user_tasks(created_at);
CREATE INDEX idx_user_conversations_created_at ON user_conversations(created_at);
CREATE INDEX idx_user_usage_tracking_created_at ON user_usage_tracking(created_at);
CREATE INDEX idx_user_revenue_date ON user_revenue(date);