import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MediaStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, ids } = body

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: action and ids' },
        { status: 400 }
      )
    }

    let result: { count: number }

    switch (action) {
      case 'approve':
        result = await prisma.media.updateMany({
          where: { id: { in: ids } },
          data: { status: MediaStatus.APPROVED },
        })
        break

      case 'reject':
        result = await prisma.media.updateMany({
          where: { id: { in: ids } },
          data: { status: MediaStatus.REJECTED },
        })
        break

      case 'pending':
        result = await prisma.media.updateMany({
          where: { id: { in: ids } },
          data: { status: MediaStatus.PENDING },
        })
        break

      case 'delete':
        result = await prisma.media.deleteMany({
          where: { id: { in: ids } },
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: approve, reject, pending, or delete' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      action,
      affected: result.count,
    })
  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json({ error: 'Failed to perform bulk action' }, { status: 500 })
  }
}
