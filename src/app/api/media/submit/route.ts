import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'
import { rateLimitMiddleware } from '@/lib/rate-limit'
import { Category, MediaStatus } from '@prisma/client'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function isAllowedDomain(url: string): boolean {
  const allowedDomains = (process.env.ALLOWLIST_DOMAINS || '').split(',').map((d) => d.trim())

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    return allowedDomains.some((domain) => {
      if (domain.startsWith('*.')) {
        const baseDomain = domain.slice(2)
        return hostname === baseDomain || hostname.endsWith(`.${baseDomain}`)
      }
      return hostname === domain
    })
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 submissions per minute
    const rateLimit = rateLimitMiddleware(request, { limit: 5, window: 60 * 1000 })
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'คุณส่งสื่อบ่อยเกินไป กรุณารอสักครู่' },
        { 
          status: 429,
          headers: rateLimit.headers
        }
      )
    }

    const body = await request.json()
    const { submittedBy, title, url, description, category, tags, thumbnail, pdfDocument } = body

    // Validate required fields
    if (!submittedBy || !title || !url || !category) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Validate domain
    if (!isAllowedDomain(url)) {
      return NextResponse.json(
        { error: 'URL ไม่อยู่ในรายการที่อนุญาต (loveable.dev, lovable.app เท่านั้น)' },
        { status: 400 }
      )
    }

    // Create slug
    let slug = slugify(title)

    // Check if slug exists
    const existing = await prisma.media.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    // Create media with PENDING status
    const media = await prisma.media.create({
      data: {
        slug,
        title,
        url,
        thumbnail: thumbnail || null,
        pdfDocument: pdfDocument || null,
        description: description || null,
        category: category as Category,
        tags: JSON.stringify(tags || []),
        submittedBy,
        status: MediaStatus.PENDING,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'ส่งสื่อสำเร็จ รอผู้ดูแลตรวจสอบ',
      media,
    })
  } catch (error) {
    console.error('Submit media error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการส่งสื่อ' },
      { status: 500 }
    )
  }
}
