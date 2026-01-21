import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MediaStatus } from '@prisma/client'
import { ApprovalList } from '@/components/approval-list'

export default async function ApproveMediaPage() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/auth/signin')
  }

  const pendingMedia = await prisma.media.findMany({
    where: { status: MediaStatus.PENDING },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">อนุมัติสื่อการสอน</h1>
        <p className="text-muted-foreground mt-2">
          ตรวจสอบและอนุมัติสื่อที่ผู้ใช้ส่งเข้ามา
        </p>
      </div>

      {pendingMedia.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">ไม่มีสื่อที่รออนุมัติ</p>
        </div>
      ) : (
        <ApprovalList initialMedia={pendingMedia} />
      )}
    </div>
  )
}
