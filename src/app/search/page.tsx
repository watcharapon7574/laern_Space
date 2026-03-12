'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { InfiniteMediaGrid } from '@/components/infinite-media-grid'
import { SearchWithSuggestions } from '@/components/search-with-suggestions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Search } from 'lucide-react'
import { useCategories } from '@/lib/hooks/use-categories'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // URL params are the source of truth for search results
  const urlQuery = searchParams.get('q') || ''
  const urlCategory = searchParams.get('category') || ''

  // Local state for form inputs only
  const [inputQuery, setInputQuery] = useState(urlQuery)
  const [inputCategory, setInputCategory] = useState(urlCategory)
  const { categories, getLabel } = useCategories()

  // Sync URL params → form inputs when URL changes (e.g., tag click navigation)
  useEffect(() => {
    setInputQuery(urlQuery)
    setInputCategory(urlCategory)
  }, [urlQuery, urlCategory])

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery !== undefined ? searchQuery : inputQuery
    const params = new URLSearchParams()
    if (q) params.append('q', q)
    if (inputCategory) params.append('category', inputCategory)
    const url = params.toString() ? `/search?${params.toString()}` : '/search'
    router.replace(url)
  }

  const clearFilters = () => {
    setInputQuery('')
    setInputCategory('')
    router.replace('/search')
  }

  const handleCategoryChange = (newCategory: string) => {
    setInputCategory(newCategory)
    const params = new URLSearchParams()
    if (inputQuery) params.append('q', inputQuery)
    if (newCategory) params.append('category', newCategory)
    const url = params.toString() ? `/search?${params.toString()}` : '/search'
    router.replace(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">
          ค้นหาสื่อการสอน
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          ค้นพบสื่อการสอนที่คุณต้องการ
        </p>
      </div>

      <div className="bg-card dark:bg-card p-6 rounded-lg border border-border dark:border-border">
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <SearchWithSuggestions
              initialValue={inputQuery}
              onSearch={(q) => {
                setInputQuery(q)
                handleSearch(q)
              }}
              placeholder="ค้นหาสื่อการสอน..."
            />
          </div>

          <div className="sm:w-48">
            <Select value={inputCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ทุกหมวดหมู่</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleSearch()}>
              <Search className="h-4 w-4 mr-2" />
              ค้นหา
            </Button>
            {(inputQuery || inputCategory) && (
              <Button
                variant="outline"
                onClick={clearFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                ล้างตัวกรอง
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(urlQuery || urlCategory) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">ตัวกรองที่ใช้:</span>
          {urlQuery && (
            <Badge variant="secondary">
              ค้นหา: &ldquo;{urlQuery}&rdquo;
            </Badge>
          )}
          {urlCategory && (
            <Badge variant="secondary">
              หมวดหมู่: {getLabel(urlCategory)}
            </Badge>
          )}
        </div>
      )}

      {/* Results with Infinite Scroll */}
      <InfiniteMediaGrid
        key={`${urlQuery}-${urlCategory}`}
        query={urlQuery}
        category={urlCategory}
        emptyMessage={
          urlQuery || urlCategory
            ? 'ไม่พบสื่อการสอนที่ตรงกับเงื่อนไขการค้นหา'
            : 'กรุณาใส่คำค้นหาหรือเลือกหมวดหมู่เพื่อค้นหาสื่อ'
        }
      />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <SearchContent />
    </Suspense>
  )
}
