export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MediaGrid } from '@/components/media-grid'
import { prisma } from '@/lib/prisma'
import { getCategoryBySlug } from '@/lib/categories'

interface PageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)

  const categoryData = await getCategoryBySlug(slug)

  if (!categoryData) {
    notFound()
  }

  const media = await prisma.media.findMany({
    where: { categoryId: categoryData.id, status: 'APPROVED' },
    include: { category: true },
    orderBy: [
      { viewCount: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
          <span>→</span>
          <span className="text-foreground dark:text-foreground">{categoryData.label}</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">
          สื่อการสอน: {categoryData.label}
        </h1>

        <p className="text-muted-foreground dark:text-muted-foreground">
          พบ {media.length} รายการใน หมวดหมู่{categoryData.label}
        </p>
      </div>

      <MediaGrid
        media={media}
        emptyMessage={`ไม่พบสื่อการสอนในหมวด${categoryData.label}`}
      />
    </div>
  )
}
