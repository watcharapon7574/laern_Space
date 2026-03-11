'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Eye, ExternalLink, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/favorite-button'
import { LikeButton } from '@/components/like-button'
import { formatNumber } from '@/lib/utils'

interface CategoryInfo {
  key: string
  label: string
  cssClass: string
  slug?: string
}

interface MediaCardProps {
  id: string
  slug: string
  title: string
  url?: string | null
  thumbnail?: string | null
  description?: string | null
  category: CategoryInfo
  tags: string[]
  viewCount: number
  playCount: number
  likeCount: number
  createdAt: string
  mediaType?: string
  pdfDocument?: string | null
}

export function MediaCard({
  id,
  slug,
  title,
  url,
  thumbnail,
  description,
  category,
  tags,
  viewCount,
  playCount,
  likeCount,
  mediaType,
  pdfDocument,
}: MediaCardProps) {
  const isGeneral = mediaType === 'GENERAL'
  const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || '[]')

  return (
    <div
      className="group transition-all duration-300 overflow-hidden bg-card border border-border rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2"
    >
      <div className="p-0">
        <div className="relative aspect-video bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              {isGeneral ? (
                <FileText className="h-12 w-12 text-gray-400" />
              ) : (
                <Play className="h-12 w-12 text-gray-400" />
              )}
            </div>
          )}

          <div className={`absolute top-3 left-3 ${category.cssClass} px-2 py-1 rounded-md text-xs font-semibold shadow-sm`}>
            {category.label}
          </div>

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <FavoriteButton
              media={{ id, slug, title, thumbnail, category: category.key }}
              variant="icon"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-card">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/media/${slug}`}>
            {title}
          </Link>
        </h3>

        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          {parsedTags.slice(0, 3).map((tag: string, index: number) => {
            const colorClass = `tag-color-${(index % 8) + 1}`;
            return (
              <span key={index} className={`${colorClass} text-xs px-2 py-1 rounded-md font-medium`}>
                {tag}
              </span>
            );
          })}
          {parsedTags.length > 3 && (
            <span className="tag-color-2 text-xs px-2 py-1 rounded-md font-medium">
              +{parsedTags.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between bg-card">
        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
          <LikeButton mediaId={id} initialLikeCount={likeCount} variant="icon" className="text-base" />
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center space-x-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatNumber(viewCount)}</span>
          </div>
          {!isGeneral && (
            <div className="flex items-center space-x-1">
              <Play className="h-3.5 w-3.5" />
              <span>{formatNumber(playCount)}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button asChild size="sm">
            <Link href={`/media/${slug}`}>
              {isGeneral ? (
                <><FileText className="h-4 w-4 mr-1" />ดู</>
              ) : (
                <><Play className="h-4 w-4 mr-1" />เล่น</>
              )}
            </Link>
          </Button>
          {isGeneral ? (
            pdfDocument && (
              <Button asChild size="sm" variant="outline">
                <a href={pdfDocument} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )
          ) : (
            url && (
              <Button asChild size="sm" variant="outline">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
