import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MediaStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'

    // Calculate date range
    let startDate = new Date()
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24)
        break
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get view events grouped by day
    const viewEvents = await prisma.viewEvent.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        mediaId: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    // Group by day
    const dailyStats: Record<string, { views: number; uniqueMedia: Set<string> }> = {}
    viewEvents.forEach((event) => {
      const day = event.createdAt.toISOString().split('T')[0]
      if (!dailyStats[day]) {
        dailyStats[day] = { views: 0, uniqueMedia: new Set() }
      }
      dailyStats[day].views++
      dailyStats[day].uniqueMedia.add(event.mediaId)
    })

    const dailyData = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      views: stats.views,
      uniqueMedia: stats.uniqueMedia.size,
    }))

    // Get category stats
    const categoryStats = await prisma.media.groupBy({
      by: ['category'],
      where: { status: MediaStatus.APPROVED },
      _count: { id: true },
      _sum: { viewCount: true, playCount: true },
    })

    const categoryData = categoryStats.map((c) => ({
      category: c.category,
      count: c._count.id,
      views: c._sum.viewCount || 0,
      plays: c._sum.playCount || 0,
    }))

    // Get top media
    const topMedia = await prisma.media.findMany({
      where: { status: MediaStatus.APPROVED },
      orderBy: { viewCount: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        viewCount: true,
        playCount: true,
      },
    })

    // Get overall stats
    const overallStats = await prisma.media.aggregate({
      where: { status: MediaStatus.APPROVED },
      _sum: { viewCount: true, playCount: true },
      _count: { id: true },
    })

    const pendingCount = await prisma.media.count({
      where: { status: MediaStatus.PENDING },
    })

    const recentViewsCount = await prisma.viewEvent.count({
      where: { createdAt: { gte: startDate } },
    })

    return NextResponse.json({
      period,
      dailyData,
      categoryData,
      topMedia,
      summary: {
        totalMedia: overallStats._count.id,
        totalViews: overallStats._sum.viewCount || 0,
        totalPlays: overallStats._sum.playCount || 0,
        pendingApproval: pendingCount,
        recentViews: recentViewsCount,
        playRate: overallStats._sum.viewCount
          ? Math.round(((overallStats._sum.playCount || 0) / overallStats._sum.viewCount) * 100)
          : 0,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
