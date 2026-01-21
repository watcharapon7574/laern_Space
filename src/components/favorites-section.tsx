'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useFavorites } from '@/lib/hooks'
import { Heart, Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const categoryLabels: Record<string, string> = {
  GAME: 'เกม',
  SCIENCE: 'วิทยาศาสตร์',
  MATH: 'คณิต',
  THAI: 'ภาษาไทย',
  ENGLISH: 'ภาษาอังกฤษ',
  SOCIAL: 'สังคม',
  OTHER: 'อื่น ๆ',
}

export function FavoritesSection() {
  const { favorites, removeFavorite } = useFavorites()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || favorites.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-red-500" />
        <h2 className="text-xl font-bold">รายการโปรด</h2>
        <Badge variant="secondary">{favorites.length}</Badge>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
        {favorites.map((media) => (
          <div key={media.id} className="flex-shrink-0 w-48 group relative">
            <Link href={`/media/${media.slug}`}>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-2">
                {media.thumbnail ? (
                  <Image
                    src={media.thumbnail}
                    alt={media.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="192px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Play className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {media.title}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {categoryLabels[media.category] || media.category}
              </Badge>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                removeFavorite(media.id)
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-card/90 hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="ลบออกจากรายการโปรด"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
