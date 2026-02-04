'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/lib/hooks'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  media: {
    id: string
    slug: string
    title: string
    thumbnail?: string | null
    category: string
  }
  variant?: 'default' | 'icon'
  className?: string
}

export function FavoriteButton({ media, variant = 'default', className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isActive = isFavorite(media.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(media)
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'p-2 rounded-full transition-all',
          isActive
            ? 'bg-red-100 text-red-500 hover:bg-red-200'
            : 'bg-card/80 text-muted-foreground hover:bg-card hover:text-red-500',
          className
        )}
        title={isActive ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
      >
        <Heart className={cn('h-5 w-5', isActive && 'fill-current')} />
      </button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      variant={isActive ? 'default' : 'outline'}
      className={cn(
        isActive && 'bg-red-500 hover:bg-red-600 text-white',
        className
      )}
    >
      <Heart className={cn('h-4 w-4 mr-2', isActive && 'fill-current')} />
      {isActive ? 'อยู่ในรายการโปรด' : 'เพิ่มในรายการโปรด'}
    </Button>
  )
}
