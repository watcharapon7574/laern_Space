'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Eye, Play, ExternalLink, Calendar, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmbedFrame } from '@/components/embed-frame'
import { MediaGrid } from '@/components/media-grid'
import { FavoriteButton } from '@/components/favorite-button'
import { useRecentlyViewed } from '@/lib/hooks'
import { formatNumber } from '@/lib/utils'
import { Category } from '@prisma/client'

interface Media {
  id: string
  slug: string
  title: string
  url: string
  thumbnail?: string | null
  pdfDocument?: string | null
  description?: string | null
  category: Category
  tags: string
  viewCount: number
  playCount: number
  createdAt: string
}

const categoryLabels: Record<Category, string> = {
  GAME: 'เกม',
  SCIENCE: 'วิทยาศาสตร์', 
  MATH: 'คณิต',
  THAI: 'ภาษาไทย',
  ENGLISH: 'ภาษาอังกฤษ',
  SOCIAL: 'สังคม',
  OTHER: 'อื่น ๆ',
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function MediaDetailPage({ params }: PageProps) {
  const [media, setMedia] = useState<Media | null>(null)
  const [relatedMedia, setRelatedMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasTrackedView, setHasTrackedView] = useState(false)
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false)
  const { addToRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params
        const decodedSlug = decodeURIComponent(resolvedParams.slug)
        const response = await fetch(`/api/media?q=${encodeURIComponent(decodedSlug)}`)
        const data = await response.json()
        
        const foundMedia = data.media?.find((m: Media) => m.slug === decodedSlug)
        
        if (!foundMedia) {
          notFound()
        }
        
        setMedia(foundMedia)
        
        // Add to recently viewed
        addToRecentlyViewed({
          id: foundMedia.id,
          slug: foundMedia.slug,
          title: foundMedia.title,
          thumbnail: foundMedia.thumbnail,
          category: foundMedia.category,
        })
        
        // Track view
        if (!hasTrackedView) {
          fetch('/api/track/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mediaId: foundMedia.id, type: 'view' }),
          }).catch(console.error)
          setHasTrackedView(true)
        }
        
        // Load related media
        const relatedResponse = await fetch(`/api/media?category=${foundMedia.category}&limit=4`)
        const relatedData = await relatedResponse.json()
        setRelatedMedia(relatedData.media?.filter((m: Media) => m.id !== foundMedia.id) || [])
      } catch (error) {
        console.error('Error loading media:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [params, hasTrackedView])

  // Track play count when isPlaying becomes true
  useEffect(() => {
    if (isPlaying && media && !hasTrackedPlay) {
      fetch('/api/track/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: media.id, type: 'play' }),
      }).catch(console.error)
      setHasTrackedPlay(true)
    }
  }, [isPlaying, media, hasTrackedPlay])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-muted animate-pulse rounded" />
        <div className="h-96 bg-gray-200 dark:bg-muted animate-pulse rounded" />
        <div className="h-24 bg-gray-200 dark:bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (!media) {
    notFound()
  }

  const tags = JSON.parse(media.tags || '[]')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
          <span>→</span>
          <Link 
            href={`/categories/${media.category.toLowerCase()}`} 
            className="hover:text-blue-600"
          >
            {categoryLabels[media.category]}
          </Link>
          <span>→</span>
          <span className="text-foreground dark:text-foreground">{media.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">
              {media.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(media.viewCount)} การดู</span>
              </div>
              <div className="flex items-center space-x-1">
                <Play className="h-4 w-4" />
                <span>{formatNumber(media.playCount)} การเล่น</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(media.createdAt).toLocaleDateString('th-TH')}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handlePlay} size="lg">
              <Play className="h-5 w-5 mr-2" />
              {isPlaying ? 'กำลังเล่น' : 'เล่นสื่อ'}
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={media.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5 mr-2" />
                เปิดแท็บใหม่
              </a>
            </Button>
            <FavoriteButton
              media={{
                id: media.id,
                slug: media.slug,
                title: media.title,
                thumbnail: media.thumbnail,
                category: media.category,
              }}
            />
          </div>
        </div>
      </div>

      {/* Media Player */}
      <div className="bg-card dark:bg-card rounded-lg overflow-hidden border border-border dark:border-border">
        {isPlaying ? (
          <EmbedFrame
            url={media.url}
            title={media.title}
            thumbnail={media.thumbnail}
            className="min-h-[600px]"
          />
        ) : (
          <div 
            className="relative aspect-video bg-muted dark:bg-background flex items-center justify-center cursor-pointer group"
            onClick={handlePlay}
          >
            {media.thumbnail ? (
              <div className="relative w-full h-full">
                <img 
                  src={media.thumbnail} 
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-6 transition-colors">
                    <Play className="h-12 w-12 text-white ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-6 mb-4 inline-block transition-colors">
                  <Play className="h-12 w-12 text-white ml-1" />
                </div>
                <p className="text-muted-foreground dark:text-muted-foreground">คลิกเพื่อเล่นสื่อ</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {media.description && (
            <div>
              <h2 className="text-xl font-semibold mb-3">คำอธิบาย</h2>
              <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed">
                {media.description}
              </p>
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">แท็ก</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <Link key={index} href={`/search?q=${encodeURIComponent(tag)}`}>
                    <Badge 
                      variant="secondary" 
                      className="hover:bg-blue-100 hover:text-blue-800 cursor-pointer"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {media.pdfDocument && (
            <div>
              <h2 className="text-xl font-semibold mb-3">เอกสารแนบ</h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium">เอกสาร PDF</p>
                      <p className="text-xs text-muted-foreground">คลิกเพื่อดูเอกสาร</p>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <a href={media.pdfDocument} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      เปิด PDF
                    </a>
                  </Button>
                </div>
                <iframe
                  src={media.pdfDocument}
                  className="w-full h-96 border border-border rounded"
                  title="PDF Document"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card dark:bg-card rounded-lg p-6 border border-border dark:border-border">
            <h3 className="font-semibold mb-4">รายละเอียด</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">หมวดหมู่</dt>
                <dd className="font-medium">
                  <Badge>{categoryLabels[media.category]}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">จำนวนการดู</dt>
                <dd className="font-medium">{formatNumber(media.viewCount)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">จำนวนการเล่น</dt>
                <dd className="font-medium">{formatNumber(media.playCount)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">วันที่เพิ่ม</dt>
                <dd className="font-medium">{new Date(media.createdAt).toLocaleDateString('th-TH')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Related Media */}
      {relatedMedia.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">สื่อที่เกี่ยวข้อง</h2>
          <MediaGrid media={relatedMedia} />
        </section>
      )}
    </div>
  )
}