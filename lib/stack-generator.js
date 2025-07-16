// CHIVITO AI - Stack Generator for White Label Feature
// Generates deployment-ready stack configurations

export function generateStackConfig(userId, customizations = {}) {
  const timestamp = new Date().toISOString();
  
  const stackConfig = {
    version: "1.0.0",
    generated_at: timestamp,
    user_id: userId,
    customizations: customizations,
    
    // Basic stack configuration
    stack: {
      name: customizations.name || "CHIVITO AI Clone",
      description: customizations.description || "AI Business Automation Platform",
      branding: {
        primary_color: customizations.primary_color || "#DC2626",
        secondary_color: customizations.secondary_color || "#000000",
        logo_url: customizations.logo_url || "/crown.svg",
        company_name: customizations.company_name || "CHIVITO AI"
      },
      features: {
        ai_assistant: true,
        email_automation: true,
        workflow_hub: true,
        analytics: true,
        stripe_integration: true,
        supabase_integration: true
      }
    },
    
    // Deployment configuration
    deployment: {
      platform: "vercel",
      domain: customizations.domain || null,
      environment: "production",
      auto_deploy: true
    },
    
    // Required environment variables template
    environment_variables: {
      OPENAI_API_KEY: "your-openai-key",
      SUPABASE_URL: "your-supabase-url",
      SUPABASE_ANON_KEY: "your-supabase-anon-key",
      STRIPE_SECRET_KEY: "your-stripe-secret-key",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "your-stripe-publishable-key",
      EMAIL_SNEEK_API_KEY: "your-email-sneek-key",
      N8N_API_KEY: "your-n8n-key"
    }
  };
  
  return stackConfig;
}

export function generateDeploymentInstructions(stackConfig) {
  return {
    title: "CHIVITO AI Clone Deployment Instructions",
    steps: [
      {
        step: 1,
        title: "Clone Repository",
        description: "Clone the CHIVITO AI repository to your local machine",
        command: "git clone https://github.com/chivito-ai/stack-template.git"
      },
      {
        step: 2,
        title: "Install Dependencies",
        description: "Install all required dependencies",
        command: "cd stack-template && yarn install"
      },
      {
        step: 3,
        title: "Environment Setup",
        description: "Configure your environment variables",
        details: "Copy .env.example to .env.local and fill in your API keys"
      },
      {
        step: 4,
        title: "Deploy to Vercel",
        description: "Deploy your application to Vercel",
        command: "vercel --prod"
      },
      {
        step: 5,
        title: "Configure Domain",
        description: "Set up your custom domain (optional)",
        details: "Configure your domain in Vercel dashboard"
      }
    ],
    estimated_time: "15-30 minutes",
    support_email: "support@chivito.ai"
  };
}

export function generateStackArchitecture() {
  return {
    title: "CHIVITO AI Stack Architecture",
    components: {
      frontend: {
        framework: "Next.js 14",
        styling: "Tailwind CSS",
        ui_components: "Headless UI",
        animations: "Framer Motion"
      },
      backend: {
        api_routes: "Next.js API Routes",
        database: "Supabase (PostgreSQL)",
        authentication: "Supabase Auth",
        file_storage: "Supabase Storage"
      },
      integrations: {
        ai_models: "OpenAI GPT-4o",
        payments: "Stripe",
        email_automation: "Email Sneek",
        workflow_automation: "n8n",
        analytics: "Built-in Analytics"
      },
      deployment: {
        hosting: "Vercel",
        domain: "Custom Domain",
        ssl: "Automatic SSL",
        cdn: "Global CDN"
      }
    }
  };
}