'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, X, Plus, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useCategories } from '@/lib/hooks/use-categories'

interface Media {
  id: string
  slug: string
  title: string
  url?: string | null
  thumbnail?: string | null
  pdfDocument?: string | null
  videoUrl?: string | null
  description?: string | null
  mediaType?: string
  category: { id?: string; key: string; label: string }
  tags: string
  submittedBy?: string | null
}

interface MediaEditDialogProps {
  media: Media
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated?: () => void
}

export function MediaEditDialog({ media, open, onOpenChange, onUpdated }: MediaEditDialogProps) {
  const { categories } = useCategories()

  const parsedTags: string[] = (() => {
    try { return JSON.parse(media.tags || '[]') } catch { return [] }
  })()

  const [formData, setFormData] = useState({
    title: media.title,
    url: media.url || '',
    description: media.description || '',
    categoryId: '',
    thumbnail: media.thumbnail || '',
    videoUrl: media.videoUrl || '',
    pdfDocument: media.pdfDocument || '',
    submittedBy: media.submittedBy || '',
    consentCode: '',
  })
  const [tags, setTags] = useState<string[]>(parsedTags)
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Resolve categoryId once categories load
  const categoryId = formData.categoryId ||
    categories.find(c => c.key === media.category.key || c.id === media.category.id)?.id || ''

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('กรุณาใส่ชื่อสื่อ')
      return
    }

    if (!formData.consentCode.trim()) {
      setError('กรุณาใส่รหัสยืนยันจากผู้ดูแลระบบ')
      return
    }

    if (formData.consentCode.length !== 3) {
      setError('รหัสยืนยันต้องเป็นตัวเลข 3 หลัก')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/media/${media.id}/edit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url || null,
          description: formData.description || null,
          categoryId: categoryId,
          thumbnail: formData.thumbnail || null,
          tags,
          videoUrl: formData.videoUrl || null,
          pdfDocument: formData.pdfDocument || null,
          submittedBy: formData.submittedBy || null,
          consentCode: formData.consentCode,
        }),
      })

      if (response.ok) {
        toast.success('แก้ไขสื่อการสอนสำเร็จ')
        onOpenChange(false)
        onUpdated?.()
      } else {
        const data = await response.json()
        setError(data.error || 'เกิดข้อผิดพลาดในการแก้ไข')
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการแก้ไข')
    } finally {
      setLoading(false)
    }
  }

  const isOnline = media.mediaType !== 'GENERAL'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>แก้ไขสื่อการสอน</DialogTitle>
          <DialogDescription>
            แก้ไขข้อมูลสื่อการสอน กรุณาขอรหัสยืนยันจากผู้ดูแลระบบ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-title">ชื่อสื่อ *</Label>
            <Input
              id="edit-title"
              type="text"
              placeholder="ชื่อสื่อการสอน"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {isOnline && (
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL สื่อการสอน</Label>
              <Input
                id="edit-url"
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-description">คำอธิบาย</Label>
            <Textarea
              id="edit-description"
              placeholder="คำอธิบายเกี่ยวกับสื่อการสอน"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">หมวดหมู่ *</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              disabled={loading}
            >
              <SelectTrigger className={!categoryId ? "text-muted-foreground" : ""}>
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

          <div className="space-y-2">
            <Label htmlFor="edit-thumbnail">URL รูปภาพ</Label>
            <Input
              id="edit-thumbnail"
              type="url"
              placeholder="https://..."
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-submittedBy">ผู้จัดทำ</Label>
            <Input
              id="edit-submittedBy"
              type="text"
              placeholder="ชื่อผู้จัดทำ"
              value={formData.submittedBy}
              onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
              disabled={loading}
            />
          </div>

          {!isOnline && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-pdfDocument">URL เอกสาร PDF</Label>
                <Input
                  id="edit-pdfDocument"
                  type="url"
                  placeholder="https://..."
                  value={formData.pdfDocument}
                  onChange={(e) => setFormData({ ...formData, pdfDocument: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-videoUrl">URL คลิปวิดีโอ</Label>
                <Input
                  id="edit-videoUrl"
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  disabled={loading}
                />
              </div>
            </>
          )}

          {isOnline && (
            <div className="space-y-2">
              <Label htmlFor="edit-pdfDocument-online">URL เอกสารแนบ (PDF)</Label>
              <Input
                id="edit-pdfDocument-online"
                type="url"
                placeholder="https://..."
                value={formData.pdfDocument}
                onChange={(e) => setFormData({ ...formData, pdfDocument: e.target.value })}
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>แท็ก</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="เพิ่มแท็ก..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                disabled={loading}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addTag} disabled={!newTag.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Consent Code */}
          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="edit-consentCode" className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-4 w-4" />
              รหัสยืนยันจากผู้ดูแลระบบ *
            </Label>
            <Input
              id="edit-consentCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{3}"
              maxLength={3}
              placeholder="_ _ _"
              value={formData.consentCode}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                setFormData({ ...formData, consentCode: val })
              }}
              disabled={loading}
              className="text-center text-2xl tracking-[0.5em] font-mono max-w-32"
            />
            <p className="text-xs text-muted-foreground">
              กรุณาขอรหัสยืนยัน 3 หลักจากผู้ดูแลระบบก่อนทำการแก้ไข รหัสจะเปลี่ยนทุกวัน
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              บันทึกการแก้ไข
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
