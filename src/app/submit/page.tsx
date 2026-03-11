'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, Home, X, ImageIcon, Globe, BookOpen, ArrowLeft } from 'lucide-react'
import { useCategories } from '@/lib/hooks/use-categories'

type MediaTypeChoice = 'ONLINE' | 'GENERAL' | null

export default function SubmitMediaPage() {
  const [mediaType, setMediaType] = useState<MediaTypeChoice>(null)
  const [submittedBy, setSubmittedBy] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tags, setTags] = useState('')
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [pdfDocument, setPdfDocument] = useState<string | null>(null)
  const [pdfFileName, setPdfFileName] = useState<string | null>(null)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { categories } = useCategories()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ')
        setThumbnailPreview(null)
        return
      }

      setThumbnail(data.url)
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ')
      setThumbnailPreview(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const removeThumbnail = () => {
    setThumbnail(null)
    setThumbnailPreview(null)
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาดในการอัพโหลด PDF')
        return
      }

      setPdfDocument(data.url)
      setPdfFileName(file.name)
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัพโหลด PDF')
    } finally {
      setUploadingPdf(false)
    }
  }

  const removePdf = () => {
    setPdfDocument(null)
    setPdfFileName(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (honeypot) {
      setError('การส่งไม่สำเร็จ')
      return
    }

    if (mediaType === 'GENERAL' && !pdfDocument) {
      setError('กรุณาอัพโหลดเอกสาร PDF')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/media/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submittedBy,
          title,
          mediaType,
          url: mediaType === 'ONLINE' ? url : undefined,
          videoUrl: mediaType === 'GENERAL' ? videoUrl || undefined : undefined,
          description,
          categoryId,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          thumbnail,
          pdfDocument,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาดในการส่งสื่อ')
        return
      }

      setSuccess(true)

      setTimeout(() => {
        setSubmittedBy('')
        setTitle('')
        setUrl('')
        setVideoUrl('')
        setDescription('')
        setTags('')
        setThumbnail(null)
        setThumbnailPreview(null)
        setPdfDocument(null)
        setPdfFileName(null)
        setMediaType(null)
        setSuccess(false)
      }, 3000)
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการส่งสื่อ')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">ส่งสื่อสำเร็จ!</h2>
              <p className="text-muted-foreground">
                สื่อของคุณถูกส่งเรียบร้อยแล้ว กำลังรอผู้ดูแลตรวจสอบและอนุมัติ
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setSuccess(false)}>ส่งสื่ออีก</Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    กลับหน้าหลัก
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 1: Choose media type
  if (!mediaType) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">เลือกประเภทสื่อ</h1>
            <p className="text-muted-foreground">กรุณาเลือกประเภทของสื่อที่คุณต้องการส่ง</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
              onClick={() => setMediaType('ONLINE')}
            >
              <CardContent className="pt-6 text-center space-y-3">
                <Globe className="h-12 w-12 mx-auto text-blue-500" />
                <h3 className="font-semibold text-lg">สื่อออนไลน์</h3>
                <p className="text-sm text-muted-foreground">
                  สื่อจากเว็บไซต์ เช่น loveable.dev, lovable.app
                </p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
              onClick={() => setMediaType('GENERAL')}
            >
              <CardContent className="pt-6 text-center space-y-3">
                <BookOpen className="h-12 w-12 mx-auto text-green-500" />
                <h3 className="font-semibold text-lg">สื่อทั่วไป</h3>
                <p className="text-sm text-muted-foreground">
                  สื่อการสอนทั่วไป เช่น สื่อทำมือ เอกสาร PDF คลิปการสอน
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/">ยกเลิก</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Form
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => setMediaType(null)}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                เปลี่ยนประเภท
              </Button>
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                mediaType === 'ONLINE'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {mediaType === 'ONLINE' ? 'สื่อออนไลน์' : 'สื่อทั่วไป'}
              </span>
            </div>
            <CardTitle className="text-2xl">ส่งสื่อการสอน</CardTitle>
            <CardDescription>
              กรอกข้อมูลสื่อการสอนของคุณ และรอผู้ดูแลตรวจสอบอนุมัติ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="submittedBy">ชื่อผู้จัดทำ *</Label>
                <Input
                  id="submittedBy"
                  type="text"
                  placeholder="ชื่อของคุณ"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">ชื่อสื่อ *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="ชื่อสื่อการสอน"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {mediaType === 'ONLINE' && (
                <div className="space-y-2">
                  <Label htmlFor="url">URL สื่อ *</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://loveable.dev/projects/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    ใส่ URL จาก loveable.dev หรือ lovable.app
                  </p>
                </div>
              )}

              {mediaType === 'GENERAL' && (
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">URL คลิปการสอน (ถ้ามี)</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    ลิงก์วิดีโอสาธิตวิธีใช้สื่อ (YouTube, Google Drive ฯลฯ)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  placeholder="อธิบายเกี่ยวกับสื่อการสอนนี้"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={4}
                />
              </div>

              {/* Honeypot field */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="space-y-2">
                <Label htmlFor="thumbnail">หน้าปกสื่อ</Label>
                {thumbnailPreview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="thumbnail"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">คลิกเพื่ออัพโหลด</span> หรือลากไฟล์มาวาง
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, GIF, WebP (สูงสุด 5MB)
                      </p>
                    </div>
                    <input
                      id="thumbnail"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      disabled={loading || uploadingImage}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdfDocument">
                  {mediaType === 'GENERAL' ? 'เอกสาร PDF *' : 'เอกสารแนบ (PDF)'}
                </Label>
                {pdfDocument ? (
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">{pdfFileName}</p>
                        <p className="text-xs text-muted-foreground">PDF Document</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removePdf}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded"
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="pdfDocument"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-8 w-8 text-muted-foreground mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">คลิกเพื่ออัพโหลด PDF</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF (สูงสุด 10MB)
                      </p>
                    </div>
                    <input
                      id="pdfDocument"
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      disabled={loading || uploadingPdf}
                    />
                  </label>
                )}
                {uploadingPdf && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>กำลังอัพโหลด PDF...</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">หมวดหมู่ *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} disabled={loading}>
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

              <div className="space-y-2">
                <Label htmlFor="tags">แท็ก (คั่นด้วยเครื่องหมายจุลภาค)</Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="เกม, คณิตศาสตร์, ระดับประถม"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  ตัวอย่าง: เกม, คณิตศาสตร์, ระดับประถม
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  ส่งสื่อ
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">ยกเลิก</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
