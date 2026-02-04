import { NextRequest, NextResponse } from 'next/server'
import { isAllowedDomain } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetUrl = searchParams.get('url')

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // ตรวจสอบว่า URL อยู่ในรายการที่อนุญาต
    if (!isAllowedDomain(targetUrl)) {
      return NextResponse.json(
        { error: 'Domain not allowed' },
        { status: 403 }
      )
    }

    try {
      // Fetch the content from the target URL
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LearnSpace/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let content = await response.text()

      // แก้ไข HTML เพื่อให้ทำงานใน iframe ได้
      content = content
        // Remove X-Frame-Options restrictions
        .replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, '')
        // Add meta tags to allow iframe embedding
        .replace(/<head[^>]*>/i, `<head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; }
            html, body { height: 100%; overflow-x: hidden; }
          </style>`)
        // Fix relative URLs
        .replace(/href=["']\/(?!\/)/g, `href="${new URL(targetUrl).origin}/`)
        .replace(/src=["']\/(?!\/)/g, `src="${new URL(targetUrl).origin}/`)
        .replace(/action=["']\/(?!\/)/g, `action="${new URL(targetUrl).origin}/`)

      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
          // Remove frame restrictions
          'X-Frame-Options': 'ALLOWALL',
          'Content-Security-Policy': 'frame-ancestors *;',
        },
      })
    } catch (fetchError) {
      console.error('Proxy fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch content from target URL' },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy server error' },
      { status: 500 }
    )
  }
}
