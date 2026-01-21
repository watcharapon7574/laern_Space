import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikfioqvjrhquiyeylmsv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmlvcXZqcmhxdWl5ZXlsbXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzQ3MTcsImV4cCI6MjA2NjQxMDcxN30.m0RHqLl6RmM5rTN-TU3YrcvHNpSB9FnH_XN_Y3uhhRc'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function queryTableStructure() {
  console.log('🔍 Querying ai_edugame table structure...\n')

  // Using Supabase REST API to run raw SQL
  const query = `
    SELECT
      column_name,
      data_type,
      is_nullable,
      column_default,
      character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ai_edugame'
    ORDER BY ordinal_position;
  `

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    })

    if (!response.ok) {
      console.log('❌ Could not execute SQL query via REST API')
      console.log('\n📋 Please run this SQL query in Supabase SQL Editor manually:\n')
      console.log('─'.repeat(70))
      console.log(query)
      console.log('─'.repeat(70))
      console.log('\nOr go to: Table Editor → ai_edugame → Settings (⚙️) → View Schema')
      return
    }

    const data = await response.json()
    console.log('✅ Query result:', JSON.stringify(data, null, 2))
  } catch (error: any) {
    console.log('❌ Error:', error.message)
    console.log('\n📋 Please run this SQL query in Supabase SQL Editor:\n')
    console.log('─'.repeat(70))
    console.log(query)
    console.log('─'.repeat(70))
  }

  // Also try to list all tables
  console.log('\n\n🔍 Checking all tables in database...\n')

  const tablesQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: tablesQuery })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('📊 Tables in database:', JSON.stringify(data, null, 2))
    } else {
      console.log('ℹ️  Could not list tables via REST API')
    }
  } catch (error: any) {
    console.log('ℹ️  Could not list tables')
  }

  console.log('\n✅ Done!\n')
  console.log('💡 If you see errors above, please:')
  console.log('   1. Go to Supabase Dashboard')
  console.log('   2. Open SQL Editor')
  console.log('   3. Run the SQL queries shown above')
  console.log('   4. Copy the results and share with me')
}

queryTableStructure()
