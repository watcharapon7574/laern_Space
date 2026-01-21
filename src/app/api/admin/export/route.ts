import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'

    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    })

    if (format === 'json') {
      return NextResponse.json({
        exportedAt: new Date().toISOString(),
        totalRecords: media.length,
        data: media,
      })
    }

    // CSV format
    const headers = [
      'ID',
      'Title',
      'Slug',
      'URL',
      'Category',
      'Status',
      'Tags',
      'View Count',
      'Play Count',
      'Submitted By',
      'Created At',
      'Updated At',
    ]

    const rows = media.map((m) => [
      m.id,
      `"${m.title.replace(/"/g, '""')}"`,
      m.slug,
      m.url,
      m.category,
      m.status,
      `"${m.tags.replace(/"/g, '""')}"`,
      m.viewCount.toString(),
      m.playCount.toString(),
      m.submittedBy || '',
      m.createdAt.toISOString(),
      m.updatedAt.toISOString(),
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="media-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}
