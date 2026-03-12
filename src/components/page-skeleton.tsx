function Pulse({ className }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-lg ${className || ''}`} />
}

export function MediaCardSkeleton() {
  return (
    <div className="overflow-hidden bg-card border border-border rounded-xl shadow-md">
      <Pulse className="aspect-video rounded-none" />
      <div className="p-4 space-y-3">
        <Pulse className="h-5 w-3/4" />
        <Pulse className="h-4 w-full" />
        <div className="flex gap-1">
          <Pulse className="h-5 w-14 rounded-md" />
          <Pulse className="h-5 w-14 rounded-md" />
        </div>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between">
        <div className="flex gap-3">
          <Pulse className="h-4 w-10" />
          <Pulse className="h-4 w-10" />
        </div>
        <Pulse className="h-8 w-16 rounded-md" />
      </div>
    </div>
  )
}

export function MediaGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <Pulse className="h-40 rounded-4xl" />

      {/* Button */}
      <div className="flex justify-center">
        <Pulse className="h-10 w-48 rounded-md" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Pulse key={i} className="h-20 rounded-lg" />
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <Pulse className="h-7 w-48" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Pulse key={i} className="h-10 w-28 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <Pulse className="h-7 w-36" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Pulse key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="space-y-4">
        <Pulse className="h-7 w-32" />
        <MediaGridSkeleton count={8} />
      </div>
    </div>
  )
}

export function MediaDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex gap-2">
        <Pulse className="h-4 w-16" />
        <Pulse className="h-4 w-24" />
        <Pulse className="h-4 w-40" />
      </div>

      {/* Title & Stats */}
      <div className="space-y-3">
        <Pulse className="h-9 w-2/3" />
        <div className="flex gap-4">
          <Pulse className="h-4 w-20" />
          <Pulse className="h-4 w-20" />
          <Pulse className="h-4 w-20" />
        </div>
      </div>

      {/* Player */}
      <Pulse className="aspect-video rounded-lg" />

      {/* Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Pulse className="h-6 w-24" />
          <Pulse className="h-20 w-full" />
          <div className="flex gap-2">
            <Pulse className="h-6 w-16 rounded-full" />
            <Pulse className="h-6 w-16 rounded-full" />
            <Pulse className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <div>
          <Pulse className="h-64 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function CategoryPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-24" />
        </div>
        <Pulse className="h-9 w-64" />
        <Pulse className="h-5 w-40" />
      </div>
      <MediaGridSkeleton count={8} />
    </div>
  )
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-6">
      <Pulse className="h-9 w-48" />
      {/* Filters */}
      <Pulse className="h-24 rounded-lg" />
      {/* Table rows */}
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Pulse key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function ApprovalSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Pulse className="h-9 w-56" />
        <Pulse className="h-5 w-72" />
      </div>
      <MediaGridSkeleton count={6} />
    </div>
  )
}
