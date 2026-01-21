import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MediaStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const media = await prisma.media.findMany({
      where: {
        status: MediaStatus.APPROVED,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { tags: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        tags: true,
      },
      take: 8,
      orderBy: { viewCount: 'desc' },
    })

    const titleSuggestions = media.map((m) => ({
      type: 'media' as const,
      id: m.id,
      slug: m.slug,
      text: m.title,
      category: m.category,
    }))

    const allTags: string[] = []
    media.forEach((m) => {
      try {
        const tags = JSON.parse(m.tags || '[]')
        tags.forEach((tag: string) => {
          if (tag.toLowerCase().includes(q.toLowerCase()) && !allTags.includes(tag)) {
            allTags.push(tag)
          }
        })
      } catch {}
    })

    const tagSuggestions = allTags.slice(0, 5).map((tag) => ({
      type: 'tag' as const,
      text: tag,
    }))

    return NextResponse.json({
      suggestions: [...titleSuggestions, ...tagSuggestions],
    })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
