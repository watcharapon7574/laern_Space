'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-destructive">เกิดข้อผิดพลาด</h1>
        <p className="text-muted-foreground max-w-md">
          เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          ลองใหม่
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            กลับหน้าแรก
          </Link>
        </Button>
      </div>
    </div>
  )
}
