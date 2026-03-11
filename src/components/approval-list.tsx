'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface MediaWithCategory {
  id: string
  slug: string
  title: string
  url: string | null
  thumbnail: string | null
  description: string | null
  mediaType?: string
  videoUrl?: string | null
  category: { key: string; label: string }
  tags: string
  status: string
  submittedBy: string | null
  viewCount: number
  playCount: number
  createdAt: Date | string
  updatedAt: Date | string
  categoryId: string
  pdfDocument: string | null
}

interface ApprovalListProps {
  initialMedia: MediaWithCategory[]
}

export function ApprovalList({ initialMedia }: ApprovalListProps) {
  const [media, setMedia] = useState(initialMedia)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleApprove = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setLoading(id)
    try {
      const response = await fetch(`/api/media/approve/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setMedia((prev) => prev.filter((m) => m.id !== id))

      toast.success(
        status === 'APPROVED' ? 'อนุมัติสื่อสำเร็จ' : 'ปฏิเสธสื่อสำเร็จ'
      )
      router.refresh()
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {media.map((item) => {
        const tags = JSON.parse(item.tags || '[]') as string[]

        return (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              {item.thumbnail && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardTitle className="line-clamp-2">{item.title}</CardTitle>
              <div className="flex gap-2 flex-wrap mt-2">
                <Badge variant="secondary">
                  {item.category?.label || ''}
                </Badge>
                {tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-2">
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description}
                </p>
              )}
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">ผู้จัดทำ:</span>{' '}
                  {item.submittedBy || 'ไม่ระบุ'}
                </p>
                {item.url ? (
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <span>ดู URL</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ) : item.pdfDocument ? (
                  <Link
                    href={item.pdfDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <span>ดู PDF</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ) : null}
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                onClick={() => handleApprove(item.id, 'APPROVED')}
                disabled={loading === item.id}
                className="flex-1"
                variant="default"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                อนุมัติ
              </Button>
              <Button
                onClick={() => handleApprove(item.id, 'REJECTED')}
                disabled={loading === item.id}
                className="flex-1"
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                ปฏิเสธ
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
