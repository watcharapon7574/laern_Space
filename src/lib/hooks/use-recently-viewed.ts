'use client'

import { useLocalStorage } from './use-local-storage'

interface RecentlyViewedMedia {
  id: string
  slug: string
  title: string
  thumbnail?: string | null
  category: string
  viewedAt: number
}

const MAX_RECENT_ITEMS = 20

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<RecentlyViewedMedia[]>(
    'recently-viewed',
    []
  )

  const addToRecentlyViewed = (media: Omit<RecentlyViewedMedia, 'viewedAt'>) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== media.id)
      const newItem = { ...media, viewedAt: Date.now() }
      const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS)
      return updated
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  }
}
