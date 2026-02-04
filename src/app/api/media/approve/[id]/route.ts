import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { MediaStatus } from '@prisma/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update media status
    const media = await prisma.media.update({
      where: { id },
      data: { status: status as MediaStatus },
    })

    return NextResponse.json({ success: true, media })
  } catch (error) {
    console.error('Approve media error:', error)
    return NextResponse.json(
      { error: 'Failed to update media status' },
      { status: 500 }
    )
  }
}
