'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { InfiniteMediaGrid } from '@/components/infinite-media-grid'
import { SearchWithSuggestions } from '@/components/search-with-suggestions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Search } from 'lucide-react'
import { Category } from '@prisma/client'

const categoryLabels: Record<Category, string> = {
  GAME: 'เกม',
  SCIENCE: 'วิทยาศาสตร์',
  MATH: 'คณิต',
  THAI: 'ภาษาไทย',
  ENGLISH: 'ภาษาอังกฤษ',
  SOCIAL: 'สังคม',
  OTHER: 'อื่น ๆ',
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [searchKey, setSearchKey] = useState(0)

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery !== undefined ? searchQuery : query
    const params = new URLSearchParams()
    if (q) params.append('q', q)
    if (category) params.append('category', category)
    
    const url = params.toString() ? `/search?${params.toString()}` : '/search'
    window.history.replaceState({}, '', url)
    setSearchKey((prev) => prev + 1)
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('')
    window.history.replaceState({}, '', '/search')
    setSearchKey((prev) => prev + 1)
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    const params = new URLSearchParams()
    if (query) params.append('q', query)
    if (newCategory) params.append('category', newCategory)
    const url = params.toString() ? `/search?${params.toString()}` : '/search'
    window.history.replaceState({}, '', url)
    setSearchKey((prev) => prev + 1)
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
              initialValue={query}
              onSearch={(q) => {
                setQuery(q)
                handleSearch(q)
              }}
              placeholder="ค้นหาสื่อการสอน..."
            />
          </div>
          
          <div className="sm:w-48">
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ทุกหมวดหมู่</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
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
            {(query || category) && (
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
      {(query || category) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">ตัวกรองที่ใช้:</span>
          {query && (
            <Badge variant="secondary">
              ค้นหา: "{query}"
            </Badge>
          )}
          {category && (
            <Badge variant="secondary">
              หมวดหมู่: {categoryLabels[category as Category]}
            </Badge>
          )}
        </div>
      )}

      {/* Results with Infinite Scroll */}
      <InfiniteMediaGrid
        key={searchKey}
        query={query}
        category={category}
        emptyMessage={
          query || category
            ? 'ไม่พบสื่อการสอนที่ตรงกับเงื่อนไขการค้นหา'
            : 'กรุณาใส่คำค้นหาหรือเลือกหมวดหมู่เพื่อค้นหาสื่อ'
        }
      />
    </div>
  )
}