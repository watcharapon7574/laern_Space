import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikfioqvjrhquiyeylmsv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmlvcXZqcmhxdWl5ZXlsbXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgzNDcxNywiZXhwIjoyMDY2NDEwNzE3fQ.iaOMfUDY_FUfnRsjlGSkRNxi4mJj3hYbwvFUmXYfyMI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTableSchema() {
  console.log('🔍 Checking ai_edugame table schema...\n')

  // Use REST API to query information_schema
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'params=single-object'
        },
        body: JSON.stringify({
          query: `
            SELECT
              column_name,
              data_type,
              udt_name,
              is_nullable,
              column_default,
              character_maximum_length
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'ai_edugame'
            ORDER BY ordinal_position;
          `
        })
      }
    )

    if (!response.ok) {
      console.log('❌ exec_sql not available, trying alternative method...\n')

      // Alternative: Query pg_catalog
      const altResponse = await fetch(
        `${supabaseUrl}/rest/v1/rpc/exec_sql`,
        {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              SELECT
                a.attname as column_name,
                pg_catalog.format_type(a.atttypid, a.atttypmod) as data_type,
                a.attnotnull as not_null,
                pg_get_expr(d.adbin, d.adrelid) as column_default
              FROM pg_catalog.pg_attribute a
              LEFT JOIN pg_catalog.pg_attrdef d ON (a.attrelid = d.adrelid AND a.attnum = d.adnum)
              WHERE a.attrelid = 'public.ai_edugame'::regclass
                AND a.attnum > 0
                AND NOT a.attisdropped
              ORDER BY a.attnum;
            `
          })
        }
      )

      if (altResponse.ok) {
        const data = await altResponse.json()
        console.log('✅ Table schema (pg_catalog method):')
        console.log(JSON.stringify(data, null, 2))
      } else {
        console.log('❌ Alternative method also failed')
        console.log('Response status:', altResponse.status)
        console.log('Response:', await altResponse.text())
      }
    } else {
      const data = await response.json()
      console.log('✅ Table schema (information_schema):')
      console.log(JSON.stringify(data, null, 2))
    }
  } catch (error: any) {
    console.log('❌ Error:', error.message)
  }

  // Also try direct table query to see what columns exist
  console.log('\n\n🔍 Trying to insert test data to validate schema...\n')

  const { data: testInsert, error: insertError } = await supabase
    .from('ai_edugame')
    .insert({
      slug: 'test-schema-check',
      title: 'Test Schema',
      url: 'https://loveable.dev/test',
      category: 'MATH',
      tags: '[]',
      status: 'PENDING',
    })
    .select()

  if (insertError) {
    console.log('❌ Insert error:', insertError.message)
    console.log('Details:', insertError)
  } else {
    console.log('✅ Test insert successful!')
    console.log('Inserted data:', JSON.stringify(testInsert, null, 2))

    // Delete test data
    await supabase
      .from('ai_edugame')
      .delete()
      .eq('slug', 'test-schema-check')

    console.log('🗑️  Test data cleaned up')
  }

  console.log('\n✅ Schema check complete!')
}

checkTableSchema()
