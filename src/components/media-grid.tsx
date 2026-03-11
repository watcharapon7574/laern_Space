import { MediaCard } from './media-card'

interface CategoryInfo {
  key: string
  label: string
  cssClass: string
}

interface Media {
  id: string
  slug: string
  title: string
  url?: string | null
  thumbnail?: string | null
  description?: string | null
  pdfDocument?: string | null
  mediaType?: string
  category: CategoryInfo
  tags: string
  viewCount: number
  playCount: number
  likeCount: number
  createdAt: Date | string
}

interface MediaGridProps {
  media: Media[]
  emptyMessage?: string
}

export function MediaGrid({ media, emptyMessage = 'ไม่พบสื่อการสอน' }: MediaGridProps) {
  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground dark:text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {media.map((item) => (
        <MediaCard
          key={item.id}
          id={item.id}
          slug={item.slug}
          title={item.title}
          url={item.url}
          thumbnail={item.thumbnail}
          description={item.description}
          category={item.category}
          tags={JSON.parse(item.tags || '[]')}
          viewCount={item.viewCount}
          playCount={item.playCount}
          likeCount={item.likeCount}
          createdAt={item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt}
          mediaType={item.mediaType}
          pdfDocument={item.pdfDocument}
        />
      ))}
    </div>
  )
}
