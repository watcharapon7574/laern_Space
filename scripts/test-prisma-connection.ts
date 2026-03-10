import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Testing Prisma connection to Supabase...\n')

  try {
    // Test connection by counting records
    const count = await prisma.media.count()
    console.log(`✅ Connection successful!`)
    console.log(`📊 Total media records: ${count}\n`)

    // Fetch sample data
    const media = await prisma.media.findMany({
      take: 3,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })

    console.log('📋 Sample data (first 3 records):')
    media.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.title}`)
      console.log(`   - ID: ${item.id}`)
      console.log(`   - Slug: ${item.slug}`)
      console.log(`   - Category: ${item.category?.label} (${item.categoryId})`)
      console.log(`   - Status: ${item.status}`)
      console.log(`   - Submitted by: ${item.submittedBy || 'N/A'}`)
      console.log(`   - Views: ${item.viewCount}, Plays: ${item.playCount}`)
    })

    console.log('\n✅ Prisma + Supabase working perfectly!')
  } catch (error: any) {
    console.error('❌ Connection failed!')
    console.error('Error:', error.message)
    console.error('\nFull error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
