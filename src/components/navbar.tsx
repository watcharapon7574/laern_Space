'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Menu, X, User, LogIn } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Logo } from '@/components/logo'

const categories = [
  { key: 'GAME', label: 'เกม', href: '/categories/game' },
  { key: 'SCIENCE', label: 'วิทยาศาสตร์', href: '/categories/science' },
  { key: 'MATH', label: 'คณิต', href: '/categories/math' },
  { key: 'THAI', label: 'ภาษาไทย', href: '/categories/thai' },
  { key: 'ENGLISH', label: 'ภาษาอังกฤษ', href: '/categories/english' },
  { key: 'SOCIAL', label: 'สังคม', href: '/categories/social' },
  { key: 'OTHER', label: 'อื่น ๆ', href: '/categories/other' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session')
      setAuthenticated(response.ok)
    } catch (error) {
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setAuthenticated(false)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center py-2">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="ค้นหาสื่อการสอน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground">
                  หมวดหมู่
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.key} asChild>
                    <Link
                      href={category.href}
                      className={`w-full ${
                        pathname === category.href
                          ? 'bg-primary/10 text-primary'
                          : ''
                      }`}
                    >
                      {category.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {loading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            ) : authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>ผู้ดูแล</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/admin">แดชบอร์ด</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/add">เพิ่มสื่อ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/approve">อนุมัติสื่อ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/auth/signin" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>เข้าสู่ระบบ</span>
                </Link>
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-muted">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="ค้นหาสื่อการสอน..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </form>

              {categories.map((category) => (
                <Link
                  key={category.key}
                  href={category.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === category.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted-foreground/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {category.label}
                </Link>
              ))}

              <div className="border-t border-border pt-4 mt-4">
                {authenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-base font-medium text-foreground">
                      ผู้ดูแล
                    </div>
                    <Link
                      href="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted-foreground/10"
                      onClick={() => setIsOpen(false)}
                    >
                      แดชบอร์ด
                    </Link>
                    <Link
                      href="/admin/add"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted-foreground/10"
                      onClick={() => setIsOpen(false)}
                    >
                      เพิ่มสื่อ
                    </Link>
                    <Link
                      href="/admin/approve"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted-foreground/10"
                      onClick={() => setIsOpen(false)}
                    >
                      อนุมัติสื่อ
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted-foreground/10"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted-foreground/10"
                    onClick={() => setIsOpen(false)}
                  >
                    เข้าสู่ระบบ
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
