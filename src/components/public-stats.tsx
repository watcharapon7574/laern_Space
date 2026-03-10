import { StatCard } from '@/components/admin'
import { Eye, Play, Heart, FileVideo, Layers } from 'lucide-react'

interface PublicStatsProps {
  stats: {
    totalMedia: number
    totalViews: number
    totalPlays: number
    totalLikes: number
    totalCategories: number
  }
}

export function PublicStats({ stats }: PublicStatsProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">สถิติเว็บไซต์</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="สื่อการสอน"
          value={stats.totalMedia}
          description="สื่อที่เผยแพร่แล้ว"
          icon={<FileVideo className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="การเข้าชมรวม"
          value={stats.totalViews}
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="การเล่นรวม"
          value={stats.totalPlays}
          icon={<Play className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="ถูกใจรวม"
          value={stats.totalLikes}
          icon={<Heart className="h-4 w-4 text-red-500" />}
        />
        <StatCard
          title="หมวดหมู่"
          value={stats.totalCategories}
          icon={<Layers className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </section>
  )
}
