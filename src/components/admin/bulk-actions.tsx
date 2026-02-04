'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle, XCircle, Clock, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface BulkActionsProps {
  selectedIds: string[]
  onActionComplete: () => void
  onClearSelection: () => void
}

export function BulkActions({ selectedIds, onActionComplete, onClearSelection }: BulkActionsProps) {
  const [action, setAction] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleBulkAction = async () => {
    if (!action || selectedIds.length === 0) return

    if (action === 'delete') {
      if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบ ${selectedIds.length} รายการ?`)) {
        return
      }
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to perform action')
      }

      toast.success(`ดำเนินการสำเร็จ: ${data.affected} รายการ`)
      setAction('')
      onClearSelection()
      onActionComplete()
    } catch (error) {
      console.error('Bulk action error:', error)
      toast.error('เกิดข้อผิดพลาดในการดำเนินการ')
    } finally {
      setLoading(false)
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <Badge variant="secondary" className="text-sm">
        เลือก {selectedIds.length} รายการ
      </Badge>

      <Select value={action} onValueChange={setAction}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="เลือกการดำเนินการ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="approve">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              อนุมัติ
            </div>
          </SelectItem>
          <SelectItem value="reject">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              ปฏิเสธ
            </div>
          </SelectItem>
          <SelectItem value="pending">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              รอตรวจสอบ
            </div>
          </SelectItem>
          <SelectItem value="delete">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-500" />
              ลบ
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleBulkAction} disabled={!action || loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            กำลังดำเนินการ...
          </>
        ) : (
          'ดำเนินการ'
        )}
      </Button>

      <Button variant="outline" onClick={onClearSelection}>
        ยกเลิกการเลือก
      </Button>
    </div>
  )
}
