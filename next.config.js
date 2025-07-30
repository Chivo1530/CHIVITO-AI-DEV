/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Explicitly expose environment variables
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  // Ensure environment variables are available
  experimental: {
    serverComponentsExternalPackages: ['emergentintegrations']
  }
}

module.exports = nextConfig
