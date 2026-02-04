import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikfioqvjrhquiyeylmsv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmlvcXZqcmhxdWl5ZXlsbXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzQ3MTcsImV4cCI6MjA2NjQxMDcxN30.m0RHqLl6RmM5rTN-TU3YrcvHNpSB9FnH_XN_Y3uhhRc'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabaseStructure() {
  console.log('🔍 Checking Supabase database structure...\n')

  // Check if ai_edugame table exists and get its structure
  const { data: columns, error } = await supabase.rpc('get_table_columns', {
    table_name: 'ai_edugame'
  })

  if (error) {
    console.log('❌ Error (trying alternative method):', error.message)
    console.log('\n📊 Trying to fetch sample data from ai_edugame...\n')

    // Try to fetch sample data to see columns
    const { data: sampleData, error: fetchError } = await supabase
      .from('ai_edugame')
      .select('*')
      .limit(1)

    if (fetchError) {
      console.log('❌ Error fetching data:', fetchError.message)
      console.log('\nPlease run this SQL query in Supabase SQL Editor:')
      console.log('─'.repeat(60))
      console.log(`
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'ai_edugame'
ORDER BY ordinal_position;
      `)
      console.log('─'.repeat(60))
    } else {
      console.log('✅ Sample data fetched successfully!\n')
      console.log('📋 Columns in ai_edugame table:')
      console.log('─'.repeat(60))

      if (sampleData && sampleData.length > 0) {
        const columnNames = Object.keys(sampleData[0])
        columnNames.forEach((col, index) => {
          const value = sampleData[0][col]
          const type = typeof value
          console.log(`${index + 1}. ${col} (${type}): ${JSON.stringify(value)?.substring(0, 50)}`)
        })

        console.log('\n📊 Total columns:', columnNames.length)
        console.log('📊 Total rows:', sampleData.length)
      } else {
        console.log('ℹ️  Table exists but is empty')
        console.log('\nPlease insert at least 1 row to see the structure, or run the SQL query above.')
      }
    }
  } else {
    console.log('✅ Columns:', columns)
  }

  // Try to count total rows
  const { count, error: countError } = await supabase
    .from('ai_edugame')
    .select('*', { count: 'exact', head: true })

  if (!countError) {
    console.log('\n📊 Total rows in ai_edugame:', count)
  }

  console.log('\n✅ Done!')
}

checkDatabaseStructure()
