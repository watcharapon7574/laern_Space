import { PrismaClient } from '@prisma/client'

const projectRef = 'ikfioqvjrhquiyeylmsv'
const password = 'E86nrtx5ZTU248Zr'

const connections = [
  {
    name: 'Direct Connection (Transaction Mode)',
    url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
  },
  {
    name: 'Direct Connection with SSL',
    url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`,
  },
  {
    name: 'Connection Pooler (Session Mode) with pgbouncer',
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
  },
  {
    name: 'Connection Pooler (Transaction Mode)',
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  },
  {
    name: 'Direct Connection with connection_limit',
    url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres?connection_limit=1`,
  },
]

async function testConnection(name: string, url: string): Promise<boolean> {
  console.log(`\n🔍 Testing: ${name}`)
  console.log(`   URL: ${url.replace(password, '***')}`)

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: { url }
      },
      log: []
    })

    // Try to query
    const count = await prisma.media.count()
    console.log(`   ✅ SUCCESS! Found ${count} records`)

    await prisma.$disconnect()
    return true
  } catch (error: any) {
    console.log(`   ❌ FAILED: ${error.message.split('\n')[0]}`)
    return false
  }
}

async function testAllConnections() {
  console.log('🚀 Testing all possible Prisma connection strings...\n')
  console.log('=' .repeat(70))

  let successCount = 0
  let workingConnection: string | null = null

  for (const conn of connections) {
    const success = await testConnection(conn.name, conn.url)
    if (success) {
      successCount++
      workingConnection = conn.url
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log(`\n📊 Results: ${successCount}/${connections.length} connections working\n`)

  if (workingConnection) {
    console.log('✅ SUCCESS! Found working connection:\n')
    console.log(workingConnection)
    console.log('\n📝 Copy this to your .env file as DATABASE_URL')
  } else {
    console.log('❌ No working connections found.')
    console.log('\n💡 Please check:')
    console.log('   1. Database password is correct')
    console.log('   2. Database is running in Supabase')
    console.log('   3. Firewall/network allows connection')
    console.log('   4. Go to Supabase Dashboard → Settings → Database')
    console.log('      and copy the exact connection string')
  }
}

testAllConnections()
