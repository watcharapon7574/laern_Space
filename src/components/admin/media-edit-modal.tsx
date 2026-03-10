'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCategories } from '@/lib/hooks/use-categories'

interface MediaItem {
  id: string
  title: string
  slug: string
  url: string
  thumbnail?: string | null
  description?: string | null
  category: { key: string; label: string }
  tags: string
  status: string
  viewCount: number
  playCount: number
  submittedBy?: string | null
  createdAt: string
}

interface MediaEditModalProps {
  media: MediaItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function MediaEditModal({
  media,
  open,
  onOpenChange,
  onSaved,
}: MediaEditModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tags, setTags] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [saving, setSaving] = useState(false)
  const { categories } = useCategories()

  useEffect(() => {
    if (media && open) {
      setTitle(media.title)
      setUrl(media.url)
      setDescription(media.description || '')
      setTags((() => {
        try {
          const parsed = JSON.parse(media.tags || '[]')
          return Array.isArray(parsed) ? parsed.join(', ') : ''
        } catch {
          return ''
        }
      })())
      setThumbnail(media.thumbnail || '')
      // Find category ID from key
      const cat = categories.find((c) => c.key === media.category?.key)
      setCategoryId(cat?.id || '')
    }
  }, [media, open, categories])

  if (!media) return null

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) {
      toast.error('กรุณากรอกชื่อและ URL')
      return
    }

    setSaving(true)
    try {
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const body: Record<string, unknown> = {
        title: title.trim(),
        url: url.trim(),
        description: description.trim() || null,
        tags: tagsArray,
        thumbnail: thumbnail.trim() || null,
      }
      if (categoryId) body.categoryId = categoryId

      const res = await fetch(`/api/media/${media.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }

      toast.success('บันทึกสำเร็จ')
      onOpenChange(false)
      onSaved()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>แก้ไขสื่อ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">ชื่อสื่อ *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="edit-url">URL *</Label>
            <Input
              id="edit-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="edit-desc">คำอธิบาย</Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label>หมวดหมู่</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-tags">แท็ก (คั่นด้วยเครื่องหมาย ,)</Label>
            <Input
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="แท็ก1, แท็ก2, แท็ก3"
            />
          </div>

          <div>
            <Label htmlFor="edit-thumb">URL รูปภาพหน้าปก</Label>
            <Input
              id="edit-thumb"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              บันทึก
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              ยกเลิก
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
