// Environment configuration for CHIVITO AI
// This file ensures all environment variables are properly loaded

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
  'EMAIL_SNEEK_API_KEY',
  'N8N_API_KEY',
  'NEXTAUTH_SECRET'
];

// Check for missing environment variables
export function validateEnvironment() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }
  
  console.log('✅ All required environment variables are present');
  return true;
}

// Get environment variable with fallback
export function getEnvVar(name, fallback = null) {
  const value = process.env[name];
  if (!value && !fallback) {
    console.warn(`Environment variable ${name} is not set`);
  }
  return value || fallback;
}

// Supabase configuration
export const supabaseConfig = {
  url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceKey: getEnvVar('SUPABASE_SERVICE_KEY')
};

// API configuration
export const apiConfig = {
  openai: getEnvVar('OPENAI_API_KEY'),
  stripe: getEnvVar('STRIPE_SECRET_KEY'),
  emailSneek: getEnvVar('EMAIL_SNEEK_API_KEY'),
  n8n: getEnvVar('N8N_API_KEY'),
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET')
};

// Initialize environment check
if (typeof window === 'undefined') {
  // Server-side only
  validateEnvironment();
}