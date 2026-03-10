'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SimpleBarChart, SimpleLineChart, StatCard } from '@/components/admin'
import { ExportButton } from '@/components/admin'
import { formatNumber } from '@/lib/utils'
import { Eye, Play, FileVideo, TrendingUp, Clock, BarChart3, Heart, Loader2 } from 'lucide-react'
import { useCategories } from '@/lib/hooks/use-categories'

interface AnalyticsData {
  period: string
  dailyData: { date: string; views: number; uniqueMedia: number }[]
  categoryData: { category: string; label?: string; count: number; views: number; plays: number }[]
  topMedia: { id: string; title: string; slug: string; category?: { key: string; label: string }; viewCount: number; playCount: number }[]
  summary: {
    totalMedia: number
    totalViews: number
    totalPlays: number
    totalLikes: number
    pendingApproval: number
    recentViews: number
    playRate: number
  }
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const { getLabel, getColor } = useCategories()

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin')
          return
        }
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ไม่สามารถโหลดข้อมูลได้</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">สถิติการใช้งานโดยละเอียด</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 ชั่วโมง</SelectItem>
              <SelectItem value="7d">7 วัน</SelectItem>
              <SelectItem value="30d">30 วัน</SelectItem>
              <SelectItem value="90d">90 วัน</SelectItem>
            </SelectContent>
          </Select>
          <ExportButton />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard
          title="สื่อทั้งหมด"
          value={analytics.summary.totalMedia}
          icon={<FileVideo className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="การดูรวม"
          value={analytics.summary.totalViews}
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="การเล่นรวม"
          value={analytics.summary.totalPlays}
          icon={<Play className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="ถูกใจรวม"
          value={analytics.summary.totalLikes}
          icon={<Heart className="h-4 w-4 text-red-500" />}
        />
        <StatCard
          title="อัตราการเล่น"
          value={`${analytics.summary.playRate}%`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="รอตรวจสอบ"
          value={analytics.summary.pendingApproval}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title={`การดูใน ${period}`}
          value={analytics.summary.recentViews}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>การดูรายวัน</CardTitle>
            <CardDescription>จำนวนการดูในช่วง {period}</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.dailyData.length > 0 ? (
              <SimpleLineChart
                data={analytics.dailyData.map((d) => ({ date: d.date, value: d.views }))}
                height={200}
                color="#3b82f6"
              />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                ไม่มีข้อมูล
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>การกระจายตามหมวดหมู่</CardTitle>
            <CardDescription>จำนวนสื่อในแต่ละหมวดหมู่</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={analytics.categoryData.map((c) => ({
                label: c.label || getLabel(c.category),
                value: c.count,
                color: getColor(c.category),
              }))}
              height={200}
            />
          </CardContent>
        </Card>

        {/* Category Views */}
        <Card>
          <CardHeader>
            <CardTitle>การดูตามหมวดหมู่</CardTitle>
            <CardDescription>จำนวนการดูในแต่ละหมวดหมู่</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={analytics.categoryData.map((c) => ({
                label: c.label || getLabel(c.category),
                value: c.views,
                color: getColor(c.category),
              }))}
              height={200}
            />
          </CardContent>
        </Card>

        {/* Top Media */}
        <Card>
          <CardHeader>
            <CardTitle>สื่อยอดนิยม</CardTitle>
            <CardDescription>10 อันดับแรก</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topMedia.map((media, index) => (
                <div key={media.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{media.title}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {media.category?.label || ''}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(media.viewCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      <span>{formatNumber(media.playCount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
