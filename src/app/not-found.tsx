import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">ไม่พบหน้าที่คุณต้องการ</h2>
        <p className="text-muted-foreground max-w-md">
          หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่ในระบบ
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            กลับหน้าแรก
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">
            <Search className="h-4 w-4 mr-2" />
            ค้นหาสื่อ
          </Link>
        </Button>
      </div>
    </div>
  )
}
