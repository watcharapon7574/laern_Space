export const revalidate = 60

import { prisma } from '@/lib/prisma'
import { MediaStatus } from '@prisma/client'
import { STAFF_LIST, normalizeName, getAgeGroup, type AgeGroup } from '@/lib/staff-data'
import { SumClient, type MediaScoreEntry } from './sum-client'

const LIKE_SCORE = 3
const VIEW_SCORE = 1
const PLAY_SCORE = 2

async function calculateScores() {
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

  // Build a lookup: normalized name -> staff info
  const staffLookup = new Map<string, { name: string; position: string; ageGroup: AgeGroup | null }>()
  for (const staff of STAFF_LIST) {
    staffLookup.set(normalizeName(staff.name), {
      name: staff.name,
      position: staff.position,
      ageGroup: getAgeGroup(staff.age),
    })
  }

  // Each media = one entry
  const entries: MediaScoreEntry[] = []
  const submittedPeople = new Set<string>()

  for (const media of allMedia) {
    if (!media.submittedBy) continue
    const key = normalizeName(media.submittedBy)
    const staff = staffLookup.get(key)
    if (!staff) continue // skip if not in staff list

    submittedPeople.add(key)

    const likeScore = media.likeCount * LIKE_SCORE
    const viewScore = media.viewCount * VIEW_SCORE
    const playScore = media.playCount * PLAY_SCORE

    entries.push({
      staffName: staff.name,
      position: staff.position,
      ageGroup: staff.ageGroup,
      mediaTitle: media.title,
      likes: media.likeCount,
      views: media.viewCount,
      plays: media.playCount,
      likeScore,
      viewScore,
      playScore,
      totalScore: likeScore + viewScore + playScore,
    })
  }

  return { entries, submittedCount: submittedPeople.size }
}

export default async function SumPage() {
  const { entries, submittedCount } = await calculateScores()

  const groups: Record<AgeGroup, MediaScoreEntry[]> = {
    '20-30': [],
    '31-40': [],
    '41+': [],
  }
  const noAgeGroup: MediaScoreEntry[] = []

  for (const entry of entries) {
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
      totalStaff={STAFF_LIST.length}
      totalMedia={entries.length}
      totalSubmitted={submittedCount}
    />
  )
}
