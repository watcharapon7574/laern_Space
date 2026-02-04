import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MediaGrid } from '@/components/media-grid'
import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client'

const categoryLabels: Record<Category, string> = {
  GAME: 'เกม',
  SCIENCE: 'วิทยาศาสตร์',
  MATH: 'คณิต',
  THAI: 'ภาษาไทย',
  ENGLISH: 'ภาษาอังกฤษ',
  SOCIAL: 'สังคม',
  OTHER: 'อื่น ๆ',
}

interface PageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const categoryKey = category.toUpperCase() as Category

  if (!Object.keys(categoryLabels).includes(categoryKey)) {
    notFound()
  }

  const media = await prisma.media.findMany({
    where: { category: categoryKey },
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
          <span className="text-foreground dark:text-foreground">{categoryLabels[categoryKey]}</span>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">
          สื่อการสอน: {categoryLabels[categoryKey]}
        </h1>
        
        <p className="text-muted-foreground dark:text-muted-foreground">
          พบ {media.length} รายการใน หมวดหมู่{categoryLabels[categoryKey]}
        </p>
      </div>

      <MediaGrid 
        media={media}
        emptyMessage={`ไม่พบสื่อการสอนในหมวด${categoryLabels[categoryKey]}`}
      />
    </div>
  )
}