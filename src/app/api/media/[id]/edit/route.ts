import { NextRequest, NextResponse } from 'next/server'
import { verifyConsentCode } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug, isAllowedDomain } from '@/lib/utils'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { consentCode, title, url, description, categoryId, tags, thumbnail, videoUrl, pdfDocument, submittedBy } = body

    if (!consentCode) {
      return NextResponse.json(
        { error: 'กรุณาใส่รหัสยืนยัน' },
        { status: 400 }
      )
    }

    if (!verifyConsentCode(consentCode)) {
      return NextResponse.json(
        { error: 'รหัสยืนยันไม่ถูกต้อง กรุณาขอรหัสใหม่จากผู้ดูแลระบบ' },
        { status: 403 }
      )
    }

    const existingMedia = await prisma.media.findUnique({
      where: { id },
    })

    if (!existingMedia) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    const updates: Record<string, string | null> = {}

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
          { error: 'ชื่อสื่อนี้มีอยู่แล้ว' },
          { status: 409 }
        )
      }

      updates.title = title
      updates.slug = newSlug
    }

    if (url !== undefined) {
      if (url && existingMedia.mediaType === 'ONLINE' && !isAllowedDomain(url)) {
        return NextResponse.json(
          { error: 'โดเมนนี้ไม่ได้รับอนุญาต' },
          { status: 400 }
        )
      }
      updates.url = url || null
    }

    if (description !== undefined) {
      updates.description = description || null
    }

    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } })
      if (!categoryExists) {
        return NextResponse.json(
          { error: 'หมวดหมู่ไม่ถูกต้อง' },
          { status: 400 }
        )
      }
      updates.categoryId = categoryId
    }

    if (tags !== undefined) {
      updates.tags = JSON.stringify(tags)
    }

    if (thumbnail !== undefined) {
      updates.thumbnail = thumbnail || null
    }

    if (videoUrl !== undefined) {
      updates.videoUrl = videoUrl || null
    }

    if (pdfDocument !== undefined) {
      updates.pdfDocument = pdfDocument || null
    }

    if (submittedBy !== undefined) {
      updates.submittedBy = submittedBy || null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingMedia)
    }

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: updates,
      include: { category: true },
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
