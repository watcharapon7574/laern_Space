export const revalidate = 60

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { MediaDetailClient } from './media-detail-client'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getMedia(slug: string) {
  return prisma.media.findFirst({
    where: {
      slug,
      status: 'APPROVED',
    },
    include: { category: true },
  })
}

async function getRelatedMedia(categoryKey: string, excludeId: string) {
  return prisma.media.findMany({
    where: {
      category: { key: categoryKey },
      status: 'APPROVED',
      id: { not: excludeId },
    },
    include: { category: true },
    take: 4,
    orderBy: { viewCount: 'desc' },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const media = await getMedia(decodeURIComponent(slug))

  if (!media) {
    return { title: 'ไม่พบสื่อ' }
  }

  return {
    title: `${media.title} | คลังเก็บสื่อการสอน`,
    description: media.description || `สื่อการสอน: ${media.title}`,
    openGraph: {
      title: media.title,
      description: media.description || `สื่อการสอน: ${media.title}`,
      ...(media.thumbnail ? { images: [{ url: media.thumbnail }] } : {}),
    },
  }
}

export default async function MediaDetailPage({ params }: PageProps) {
  const { slug } = await params
  const media = await getMedia(decodeURIComponent(slug))

  if (!media) notFound()

  const relatedMedia = await getRelatedMedia(media.category.key, media.id)

  // Serialize Date fields for client component
  const serializedMedia = {
    ...media,
    createdAt: media.createdAt.toISOString(),
    updatedAt: media.updatedAt.toISOString(),
  }

  const serializedRelated = relatedMedia.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }))

  return (
    <MediaDetailClient
      media={serializedMedia}
      relatedMedia={serializedRelated}
    />
  )
}
