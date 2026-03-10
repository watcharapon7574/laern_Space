'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, GripVertical, Loader2, Tag } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: string
  key: string
  label: string
  slug: string
  color: string
  cssClass: string
  sortOrder: number
  _count?: { media: number }
}

const TAG_COLORS = [
  { value: 'tag-color-1', label: 'น้ำเงิน', preview: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
  { value: 'tag-color-2', label: 'เขียวมรกต', preview: 'linear-gradient(135deg, #10B981, #059669)' },
  { value: 'tag-color-3', label: 'ชมพู', preview: 'linear-gradient(135deg, #EC4899, #DB2777)' },
  { value: 'tag-color-4', label: 'เหลือง', preview: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  { value: 'tag-color-5', label: 'ม่วง', preview: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
  { value: 'tag-color-6', label: 'เขียว', preview: 'linear-gradient(135deg, #22C55E, #16A34A)' },
  { value: 'tag-color-7', label: 'แดง', preview: 'linear-gradient(135deg, #EF4444, #DC2626)' },
  { value: 'tag-color-8', label: 'คราม', preview: 'linear-gradient(135deg, #6366F1, #4F46E5)' },
]

export default function CategoriesManagePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newCssClass, setNewCssClass] = useState('tag-color-1')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin')
          return
        }
        throw new Error('Failed to fetch')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newLabel.trim()) {
      toast.error('กรุณาใส่ชื่อหมวดหมู่')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newLabel.trim(),
          cssClass: newCssClass,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create')
      }

      toast.success('เพิ่มหมวดหมู่สำเร็จ')
      setNewLabel('')
      setNewCssClass('tag-color-1')
      fetchCategories()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete')
      }

      toast.success('ลบหมวดหมู่สำเร็จ')
      fetchCategories()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด')
    } finally {
      setDeleting(null)
    }
  }

  const handleUpdateCssClass = async (id: string, cssClass: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cssClass }),
      })

      if (!response.ok) throw new Error('Failed to update')

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, cssClass } : cat))
      )
      toast.success('อัพเดทสีสำเร็จ')
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการอัพเดทสี')
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
      <div>
        <h1 className="text-3xl font-bold">จัดการหมวดหมู่</h1>
        <p className="text-muted-foreground">เพิ่ม แก้ไข หรือลบหมวดหมู่สื่อการสอน</p>
      </div>

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            เพิ่มหมวดหมู่ใหม่
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="new-label">ชื่อหมวดหมู่</Label>
              <Input
                id="new-label"
                placeholder="เช่น ดนตรี, ศิลปะ, พลศึกษา"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="w-48">
              <Label>สี</Label>
              <Select value={newCssClass} onValueChange={setNewCssClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAG_COLORS.map((tc) => (
                    <SelectItem key={tc.value} value={tc.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ background: tc.preview }}
                        />
                        {tc.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} disabled={saving || !newLabel.trim()}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              เพิ่ม
            </Button>
          </div>
          {newLabel.trim() && (
            <div className="mt-3">
              <span className="text-sm text-muted-foreground mr-2">ตัวอย่าง:</span>
              <Badge className={newCssClass}>{newLabel.trim()}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>
            หมวดหมู่ทั้งหมด ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                <div className="flex-shrink-0">
                  <Badge className={cat.cssClass}>{cat.label}</Badge>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-3 w-3" />
                    <span>key: {cat.key}</span>
                    <span>|</span>
                    <span>slug: {cat.slug}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 w-40">
                  <Select
                    value={cat.cssClass}
                    onValueChange={(value) => handleUpdateCssClass(cat.id, value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TAG_COLORS.map((tc) => (
                        <SelectItem key={tc.value} value={tc.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ background: tc.preview }}
                            />
                            {tc.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(cat.id)}
                  disabled={deleting === cat.id}
                  className="text-muted-foreground hover:text-red-500"
                >
                  {deleting === cat.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                ยังไม่มีหมวดหมู่
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
