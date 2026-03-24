import { NextResponse } from 'next/server'
import { isAuthenticated, generateDailyConsentCode } from '@/lib/auth'

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const code = generateDailyConsentCode()

    return NextResponse.json({ code })
  } catch (error) {
    console.error('Error generating consent code:', error)
    return NextResponse.json(
      { error: 'Failed to generate consent code' },
      { status: 500 }
    )
  }
}
