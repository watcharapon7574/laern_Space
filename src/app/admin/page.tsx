'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/utils'
import { Eye, Play, FileVideo, TrendingUp, BarChart3, Settings, CheckCircle, Plus } from 'lucide-react'

interface Stats {
  totalMedia: number
  totalViews: number
  totalPlays: number
  topMedia: Array<{
    title: string
    viewCount: number
    playCount: number
    category: string
  }>
  categoryCounts: Record<string, number>
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

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (!response.ok) {
        router.push('/auth/signin')
        return
      }
      setAuthenticated(true)
      fetchStats()
    } catch (error) {
      router.push('/auth/signin')
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/media?limit=1000')
      const data = await response.json()
      const media = data.media || []

      const totalViews = media.reduce((sum: number, item: any) => sum + item.viewCount, 0)
      const totalPlays = media.reduce((sum: number, item: any) => sum + item.playCount, 0)

      const topMedia = media
        .sort((a: any, b: any) => b.viewCount - a.viewCount)
        .slice(0, 10)

      const categoryCounts = media.reduce((acc: Record<string, number>, item: any) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {})

      setStats({
        totalMedia: media.length,
        totalViews,
        totalPlays,
        topMedia,
        categoryCounts,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-foreground">แดชบอร์ดผู้ดูแล</h1>
          <p className="text-muted-foreground dark:text-muted-foreground">ภาพรวมระบบคลังเก็บสื่อการสอน</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/manage">
              <Settings className="h-4 w-4 mr-2" />
              จัดการสื่อ
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/approve">
              <CheckCircle className="h-4 w-4 mr-2" />
              อนุมัติสื่อ
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/add">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มสื่อ
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">สื่อทั้งหมด</CardTitle>
                <FileVideo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.totalMedia)}</div>
                <p className="text-xs text-muted-foreground">รายการ</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">การดูรวม</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.totalViews)}</div>
                <p className="text-xs text-muted-foreground">ครั้ง</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">การเล่นรวม</CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.totalPlays)}</div>
                <p className="text-xs text-muted-foreground">ครั้ง</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">อัตราการเล่น</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalViews > 0 ? Math.round((stats.totalPlays / stats.totalViews) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">เปอร์เซ็นต์</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Media */}
            <Card>
              <CardHeader>
                <CardTitle>สื่อยอดนิยม</CardTitle>
                <CardDescription>10 อันดับแรกที่ได้รับการดูมากที่สุด</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topMedia.slice(0, 10).map((media, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground dark:text-foreground truncate">
                          #{index + 1} {media.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[media.category]}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{formatNumber(media.viewCount)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Play className="h-3 w-3" />
                          <span>{formatNumber(media.playCount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>การกระจายตามหมวดหมู่</CardTitle>
                <CardDescription>จำนวนสื่อในแต่ละหมวดหมู่</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.categoryCounts).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge>{categoryLabels[category] || category}</Badge>
                      </div>
                      <div className="text-sm font-medium">
                        {count} รายการ
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
