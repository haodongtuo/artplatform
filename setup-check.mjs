import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mymezahwaaxunxaxqshe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc2MDA0MywiZXhwIjoyMDg5MzM2MDQzfQ.0SB5YsHu53hh61BV2izACCGwU4UBMcFJHKk6KzEsSOU'
)

async function setup() {
  const { data, error } = await supabase.from('art_artists').select('count').limit(1)
  if (error && error.code === '42P01') {
    console.log('TABLE_MISSING: art_artists')
  } else if (error) {
    console.log('ERROR:', error.message, error.code)
  } else {
    console.log('TABLE_EXISTS: art_artists')
  }
  
  const { error: e2 } = await supabase.from('art_works').select('count').limit(1)
  if (e2 && e2.code === '42P01') {
    console.log('TABLE_MISSING: art_works')
  } else if (!e2) {
    console.log('TABLE_EXISTS: art_works')
  }
}

setup().catch(console.error)
