'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, AlertTriangle, Maximize2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { isAllowedDomain } from '@/lib/utils'

interface EmbedFrameProps {
  url: string
  title: string
  thumbnail?: string | null
  className?: string
}

export function EmbedFrame({ url, title, thumbnail, className = '' }: EmbedFrameProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [attemptEmbed, setAttemptEmbed] = useState(false)
  
  const canEmbed = isAllowedDomain(url)
  
  // Default to fullscreen embed (force play) when can't embed normally
  const [fullscreenEmbed, setFullscreenEmbed] = useState(!canEmbed)

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenEmbed) {
        setFullscreenEmbed(false)
      }
    }

    if (fullscreenEmbed) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scrolling when in fullscreen
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [fullscreenEmbed])

  // แสดง UI เรียบง่ายสำหรับเล่นสื่อ
  const renderSimplePlayUI = () => (
    <div className={`relative aspect-video rounded-lg overflow-hidden ${className}`}>
      {/* Background: thumbnail or gradient */}
      {thumbnail ? (
        <img 
          src={thumbnail} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800" />
      )}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div 
          className="bg-primary hover:bg-primary/90 rounded-full p-6 cursor-pointer transition-all hover:scale-110 shadow-lg mb-6"
          onClick={() => setFullscreenEmbed(true)}
        >
          <svg className="h-12 w-12 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-center mb-6 max-w-md">
          คลิกเพื่อเล่นสื่อการสอน
        </p>
        
        <div className="flex gap-3">
          <Button 
            size="lg"
            onClick={() => setFullscreenEmbed(true)}
          >
            <Maximize2 className="h-5 w-5 mr-2" />
            เล่นสื่อ
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-5 w-5 mr-2" />
              เปิดในแท็บใหม่
            </a>
          </Button>
        </div>
      </div>
    </div>
  )

  // โหมดเต็มจอสำหรับบังคับเล่น
  if (fullscreenEmbed) {
    return (
      <div className="fixed inset-0 z-50 bg-background animate-in fade-in duration-300">
        {/* Header bar with back button */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => setFullscreenEmbed(false)}
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>กลับ</span>
            </Button>
            <div className="h-4 w-px bg-border"></div>
            <h1 className="font-semibold text-foreground truncate">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              กด ESC เพื่อออก
            </span>
            <Button asChild variant="outline" size="sm">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                เปิดต้นฉบับ
              </a>
            </Button>
          </div>
        </div>
        
        {/* Fullscreen iframe */}
        <div className="h-[calc(100vh-73px)]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          <iframe
            src={url}
            title={title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox allow-downloads"
            allow="fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-read; clipboard-write; payment; geolocation; microphone; camera"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
          />
          
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted p-8">
              <div className="text-center max-w-md">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  ไม่สามารถโหลดได้
                </h3>
                <p className="text-muted-foreground mb-6">
                  เว็บไซต์นี้อาจไม่อนุญาตให้ฝังใน iframe เพื่อความปลอดภัย
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      เปิดในแท็บใหม่
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => setFullscreenEmbed(false)}>
                    กลับไปหน้าเดิม
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!canEmbed && !attemptEmbed) {
    return renderSimplePlayUI()
  }

  return (
    <div className={`relative bg-muted rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted p-8">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              ไม่สามารถโหลดสื่อได้ อาจเป็นเพราะเว็บไซต์ปลายทางบล็อกการฝัง
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Modal Popup */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  ลองเปิดแบบเต็มหน้าจอ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-2">
                <DialogHeader className="sr-only">
                  <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-full">
                  <Button
                    onClick={() => setShowModal(false)}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 z-10 bg-card/90 hover:bg-card"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <iframe
                    src={url}
                    title={title}
                    className="w-full h-full rounded border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox"
                    allow="fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-read; clipboard-write"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* External Link */}
            <Button asChild variant="outline">
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                เปิดในแท็บใหม่
              </a>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 text-center">
            บางเว็บไซต์ไม่อนุญาตให้ฝังใน iframe เพื่อความปลอดภัย
          </p>
        </div>
      )}
      
      <iframe
        src={url}
        title={title}
        width="100%"
        height="600"
        frameBorder="0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
        allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        className="w-full min-h-[600px] border-0"
        style={{
          colorScheme: 'light dark',
        }}
      />
      
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* ปุ่มเปิด Modal เต็มหน้าจอ */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-2">
            <DialogHeader className="sr-only">
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full">
              <Button
                onClick={() => setShowModal(false)}
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 z-10 bg-card/90 hover:bg-card"
              >
                <X className="h-4 w-4" />
              </Button>
              <iframe
                src={url}
                title={title}
                className="w-full h-full rounded border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox"
                allow="fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-read; clipboard-write"
                referrerPolicy="no-referrer"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* ปุ่มเปิดในแท็บใหม่ */}
        <Button size="sm" variant="outline" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}