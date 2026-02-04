import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikfioqvjrhquiyeylmsv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmlvcXZqcmhxdWl5ZXlsbXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgzNDcxNywiZXhwIjoyMDY2NDEwNzE3fQ.iaOMfUDY_FUfnRsjlGSkRNxi4mJj3hYbwvFUmXYfyMI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function findConnectionInfo() {
  console.log('🔍 Finding correct connection string for Prisma...\n')

  // Extract project ref from URL
  const projectRef = 'ikfioqvjrhquiyeylmsv'
  const password = 'E86nrtx5ZTU248Zr'

  console.log('📋 Your Supabase project info:')
  console.log(`   Project Ref: ${projectRef}`)
  console.log(`   Password: ${password}\n`)

  console.log('🔗 Possible connection strings:\n')

  const connections = [
    {
      name: 'Direct Connection (Transaction Mode)',
      url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
      description: 'Use for migrations and long-running transactions'
    },
    {
      name: 'Connection Pooler (Session Mode)',
      url: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
      description: 'Use for serverless/Prisma (with pgbouncer flag)'
    },
    {
      name: 'Connection Pooler (Transaction Mode)',
      url: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
      description: 'Alternative pooler connection'
    },
    {
      name: 'IPv4 Direct (Alternative)',
      url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`,
      description: 'Direct with SSL mode specified'
    },
  ]

  connections.forEach((conn, index) => {
    console.log(`${index + 1}. ${conn.name}`)
    console.log(`   ${conn.description}`)
    console.log(`   URL: ${conn.url}\n`)
  })

  console.log('📝 Next steps:')
  console.log('1. Go to Supabase Dashboard: Settings → Database')
  console.log('2. Look for "Connection string" section')
  console.log('3. You should see either:')
  console.log('   - URI (Direct connection)')
  console.log('   - Connection pooling (Pooler)')
  console.log('4. Copy the EXACT connection string and tell me\n')

  console.log('💡 Or we can try all of them automatically!')
}

findConnectionInfo()
