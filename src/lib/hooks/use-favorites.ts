'use client'

import { useLocalStorage } from './use-local-storage'

interface FavoriteMedia {
  id: string
  slug: string
  title: string
  thumbnail?: string | null
  category: string
  addedAt: number
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteMedia[]>('favorites', [])

  const addFavorite = (media: Omit<FavoriteMedia, 'addedAt'>) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === media.id)) {
        return prev
      }
      return [...prev, { ...media, addedAt: Date.now() }]
    })
  }

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id)
  }

  const toggleFavorite = (media: Omit<FavoriteMedia, 'addedAt'>) => {
    if (isFavorite(media.id)) {
      removeFavorite(media.id)
    } else {
      addFavorite(media)
    }
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  }
}
