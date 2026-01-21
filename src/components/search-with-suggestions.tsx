'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Tag, FileVideo } from 'lucide-react'

interface Suggestion {
  type: 'media' | 'tag'
  id?: string
  slug?: string
  text: string
  category?: string
}

interface SearchWithSuggestionsProps {
  initialValue?: string
  onSearch?: (query: string) => void
  placeholder?: string
}

const categoryLabels: Record<string, string> = {
  GAME: 'เกม',
  SCIENCE: 'วิทยาศาสตร์',
  MATH: 'คณิต',
  THAI: 'ภาษาไทย',
  ENGLISH: 'ภาษาอังกฤษ',
  SOCIAL: 'สังคม',
  OTHER: 'อื่น ๆ',
}

export function SearchWithSuggestions({
  initialValue = '',
  onSearch,
  placeholder = 'ค้นหาสื่อการสอน...',
}: SearchWithSuggestionsProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    setShowSuggestions(false)
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    if (suggestion.type === 'media' && suggestion.slug) {
      router.push(`/media/${suggestion.slug}`)
    } else if (suggestion.type === 'tag') {
      handleSearch(suggestion.text)
    }
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(query)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex])
        } else {
          handleSearch(query)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="pl-10"
        />
      </div>

      {showSuggestions && (query.length >= 2 || suggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-card dark:bg-card border border-border dark:border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.type}-${suggestion.text}-${index}`}
                  className={`px-4 py-2 cursor-pointer flex items-center gap-3 ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/30'
                      : 'hover:bg-muted dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {suggestion.type === 'media' ? (
                    <>
                      <FileVideo className="h-4 w-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{suggestion.text}</p>
                        {suggestion.category && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {categoryLabels[suggestion.category]}
                          </Badge>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">แท็ก: {suggestion.text}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-3 text-center text-muted-foreground text-sm">
              ไม่พบผลลัพธ์สำหรับ "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
