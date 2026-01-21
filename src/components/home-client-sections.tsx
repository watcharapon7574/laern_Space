'use client'

import { RecentlyViewedSection } from '@/components/recently-viewed-section'
import { FavoritesSection } from '@/components/favorites-section'

export function HomeClientSections() {
  return (
    <>
      <FavoritesSection />
      <RecentlyViewedSection />
    </>
  )
}
