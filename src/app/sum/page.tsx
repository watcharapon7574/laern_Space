export const revalidate = 60

import { prisma } from '@/lib/prisma'
import { MediaStatus } from '@prisma/client'
import { STAFF_LIST, normalizeName, getAgeGroup, AGE_GROUP_LABELS, type AgeGroup } from '@/lib/staff-data'
import { Trophy, Heart, Eye, Play, Medal, Award } from 'lucide-react'

const LIKE_SCORE = 3
const VIEW_SCORE = 1
const PLAY_SCORE = 2

interface ScoreEntry {
  name: string
  age: number | null
  position: string
  staffType: string
  ageGroup: AgeGroup | null
  mediaCount: number
  totalLikes: number
  totalViews: number
  totalPlays: number
  likeScore: number
  viewScore: number
  playScore: number
  totalScore: number
}

async function calculateScores(): Promise<ScoreEntry[]> {
  const allMedia = await prisma.media.findMany({
    where: { status: MediaStatus.APPROVED },
    select: {
      submittedBy: true,
      likeCount: true,
      viewCount: true,
      playCount: true,
    },
  })

  // Group media stats by normalized submittedBy name
  const mediaBySubmitter = new Map<string, { likes: number; views: number; plays: number; count: number }>()

  for (const media of allMedia) {
    if (!media.submittedBy) continue
    const key = normalizeName(media.submittedBy)
    const existing = mediaBySubmitter.get(key) || { likes: 0, views: 0, plays: 0, count: 0 }
    existing.likes += media.likeCount
    existing.views += media.viewCount
    existing.plays += media.playCount
    existing.count += 1
    mediaBySubmitter.set(key, existing)
  }

  // Calculate scores for each staff member
  const scores: ScoreEntry[] = STAFF_LIST.map((staff) => {
    const key = normalizeName(staff.name)
    const stats = mediaBySubmitter.get(key) || { likes: 0, views: 0, plays: 0, count: 0 }

    const likeScore = stats.likes * LIKE_SCORE
    const viewScore = stats.views * VIEW_SCORE
    const playScore = stats.plays * PLAY_SCORE

    return {
      name: staff.name,
      age: staff.age,
      position: staff.position,
      staffType: staff.staffType,
      ageGroup: getAgeGroup(staff.age),
      mediaCount: stats.count,
      totalLikes: stats.likes,
      totalViews: stats.views,
      totalPlays: stats.plays,
      likeScore,
      viewScore,
      playScore,
      totalScore: likeScore + viewScore + playScore,
    }
  })

  return scores
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />
  return <span className="text-sm text-muted-foreground">{rank}</span>
}

function ScoreTable({ entries, groupLabel }: { entries: ScoreEntry[]; groupLabel: string }) {
  const sorted = [...entries].sort((a, b) => b.totalScore - a.totalScore)

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="bg-blue-600 text-white px-6 py-4">
        <h2 className="text-xl font-bold">{groupLabel}</h2>
        <p className="text-blue-100 text-sm">{sorted.length} คน</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-12">อันดับ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">ชื่อ - นามสกุล</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground w-16">อายุ</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground w-16">สื่อ</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-red-500 w-24">
                <span className="flex items-center justify-center gap-1"><Heart className="h-3 w-3" />x{LIKE_SCORE}</span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-blue-500 w-24">
                <span className="flex items-center justify-center gap-1"><Eye className="h-3 w-3" />x{VIEW_SCORE}</span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-green-500 w-24">
                <span className="flex items-center justify-center gap-1"><Play className="h-3 w-3" />x{PLAY_SCORE}</span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground w-28">คะแนนรวม</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, index) => {
              const rank = index + 1
              const isTop3 = rank <= 3 && entry.totalScore > 0
              return (
                <tr
                  key={entry.name}
                  className={`border-b border-border last:border-0 transition-colors hover:bg-muted/30 ${
                    isTop3 ? 'bg-yellow-50/50 dark:bg-yellow-950/10' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    {getRankIcon(rank)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{entry.name}</div>
                    <div className="text-xs text-muted-foreground">{entry.position}</div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">{entry.age ?? '-'}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{entry.mediaCount}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm">{entry.totalLikes}</div>
                    <div className="text-xs text-red-500 font-medium">{entry.likeScore} คะแนน</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm">{entry.totalViews}</div>
                    <div className="text-xs text-blue-500 font-medium">{entry.viewScore} คะแนน</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm">{entry.totalPlays}</div>
                    <div className="text-xs text-green-500 font-medium">{entry.playScore} คะแนน</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-lg font-bold ${
                      isTop3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'
                    }`}>
                      {entry.totalScore}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default async function SumPage() {
  const scores = await calculateScores()

  const groups: Record<AgeGroup, ScoreEntry[]> = {
    '20-30': [],
    '31-40': [],
    '41+': [],
  }

  const noAgeGroup: ScoreEntry[] = []

  for (const entry of scores) {
    if (entry.ageGroup) {
      groups[entry.ageGroup].push(entry)
    } else {
      noAgeGroup.push(entry)
    }
  }

  const totalMediaCount = scores.reduce((sum, e) => sum + e.mediaCount, 0)
  const totalAllScores = scores.reduce((sum, e) => sum + e.totalScore, 0)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          <Trophy className="inline h-8 w-8 text-yellow-500 mr-2 -mt-1" />
          สรุปคะแนนการประกวดสื่อการสอน
        </h1>
        <p className="text-muted-foreground">
          ศูนย์การศึกษาพิเศษ เขตการศึกษา 6 จังหวัดลพบุรี
        </p>
      </div>

      {/* Scoring Criteria */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-3">เกณฑ์การให้คะแนน</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
            <Heart className="h-6 w-6 text-red-500" />
            <div>
              <div className="font-semibold text-red-600 dark:text-red-400">ถูกใจ</div>
              <div className="text-sm text-muted-foreground">{LIKE_SCORE} คะแนน/ครั้ง</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
            <Eye className="h-6 w-6 text-blue-500" />
            <div>
              <div className="font-semibold text-blue-600 dark:text-blue-400">ดู</div>
              <div className="text-sm text-muted-foreground">{VIEW_SCORE} คะแนน/ครั้ง</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
            <Play className="h-6 w-6 text-green-500" />
            <div>
              <div className="font-semibold text-green-600 dark:text-green-400">เข้าเล่น</div>
              <div className="text-sm text-muted-foreground">{PLAY_SCORE} คะแนน/ครั้ง</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{scores.length}</div>
          <div className="text-sm text-muted-foreground">บุคลากรทั้งหมด</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{totalMediaCount}</div>
          <div className="text-sm text-muted-foreground">สื่อที่ส่งทั้งหมด</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{scores.filter(s => s.mediaCount > 0).length}</div>
          <div className="text-sm text-muted-foreground">คนที่ส่งสื่อแล้ว</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{totalAllScores}</div>
          <div className="text-sm text-muted-foreground">คะแนนรวมทั้งหมด</div>
        </div>
      </div>

      {/* Score Tables by Age Group */}
      {(['20-30', '31-40', '41+'] as AgeGroup[]).map((group) => (
        <ScoreTable
          key={group}
          entries={groups[group]}
          groupLabel={`${AGE_GROUP_LABELS[group]} (รางวัลอันดับ 1-3)`}
        />
      ))}

      {/* No age group */}
      {noAgeGroup.length > 0 && (
        <ScoreTable
          entries={noAgeGroup}
          groupLabel="ไม่ระบุอายุ"
        />
      )}

      <p className="text-center text-xs text-muted-foreground">
        ข้อมูลอัปเดตอัตโนมัติทุก 1 นาที | สูตร: (ถูกใจ x {LIKE_SCORE}) + (ดู x {VIEW_SCORE}) + (เข้าเล่น x {PLAY_SCORE})
      </p>
    </div>
  )
}
