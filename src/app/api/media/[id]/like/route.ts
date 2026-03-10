import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashIP } from '@/lib/utils'

// Simple in-memory rate limiter for likes
const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000

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

function getIpHash(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
  return hashIP(ip)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mediaId } = await params
    const ipHash = getIpHash(request)

    const existingLike = await prisma.mediaLike.findUnique({
      where: { mediaId_ipHash: { mediaId, ipHash } },
    })

    return NextResponse.json({ liked: !!existingLike })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json({ liked: false })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mediaId } = await params
    const ipHash = getIpHash(request)

    if (!checkRateLimit(ipHash)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Verify media exists
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

    // Toggle: check if already liked
    const existingLike = await prisma.mediaLike.findUnique({
      where: { mediaId_ipHash: { mediaId, ipHash } },
    })

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.mediaLike.delete({ where: { id: existingLike.id } }),
        prisma.media.update({
          where: { id: mediaId },
          data: { likeCount: { decrement: 1 } },
        }),
      ])
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.$transaction([
        prisma.mediaLike.create({ data: { mediaId, ipHash } }),
        prisma.media.update({
          where: { id: mediaId },
          data: { likeCount: { increment: 1 } },
        }),
      ])
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

// Clean up old rate limiter entries
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimiter.entries()) {
    if (now > value.resetTime) {
      rateLimiter.delete(key)
    }
  }
}, 5 * 60 * 1000)
