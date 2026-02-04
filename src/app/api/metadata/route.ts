import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { fetchMetadata, isAllowedDomain } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบ authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!isAllowedDomain(url)) {
      return NextResponse.json(
        { error: 'Domain not allowed' },
        { status: 400 }
      )
    }

    const metadata = await fetchMetadata(url)

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    )
  }
}
