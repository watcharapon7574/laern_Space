import { Suspense } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MediaGrid } from '@/components/media-grid'
import { HomeClientSections } from '@/components/home-client-sections'
import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client'
import { Logo } from '@/components/logo'
import { Upload } from 'lucide-react'

async function getPopularMedia() {
  return await prisma.media.findMany({
    where: {
      status: 'APPROVED', // แสดงเฉพาะสื่อที่อนุมัติแล้ว
    },
    take: 8,
    orderBy: [
      { viewCount: 'desc' },
      { createdAt: 'desc' },
    ],
  })
}

async function getPopularTags() {
  const media = await prisma.media.findMany({
    where: {
      status: 'APPROVED', // แสดงเฉพาะสื่อที่อนุมัติแล้ว
    },
    select: { tags: true },
  })

  const tagCounts: Record<string, number> = {}

  media.forEach((item) => {
    const tags = JSON.parse(item.tags || '[]')
    tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag)
}

const categoryLabels: Record<Category, string> = {
  GAME: 'เกม',
  SCIENCE: 'วิทยาศาสตร์',
  MATH: 'คณิต',
  THAI: 'ภาษาไทย',
  ENGLISH: 'ภาษาอังกฤษ',
  SOCIAL: 'สังคม',
  OTHER: 'อื่น ๆ',
}

export default async function HomePage() {
  const [popularMedia, popularTags] = await Promise.all([
    getPopularMedia(),
    getPopularTags(),
  ])

  return (
    <div className="space-y-8">
      {/* Hero Section as Card (viewport full-bleed container) */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-x-clip">
        <div className="px-0 py-3 sm:py-4">
          <div className="max-w-[80rem] mx-auto bg-card rounded-4xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
            <div className="px-3 sm:px-5 md:px-8 py-4 sm:py-6 md:py-8 bg-card">
              <div className="flex items-center justify-center">
                <div className="w-full">
                  <Logo size="full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Media Button */}
      <div className="flex justify-center">
        <Button asChild size="lg" className="gap-2">
          <Link href="/submit">
            <Upload className="h-5 w-5" />
            ส่งสื่อการสอนของคุณ
          </Link>
        </Button>
      </div>

      {/* Favorites & Recently Viewed */}
      <HomeClientSections />

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">หมวดหมู่สื่อการสอน</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(categoryLabels).map(([key, label], index) => {
            const colorClass = `tag-color-${(index % 8) + 1}`;
            return (
              <Link
                key={key}
                href={`/categories/${key.toLowerCase()}`}
                className={`p-4 ${colorClass} rounded-xl border transition-all duration-300 text-center hover:scale-105 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="text-lg font-semibold">
                  {label}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Tags */}
      <section>
        <h2 className="text-2xl font-bold mb-6">แท็กยอดนิยม</h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag, index) => {
            const colorClass = `tag-color-${(index % 8) + 1}`;
            return (
              <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                <Badge className={`${colorClass} cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-1`}>
                  {tag}
                </Badge>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Media */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">สื่อยอดนิยม</h2>
          <Link 
            href="/search" 
            className="text-primary hover:text-primary/80 font-medium"
          >
            ดูทั้งหมด →
          </Link>
        </div>
        
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        }>
          <MediaGrid media={popularMedia} />
        </Suspense>
      </section>
    </div>
  )
}
