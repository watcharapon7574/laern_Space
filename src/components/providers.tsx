'use client'

import NextTopLoader from 'nextjs-toploader'
import { Toaster } from '@/components/ui/sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <NextTopLoader color="#3b82f6" height={3} showSpinner={false} />
      {children}
      <Toaster />
    </>
  )
}
