-- CHIVITO AI - BULLETPROOF DATABASE SCHEMA UPDATE
-- Adding all 6 savage features to the empire

-- Kill Switch Configuration
CREATE TABLE IF NOT EXISTS platform_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- White Label Requests
CREATE TABLE IF NOT EXISTS white_label_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  tier TEXT NOT NULL,
  requirements TEXT,
  budget TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Clone Requests
CREATE TABLE IF NOT EXISTS clone_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  tier TEXT NOT NULL,
  customizations JSONB DEFAULT '{}'::jsonb,
  timeline TEXT,
  budget TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  priority TEXT DEFAULT 'normal',
  estimated_completion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Lite CRM - User Contacts
CREATE TABLE IF NOT EXISTS user_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  position TEXT,
  phone TEXT,
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'cold',
  source TEXT DEFAULT 'manual',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, email)
);

-- Workflow Executions (for monitoring)
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_id TEXT NOT NULL,
  workflow_name TEXT NOT NULL,
  status TEXT DEFAULT 'running',
  start_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  end_time TIMESTAMP WITH TIME ZONE,
  input_data JSONB DEFAULT '{}'::jsonb,
  output_data JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Affiliate System
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL UNIQUE,
  commission_rate DECIMAL(5,2) DEFAULT 20.00,
  total_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  payout_email TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Referral Tracking
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  conversion_date TIMESTAMP WITH TIME ZONE,
  commission_earned DECIMAL(10,2) DEFAULT 0.00,
  commission_paid BOOLEAN DEFAULT FALSE,
  payment_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Commission Payouts
CREATE TABLE IF NOT EXISTS commission_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  referral_ids UUID[] NOT NULL,
  payment_method TEXT DEFAULT 'stripe',
  payment_reference TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Update existing user_profiles table with new fields
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES affiliates(id);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_affiliate BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS usage_limits JSONB DEFAULT '{}'::jsonb;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS feature_flags JSONB DEFAULT '{}'::jsonb;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS daily_limits_reset TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Enable RLS for all new tables
ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE clone_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_contacts
CREATE POLICY "Users can view own contacts" ON user_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own contacts" ON user_contacts FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for workflow_executions
CREATE POLICY "Users can view own executions" ON workflow_executions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own executions" ON workflow_executions FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for affiliates
CREATE POLICY "Users can view own affiliate data" ON affiliates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own affiliate data" ON affiliates FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Affiliates can view their referrals" ON referrals FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM affiliates WHERE affiliates.id = referrals.affiliate_id AND affiliates.user_id = auth.uid()
  )
);

-- Admin access policies (for platform management)
CREATE POLICY "Admin can manage platform config" ON platform_config FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.email = 'ponch@chivito.ai'
  )
);

CREATE POLICY "Admin can manage white label requests" ON white_label_requests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.email = 'ponch@chivito.ai'
  )
);

CREATE POLICY "Admin can manage clone requests" ON clone_requests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.email = 'ponch@chivito.ai'
  )
);

-- Functions for affiliate system
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CHV-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Function to create affiliate when user signs up
CREATE OR REPLACE FUNCTION create_affiliate_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Create affiliate record for new user
  INSERT INTO affiliates (user_id, affiliate_code)
  VALUES (NEW.user_id, generate_affiliate_code());
  
  -- Check if they were referred
  IF NEW.referral_code IS NOT NULL THEN
    -- Find the affiliate who referred them
    INSERT INTO referrals (affiliate_id, referred_user_id, referral_code)
    SELECT a.id, NEW.user_id, NEW.referral_code
    FROM affiliates a
    WHERE a.affiliate_code = NEW.referral_code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create affiliate on user profile creation
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION create_affiliate_on_signup();

-- Function to reset daily limits
CREATE OR REPLACE FUNCTION reset_daily_limits()
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET daily_limits_reset = timezone('utc'::text, now()),
      usage_stats = JSONB_SET(
        usage_stats,
        ARRAY[TO_CHAR(NOW(), 'YYYY-MM-DD')],
        '{"workflows": 0, "emails": 0, "ai_requests": 0, "storage_mb": 0}'::jsonb
      )
  WHERE daily_limits_reset < timezone('utc'::text, now()) - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_contacts_user_id ON user_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_contacts_email ON user_contacts(email);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);

-- Initial platform configuration
INSERT INTO platform_config (config_key, config_value) VALUES 
('platform_status', '{"is_platform_paused": false, "pause_reason": null, "paused_at": null, "paused_by": null, "emergency_mode": false}'::jsonb)
ON CONFLICT (config_key) DO NOTHING;

-- Insert default usage limits configuration
INSERT INTO platform_config (config_key, config_value) VALUES 
('usage_limits', '{
  "free_trial": {
    "workflows_per_day": 5,
    "emails_per_day": 10,
    "ai_requests_per_day": 20,
    "storage_mb": 50
  },
  "professional": {
    "workflows_per_day": 100,
    "emails_per_day": 500,
    "ai_requests_per_day": 1000,
    "storage_mb": 1000
  },
  "enterprise": {
    "workflows_per_day": 1000,
    "emails_per_day": 5000,
    "ai_requests_per_day": 10000,
    "storage_mb": 10000
  }
}'::jsonb)
ON CONFLICT (config_key) DO NOTHING;

-- Insert affiliate commission rates
INSERT INTO platform_config (config_key, config_value) VALUES 
('affiliate_config', '{
  "commission_rates": {
    "professional": 59.40,
    "enterprise": 139.40
  },
  "payout_threshold": 100.00,
  "payout_schedule": "monthly"
}'::jsonb)
ON CONFLICT (config_key) DO NOTHING;