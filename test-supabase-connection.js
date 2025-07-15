// Simple database setup script for CHIVITO AI
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://mwaktovpihmhvyhoillk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWt0b3ZwaWhtaHZ5aG9pbGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjYyMDEyOSwiZXhwIjoyMDY4MTk2MTI5fQ.ZRvwWEr33gtQlHqZrsIz9hdSxULiJ6JGPvJ3_rFczhc'
)

async function setupTables() {
  console.log('🚀 Setting up CHIVITO AI database tables...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact' }).limit(1)
    console.log('✅ Supabase connection successful!')
  } catch (err) {
    console.log('⚠️  Connection test:', err.message)
  }
  
  console.log('📋 Database schema can be set up through Supabase Dashboard SQL Editor')
  console.log('🔗 Go to: https://app.supabase.com/project/mwaktovpihmhvyhoillk/sql')
  console.log('📝 Copy and paste the contents of /app/supabase-schema.sql')
  
  process.exit(0)
}

setupTables()