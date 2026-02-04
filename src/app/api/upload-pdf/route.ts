import { NextRequest, NextResponse } from 'next/server'
import { uploadThumbnail, getThumbnailUrl } from '@/lib/supabase-storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์ที่อัพโหลด' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'รองรับเฉพาะไฟล์ PDF' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'ไฟล์มีขนาดใหญ่เกิน 10MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.pdf`

    // Upload to Supabase Storage (using same function as thumbnails)
    const data = await uploadThumbnail(file, filename)
    
    // Get public URL
    const url = getThumbnailUrl(data.path)

    return NextResponse.json({
      success: true,
      url,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    const message = error?.message || 'เกิดข้อผิดพลาดในการอัพโหลด'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
