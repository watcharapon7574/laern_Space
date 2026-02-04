import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug, fetchMetadata, isAllowedDomain } from '@/lib/utils'
import { Category, MediaStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const q = searchParams.get('q')
    const skip = (page - 1) * limit

    const where: any = {
      status: MediaStatus.APPROVED, // แสดงเฉพาะสื่อที่อนุมัติแล้ว
    }

    if (category && Object.values(Category).includes(category as Category)) {
      where.category = category
    }

    if (q) {
      where.OR = [
        { slug: { equals: q } },
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (tag) {
      where.tags = { contains: tag, mode: 'insensitive' }
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { viewCount: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.media.count({ where }),
    ])

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบ authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, url, description, category, tags } = body

    if (!title || !url || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!isAllowedDomain(url)) {
      return NextResponse.json(
        { error: 'Domain not allowed' },
        { status: 400 }
      )
    }

    if (!Object.values(Category).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const slug = createSlug(title)
    const existingMedia = await prisma.media.findUnique({
      where: { slug },
    })

    if (existingMedia) {
      return NextResponse.json(
        { error: 'Media with this title already exists' },
        { status: 409 }
      )
    }

    let thumbnail = body.thumbnail

    if (!thumbnail) {
      const metadata = await fetchMetadata(url)
      thumbnail = metadata.thumbnail
    }

    // Admin สร้างสื่อ = อนุมัติทันที
    const media = await prisma.media.create({
      data: {
        title,
        slug,
        url,
        thumbnail,
        description: description || null,
        category,
        tags: JSON.stringify(tags || []),
        status: MediaStatus.APPROVED,
        submittedBy: 'admin',
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error creating media:', error)
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    )
  }
}