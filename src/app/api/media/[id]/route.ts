import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug, isAllowedDomain } from '@/lib/utils'
import { Category } from '@prisma/client'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params

    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // ตรวจสอบ authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const { title, url, description, category, tags, thumbnail } = body

    const existingMedia = await prisma.media.findUnique({
      where: { id },
    })

    if (!existingMedia) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    const updates: any = {}

    if (title && title !== existingMedia.title) {
      const newSlug = createSlug(title)
      const slugExists = await prisma.media.findFirst({
        where: {
          slug: newSlug,
          id: { not: id }
        },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Title already exists' },
          { status: 409 }
        )
      }

      updates.title = title
      updates.slug = newSlug
    }

    if (url) {
      if (!isAllowedDomain(url)) {
        return NextResponse.json(
          { error: 'Domain not allowed' },
          { status: 400 }
        )
      }
      updates.url = url
    }

    if (description !== undefined) {
      updates.description = description || null
    }

    if (category) {
      if (!Object.values(Category).includes(category)) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        )
      }
      updates.category = category
    }

    if (tags !== undefined) {
      updates.tags = JSON.stringify(tags)
    }

    if (thumbnail !== undefined) {
      updates.thumbnail = thumbnail || null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingMedia)
    }

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json(updatedMedia)
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ตรวจสอบ authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const existingMedia = await prisma.media.findUnique({
      where: { id },
    })

    if (!existingMedia) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    await prisma.media.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}
