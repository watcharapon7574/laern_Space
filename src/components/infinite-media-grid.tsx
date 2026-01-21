'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { MediaCard } from '@/components/media-card'
import { Loader2 } from 'lucide-react'
import { Category } from '@prisma/client'

interface Media {
  id: string
  slug: string
  title: string
  url: string
  thumbnail?: string | null
  description?: string | null
  category: Category
  tags: string
  viewCount: number
  playCount: number
  createdAt: string
}

interface InfiniteMediaGridProps {
  initialMedia?: Media[]
  category?: string
  query?: string
  tag?: string
  emptyMessage?: string
}

export function InfiniteMediaGrid({
  initialMedia = [],
  category,
  query,
  tag,
  emptyMessage = 'ไม่พบสื่อการสอน',
}: InfiniteMediaGridProps) {
  const [media, setMedia] = useState<Media[]>(initialMedia)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoading, setInitialLoading] = useState(initialMedia.length === 0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const fetchMedia = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (loading) return

    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', pageNum.toString())
      params.append('limit', '12')
      if (category) params.append('category', category)
      if (query) params.append('q', query)
      if (tag) params.append('tag', tag)

      const response = await fetch(`/api/media?${params.toString()}`)
      const data = await response.json()

      const newMedia = data.media || []
      const pagination = data.pagination

      if (reset) {
        setMedia(newMedia)
      } else {
        setMedia((prev) => [...prev, ...newMedia])
      }

      setHasMore(pageNum < pagination.pages)
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [category, query, tag, loading])

  useEffect(() => {
    setMedia([])
    setPage(1)
    setHasMore(true)
    setInitialLoading(true)
    fetchMedia(1, true)
  }, [category, query, tag])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !initialLoading) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchMedia(nextPage)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, page, fetchMedia, initialLoading])

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {media.map((item) => (
          <MediaCard
            key={item.id}
            id={item.id}
            slug={item.slug}
            title={item.title}
            url={item.url}
            thumbnail={item.thumbnail}
            description={item.description}
            category={item.category}
            tags={JSON.parse(item.tags || '[]')}
            viewCount={item.viewCount}
            playCount={item.playCount}
            createdAt={new Date(item.createdAt)}
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>กำลังโหลดเพิ่มเติม...</span>
          </div>
        )}
        {!hasMore && media.length > 0 && (
          <p className="text-muted-foreground text-sm">แสดงทั้งหมดแล้ว</p>
        )}
      </div>
    </div>
  )
}
