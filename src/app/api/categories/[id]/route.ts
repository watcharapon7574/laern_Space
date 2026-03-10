import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { label, color, cssClass, sortOrder } = body

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const data: Record<string, string | number> = {}
    if (label !== undefined) {
      data.label = label
      data.slug = label.toLowerCase().replace(/\s+/g, '-')
      data.key = label.toUpperCase().replace(/\s+/g, '_')
    }
    if (color !== undefined) data.color = color
    if (cssClass !== undefined) data.cssClass = cssClass
    if (sortOrder !== undefined) data.sortOrder = sortOrder

    const category = await prisma.category.update({
      where: { id },
      data,
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if any media uses this category
    const mediaCount = await prisma.media.count({
      where: { categoryId: id },
    })

    if (mediaCount > 0) {
      return NextResponse.json(
        { error: `ไม่สามารถลบได้ มีสื่อ ${mediaCount} รายการใช้หมวดหมู่นี้อยู่` },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
