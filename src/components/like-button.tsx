'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/utils'

interface LikeButtonProps {
  mediaId: string
  initialLikeCount: number
  variant?: 'icon' | 'default'
  showCount?: boolean
  className?: string
}

export function LikeButton({
  mediaId,
  initialLikeCount,
  variant = 'icon',
  showCount = true,
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/media/${mediaId}/like`)
      .then((res) => res.json())
      .then((data) => setLiked(data.liked))
      .catch(() => {})
  }, [mediaId])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    const wasLiked = liked
    const prevCount = likeCount

    // Optimistic update
    setLiked(!wasLiked)
    setLikeCount(wasLiked ? prevCount - 1 : prevCount + 1)
    setLoading(true)

    try {
      const res = await fetch(`/api/media/${mediaId}/like`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setLiked(data.liked)
    } catch {
      // Revert on failure
      setLiked(wasLiked)
      setLikeCount(prevCount)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn(
          'flex items-center gap-1 transition-all hover:scale-110',
          className
        )}
        title={liked ? 'เอาถูกใจออก' : 'ถูกใจ'}
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors',
            liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
          )}
        />
        {showCount && (
          <span className={cn('text-sm', liked ? 'text-red-500' : 'text-muted-foreground')}>
            {formatNumber(likeCount)}
          </span>
        )}
      </button>
    )
  }

  return (
    <Button
      variant={liked ? 'default' : 'outline'}
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        liked && 'bg-red-500 hover:bg-red-600 text-white border-red-500',
        className
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 mr-2',
          liked && 'fill-white'
        )}
      />
      {liked ? 'ถูกใจแล้ว' : 'ถูกใจ'}
      {showCount && (
        <span className="ml-1">({formatNumber(likeCount)})</span>
      )}
    </Button>
  )
}
