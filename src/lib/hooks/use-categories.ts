'use client'

import { useState, useEffect } from 'react'
import type { CategoryData } from '@/lib/categories'

export function useCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const getLabel = (keyOrId: string) => {
    return categories.find(c => c.key === keyOrId || c.id === keyOrId)?.label || keyOrId
  }

  const getColor = (keyOrId: string) => {
    return categories.find(c => c.key === keyOrId || c.id === keyOrId)?.color || '#3b82f6'
  }

  const getCssClass = (keyOrId: string) => {
    return categories.find(c => c.key === keyOrId || c.id === keyOrId)?.cssClass || 'tag-color-1'
  }

  return { categories, loading, getLabel, getColor, getCssClass }
}
