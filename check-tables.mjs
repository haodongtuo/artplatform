import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mymezahwaaxunxaxqshe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc2MDA0MywiZXhwIjoyMDg5MzM2MDQzfQ.0SB5YsHu53hh61BV2izACCGwU4UBMcFJHKk6KzEsSOU'
)

async function check() {
  const tables = ['art_artists', 'art_works', 'art_orders']
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('id').limit(1)
    if (error) {
      console.log('MISSING or ERROR:', t, error.code, error.message)
    } else {
      console.log('EXISTS:', t, 'rows:', data?.length)
    }
  }
}
check().catch(console.error)
