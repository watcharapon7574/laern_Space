import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { label, color, cssClass } = body

    if (!label) {
      return NextResponse.json({ error: 'กรุณาใส่ชื่อหมวดหมู่' }, { status: 400 })
    }

    const key = label.toUpperCase().replace(/\s+/g, '_')
    const slug = label.toLowerCase().replace(/\s+/g, '-')

    const existing = await prisma.category.findFirst({
      where: { OR: [{ key }, { slug }] },
    })

    if (existing) {
      return NextResponse.json({ error: 'หมวดหมู่นี้มีอยู่แล้ว' }, { status: 409 })
    }

    const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } })
    const nextOrder = (maxSort._max.sortOrder || 0) + 1

    const category = await prisma.category.create({
      data: {
        key,
        label,
        slug,
        color: color || '#3b82f6',
        cssClass: cssClass || 'tag-color-1',
        sortOrder: nextOrder,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
