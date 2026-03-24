export const revalidate = 60

import { prisma } from '@/lib/prisma'
import { MediaStatus } from '@prisma/client'
import { STAFF_LIST, normalizeName, getAgeGroup, type AgeGroup } from '@/lib/staff-data'
import { SumClient, type ScoreEntry } from './sum-client'

const LIKE_SCORE = 3
const VIEW_SCORE = 1
const PLAY_SCORE = 2

async function calculateScores(): Promise<ScoreEntry[]> {
  const allMedia = await prisma.media.findMany({
    where: { status: MediaStatus.APPROVED },
    select: {
      title: true,
      submittedBy: true,
      likeCount: true,
      viewCount: true,
      playCount: true,
    },
  })

  const mediaBySubmitter = new Map<string, { likes: number; views: number; plays: number; count: number; titles: string[] }>()

  for (const media of allMedia) {
    if (!media.submittedBy) continue
    const key = normalizeName(media.submittedBy)
    const existing = mediaBySubmitter.get(key) || { likes: 0, views: 0, plays: 0, count: 0, titles: [] }
    existing.likes += media.likeCount
    existing.views += media.viewCount
    existing.plays += media.playCount
    existing.count += 1
    existing.titles.push(media.title)
    mediaBySubmitter.set(key, existing)
  }

  return STAFF_LIST.map((staff) => {
    const key = normalizeName(staff.name)
    const stats = mediaBySubmitter.get(key) || { likes: 0, views: 0, plays: 0, count: 0, titles: [] }

    const likeScore = stats.likes * LIKE_SCORE
    const viewScore = stats.views * VIEW_SCORE
    const playScore = stats.plays * PLAY_SCORE

    return {
      name: staff.name,
      position: staff.position,
      ageGroup: getAgeGroup(staff.age),
      mediaCount: stats.count,
      mediaTitles: stats.titles,
      totalLikes: stats.likes,
      totalViews: stats.views,
      totalPlays: stats.plays,
      likeScore,
      viewScore,
      playScore,
      totalScore: likeScore + viewScore + playScore,
    }
  })
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

  return (
    <SumClient
      groups={groups}
      noAgeGroup={noAgeGroup}
      totalStaff={scores.length}
      totalMedia={scores.reduce((sum, e) => sum + e.mediaCount, 0)}
      totalSubmitted={scores.filter(s => s.mediaCount > 0).length}
      totalScore={scores.reduce((sum, e) => sum + e.totalScore, 0)}
    />
  )
}
