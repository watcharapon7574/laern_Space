import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashIP } from '@/lib/utils'

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // 5 views per minute per IP
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(ipHash: string): boolean {
  const now = Date.now()
  const current = rateLimiter.get(ipHash)
  
  if (!current || now > current.resetTime) {
    rateLimiter.set(ipHash, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  
  if (current.count >= RATE_LIMIT) {
    return false
  }
  
  current.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mediaId, type = 'view' } = body

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      )
    }

    // Get IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1'
    const ipHash = hashIP(ip)

    // Check rate limit
    if (!checkRateLimit(ipHash)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Check if media exists
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      select: { id: true },
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    // For view tracking: Check if this IP has viewed this media in the last hour (to prevent spam)
    if (type === 'view') {
      const recentView = await prisma.viewEvent.findFirst({
        where: {
          mediaId,
          ipHash,
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          },
        },
      })

      if (recentView) {
        return NextResponse.json({ success: true, tracked: false })
      }

      // Create view event
      await prisma.viewEvent.create({
        data: {
          mediaId,
          ipHash,
        },
      })
    }

    // Update count (view or play)
    const updateField = type === 'play' ? 'playCount' : 'viewCount'
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        [updateField]: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true, tracked: true })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    )
  }
}

// Clean up old rate limiter entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimiter.entries()) {
    if (now > value.resetTime) {
      rateLimiter.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes