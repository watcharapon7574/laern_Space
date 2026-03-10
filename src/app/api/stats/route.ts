import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MediaStatus } from '@prisma/client'

export async function GET() {
  try {
    const [stats, categoryCount] = await Promise.all([
      prisma.media.aggregate({
        where: { status: MediaStatus.APPROVED },
        _sum: { viewCount: true, playCount: true, likeCount: true },
        _count: { id: true },
      }),
      prisma.category.count(),
    ])

    return NextResponse.json(
      {
        totalMedia: stats._count.id,
        totalViews: stats._sum.viewCount || 0,
        totalPlays: stats._sum.playCount || 0,
        totalLikes: stats._sum.likeCount || 0,
        totalCategories: categoryCount,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching public stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
