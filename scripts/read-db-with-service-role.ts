import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikfioqvjrhquiyeylmsv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmlvcXZqcmhxdWl5ZXlsbXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgzNDcxNywiZXhwIjoyMDY2NDEwNzE3fQ.iaOMfUDY_FUfnRsjlGSkRNxi4mJj3hYbwvFUmXYfyMI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function readDatabaseStructure() {
  console.log('🔍 Reading ai_edugame table structure with service_role...\n')

  // Query table structure
  const { data: columns, error: columnsError } = await supabase
    .rpc('exec_sql', {
      sql: `
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
    })

  if (columnsError) {
    console.log('ℹ️  exec_sql function not available, trying direct query...\n')

    // Try getting sample data to infer structure
    const { data: sampleData, error: fetchError } = await supabase
      .from('ai_edugame')
      .select('*')
      .limit(5)

    if (fetchError) {
      console.log('❌ Error:', fetchError.message)
      console.log('\nTable might not exist or might have different name.')

      // List all tables
      console.log('\n📊 Attempting to list all tables...\n')
      return
    }

    if (sampleData && sampleData.length > 0) {
      console.log('✅ Found data in ai_edugame table!\n')
      console.log('📋 Columns detected from sample data:')
      console.log('═'.repeat(80))

      const firstRow = sampleData[0]
      const columnNames = Object.keys(firstRow)

      columnNames.forEach((colName, index) => {
        const value = firstRow[colName]
        const valueType = value === null ? 'null' : typeof value
        const sampleValue = JSON.stringify(value)?.substring(0, 60)

        console.log(`${(index + 1).toString().padStart(2, ' ')}. ${colName.padEnd(20, ' ')} | Type: ${valueType.padEnd(10, ' ')} | Sample: ${sampleValue}`)
      })

      console.log('═'.repeat(80))
      console.log(`\n📊 Total columns: ${columnNames.length}`)
      console.log(`📊 Total rows in sample: ${sampleData.length}`)

      // Show all sample data
      console.log('\n📄 Sample data (first 5 rows):')
      console.log(JSON.stringify(sampleData, null, 2))
    } else {
      console.log('ℹ️  Table ai_edugame exists but is empty (0 rows)')
      console.log('\nℹ️  Cannot determine structure from empty table.')
      console.log('Please run this SQL to see structure:')
      console.log('─'.repeat(70))
      console.log(`
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'ai_edugame'
ORDER BY ordinal_position;
      `)
      console.log('─'.repeat(70))
    }
  } else {
    console.log('✅ Table structure:')
    console.log(JSON.stringify(columns, null, 2))
  }

  // Count total rows
  const { count, error: countError } = await supabase
    .from('ai_edugame')
    .select('*', { count: 'exact', head: true })

  if (!countError) {
    console.log(`\n📊 Total rows in ai_edugame: ${count}`)
  }

  console.log('\n✅ Done!')
}

readDatabaseStructure()
