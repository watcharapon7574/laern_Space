'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="th">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>เกิดข้อผิดพลาดร้ายแรง</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง</p>
          <Button onClick={reset}>ลองใหม่</Button>
        </div>
      </body>
    </html>
  )
}
