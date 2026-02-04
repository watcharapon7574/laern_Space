'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Play, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface MediaItem {
  id: string
  title: string
  slug: string
  url: string
  thumbnail?: string | null
  description?: string | null
  category: string
  tags: string
  status: string
  viewCount: number
  playCount: number
  submittedBy?: string | null
  createdAt: Date | string
}

interface MediaPreviewModalProps {
  media: MediaItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onActionComplete: () => void
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
  PENDING: { label: 'รอตรวจสอบ', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'อนุมัติแล้ว', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'ปฏิเสธ', color: 'bg-red-100 text-red-800' },
}

export function MediaPreviewModal({
  media,
  open,
  onOpenChange,
  onActionComplete,
}: MediaPreviewModalProps) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [showIframe, setShowIframe] = useState(false)

  if (!media) return null

  const parsedTags = (() => {
    try {
      return JSON.parse(media.tags || '[]')
    } catch {
      return []
    }
  })()

  const handleAction = async (action: 'approve' | 'reject') => {
    setLoading(action)
    try {
      const response = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ids: [media.id],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      toast.success(action === 'approve' ? 'อนุมัติสื่อแล้ว' : 'ปฏิเสธสื่อแล้ว')
      onOpenChange(false)
      onActionComplete()
    } catch (error) {
      console.error('Action error:', error)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{media.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge className={statusLabels[media.status]?.color}>
              {statusLabels[media.status]?.label}
            </Badge>
            <Badge variant="outline">{categoryLabels[media.category]}</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Area */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {showIframe ? (
              <iframe
                src={media.url}
                className="w-full h-full border-0"
                title={media.title}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            ) : media.thumbnail ? (
              <>
                <Image
                  src={media.thumbnail}
                  alt={media.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button
                    size="lg"
                    onClick={() => setShowIframe(true)}
                    className="gap-2"
                  >
                    <Play className="h-5 w-5" />
                    ดูตัวอย่าง
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Button onClick={() => setShowIframe(true)} className="gap-2">
                  <Play className="h-5 w-5" />
                  โหลดตัวอย่าง
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">URL</p>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <span className="truncate">{media.url}</span>
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
            </div>
            <div>
              <p className="text-muted-foreground">ผู้ส่ง</p>
              <p>{media.submittedBy || 'ไม่ระบุ'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">สถิติ</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {media.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <Play className="h-4 w-4" /> {media.playCount}
                </span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">วันที่ส่ง</p>
              <p>{new Date(media.createdAt).toLocaleDateString('th-TH')}</p>
            </div>
          </div>

          {/* Description */}
          {media.description && (
            <div>
              <p className="text-muted-foreground text-sm mb-1">คำอธิบาย</p>
              <p className="text-sm">{media.description}</p>
            </div>
          )}

          {/* Tags */}
          {parsedTags.length > 0 && (
            <div>
              <p className="text-muted-foreground text-sm mb-2">แท็ก</p>
              <div className="flex flex-wrap gap-1">
                {parsedTags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {media.status === 'PENDING' && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => handleAction('approve')}
                disabled={loading !== null}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading === 'approve' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                อนุมัติ
              </Button>
              <Button
                onClick={() => handleAction('reject')}
                disabled={loading !== null}
                variant="destructive"
                className="flex-1"
              >
                {loading === 'reject' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                ปฏิเสธ
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
