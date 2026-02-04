import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikfioqvjrhquiyeylmsv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmlvcXZqcmhxdWl5ZXlsbXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgzNDcxNywiZXhwIjoyMDY2NDEwNzE3fQ.iaOMfUDY_FUfnRsjlGSkRNxi4mJj3hYbwvFUmXYfyMI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspectTable() {
  console.log('🔍 Inspecting ai_edugame table...\n')

  // Try to select all without specifying columns
  const { data, error } = await supabase
    .from('ai_edugame')
    .select('*')
    .limit(5)

  if (error) {
    console.log('❌ Error:', error.message)
    console.log('Full error:', error)
  } else {
    console.log('✅ Query successful!')
    console.log('Data:', JSON.stringify(data, null, 2))

    if (data && data.length > 0) {
      console.log('\n📋 Detected columns:')
      const columns = Object.keys(data[0])
      columns.forEach((col, i) => {
        console.log(`  ${i + 1}. ${col}`)
      })
    } else {
      console.log('\nℹ️  Table is empty (0 rows)')
      console.log('Cannot detect columns from empty table')
    }
  }

  // Try to get schema from Supabase REST API OpenAPI endpoint
  console.log('\n\n🔍 Checking OpenAPI schema...\n')

  try {
    const schemaResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      }
    })

    if (schemaResponse.ok) {
      const schema = await schemaResponse.json()

      if (schema.definitions && schema.definitions.ai_edugame) {
        console.log('✅ Found ai_edugame schema!')
        console.log(JSON.stringify(schema.definitions.ai_edugame, null, 2))
      } else {
        console.log('❌ ai_edugame not found in schema definitions')
        console.log('Available tables:', Object.keys(schema.definitions || {}))
      }
    } else {
      console.log('❌ Could not fetch OpenAPI schema')
      console.log('Status:', schemaResponse.status)
    }
  } catch (error: any) {
    console.log('❌ Error fetching schema:', error.message)
  }

  console.log('\n✅ Inspection complete!')
}

inspectTable()
