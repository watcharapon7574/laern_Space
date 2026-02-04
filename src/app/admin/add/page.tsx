'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, X, Plus } from 'lucide-react'
import { Category } from '@prisma/client'
import { toast } from 'sonner'

const categoryLabels: Record<Category, string> = {
  GAME: 'เกม',
  SCIENCE: 'วิทยาศาสตร์',
  MATH: 'คณิต',
  THAI: 'ภาษาไทย',
  ENGLISH: 'ภาษาอังกฤษ',
  SOCIAL: 'สังคม',
  OTHER: 'อื่น ๆ',
}

export default function AddMediaPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)

  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    category: '',
    thumbnail: '',
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [metadata, setMetadata] = useState<any>(null)
  const [fetchingMetadata, setFetchingMetadata] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (!response.ok) {
        router.push('/auth/signin')
        return
      }
      setAuthenticated(true)
    } catch (error) {
      router.push('/auth/signin')
    }
  }

  const fetchMetadata = async () => {
    if (!formData.url) return

    setFetchingMetadata(true)
    try {
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.url }),
      })

      if (response.ok) {
        const data = await response.json()
        setMetadata(data)
        setFormData(prev => ({
          ...prev,
          title: prev.title || data.title,
          description: prev.description || data.description,
          thumbnail: prev.thumbnail || data.thumbnail,
        }))
        toast.success('ดึงข้อมูลเมตาเดต้าสำเร็จ')
      } else {
        toast.error('ไม่สามารถดึงข้อมูลเมตาเดต้าได้')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล')
    } finally {
      setFetchingMetadata(false)
    }
  }

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

    // Client-side validation
    if (!formData.title.trim()) {
      setError('กรุณาใส่ชื่อสื่อ')
      return
    }

    if (!formData.url.trim()) {
      setError('กรุณาใส่ URL สื่อ')
      return
    }

    if (!formData.category) {
      setError('กรุณาเลือกหมวดหมู่')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      })

      if (response.ok) {
        toast.success('เพิ่มสื่อการสอนสำเร็จ')
        router.push('/admin')
      } else {
        const data = await response.json()
        setError(data.error || 'เกิดข้อผิดพลาดในการเพิ่มสื่อ')
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเพิ่มสื่อ')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return <div>กำลังโหลด...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">เพิ่มสื่อการสอน</h1>
        <p className="text-muted-foreground dark:text-muted-foreground">เพิ่มสื่อการสอนใหม่จาก URL</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลสื่อการสอน</CardTitle>
          <CardDescription>
            กรุณากรอกข้อมูลสื่อการสอนที่ต้องการเพิ่ม
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="url">URL สื่อการสอน *</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://loveable.dev/projects/... หรือ https://example.lovable.app/"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchMetadata}
                  disabled={!formData.url || fetchingMetadata}
                >
                  {fetchingMetadata ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ดึงข้อมูล'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                ควรเป็น URL จาก loveable.dev, lovable.app หรือโดเมนที่อนุญาต
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">ชื่อสื่อ *</Label>
              <Input
                id="title"
                type="text"
                placeholder="ชื่อสื่อการสอน"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">คำอธิบาย</Label>
              <Textarea
                id="description"
                placeholder="คำอธิบายเกี่ยวกับสื่อการสอน"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">หมวดหมู่ *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={loading}
                required
              >
                <SelectTrigger className={!formData.category ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.category && (
                <p className="text-sm text-red-500">กรุณาเลือกหมวดหมู่</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">URL รูปภาพ</Label>
              <Input
                id="thumbnail"
                type="url"
                placeholder="https://..."
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                หากไม่กรอก ระบบจะพยายามดึงจากเมตาเดต้าของหน้าเว็บ
              </p>
            </div>

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

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                เพิ่มสื่อการสอน
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin')}
                disabled={loading}
              >
                ยกเลิก
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
