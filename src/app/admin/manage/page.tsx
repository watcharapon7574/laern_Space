'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BulkActions, MediaPreviewModal, ExportButton } from '@/components/admin'
import { formatNumber } from '@/lib/utils'
import {
  Eye,
  Play,
  Search,
  CheckSquare,
  Square,
  ExternalLink,
  Loader2,
  Filter,
} from 'lucide-react'

interface Media {
  id: string
  slug: string
  title: string
  url: string
  thumbnail?: string | null
  description?: string | null
  category: string
  tags: string
  status: string
  viewCount: number
  playCount: number
  submittedBy?: string | null
  createdAt: string
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

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'รอตรวจสอบ', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  APPROVED: { label: 'อนุมัติแล้ว', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  REJECTED: { label: 'ปฏิเสธ', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
}

export default function ManageMediaPage() {
  const router = useRouter()
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [previewMedia, setPreviewMedia] = useState<Media | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/media?limit=1000&includeAll=true')
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin')
          return
        }
      }
      const data = await response.json()
      setMedia(data.media || [])
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMedia = media.filter((m) => {
    const matchesSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMedia.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredMedia.map((m) => m.id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการสื่อ</h1>
          <p className="text-muted-foreground">จัดการสื่อทั้งหมดในระบบ</p>
        </div>
        <ExportButton />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="ค้นหาสื่อ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="PENDING">รอตรวจสอบ</SelectItem>
                <SelectItem value="APPROVED">อนุมัติแล้ว</SelectItem>
                <SelectItem value="REJECTED">ปฏิเสธ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="หมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <BulkActions
        selectedIds={selectedIds}
        onActionComplete={fetchMedia}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* Media List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            สื่อทั้งหมด ({filteredMedia.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
          >
            {selectedIds.length === filteredMedia.length ? (
              <>
                <CheckSquare className="h-4 w-4 mr-2" />
                ยกเลิกเลือกทั้งหมด
              </>
            ) : (
              <>
                <Square className="h-4 w-4 mr-2" />
                เลือกทั้งหมด
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedIds.includes(item.id)
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => toggleSelect(item.id)}
              >
                <div className="flex-shrink-0">
                  {selectedIds.includes(item.id) ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-shrink-0 w-20 h-12 relative rounded overflow-hidden bg-muted">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={statusLabels[item.status]?.color}>
                      {statusLabels[item.status]?.label}
                    </Badge>
                    <Badge variant="outline">{categoryLabels[item.category]}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(item.viewCount)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    <span>{formatNumber(item.playCount)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewMedia(item)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(item.url, '_blank')
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredMedia.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                ไม่พบสื่อที่ตรงกับเงื่อนไข
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <MediaPreviewModal
        media={previewMedia}
        open={previewMedia !== null}
        onOpenChange={(open) => !open && setPreviewMedia(null)}
        onActionComplete={fetchMedia}
      />
    </div>
  )
}
