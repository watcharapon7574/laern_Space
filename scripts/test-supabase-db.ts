import { mediaQueries } from '../src/lib/supabase-db'

async function testSupabaseDB() {
  console.log('🔍 Testing Supabase DB connection...\n')

  try {
    // Test: Get popular media
    console.log('1. Testing getPopular()...')
    const popular = await mediaQueries.getPopular(3)
    console.log(`✅ Found ${popular.length} popular media items\n`)

    if (popular.length > 0) {
      console.log('📋 Sample data:')
      popular.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.title}`)
        console.log(`   - ID: ${item.id}`)
        console.log(`   - Category: ${item.category}`)
        console.log(`   - Status: ${item.status}`)
        console.log(`   - Views: ${item.view_count}`)
      })
    }

    // Test: Get all approved
    console.log('\n\n2. Testing getApproved()...')
    const approved = await mediaQueries.getApproved()
    console.log(`✅ Found ${approved.length} approved media items\n`)

    // Test: Get pending (should be 0 or some)
    console.log('3. Testing getPending()...')
    const pending = await mediaQueries.getPending()
    console.log(`✅ Found ${pending.length} pending media items\n`)

    console.log('✅ All tests passed! Supabase connection working perfectly! 🎉')
  } catch (error: any) {
    console.error('❌ Test failed!')
    console.error('Error:', error.message)
    console.error('\nFull error:', error)
  }
}

testSupabaseDB()
