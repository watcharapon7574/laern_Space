'use client'

import { useState } from 'react'
import { Trophy, Heart, Eye, Play, Medal, Award } from 'lucide-react'
import type { AgeGroup } from '@/lib/staff-data'
import { AGE_GROUP_LABELS } from '@/lib/staff-data'

const LIKE_SCORE = 3
const VIEW_SCORE = 1
const PLAY_SCORE = 2

export interface ScoreEntry {
  name: string
  position: string
  ageGroup: AgeGroup | null
  mediaCount: number
  mediaTitles: string[]
  totalLikes: number
  totalViews: number
  totalPlays: number
  likeScore: number
  viewScore: number
  playScore: number
  totalScore: number
}

interface SumClientProps {
  groups: Record<AgeGroup, ScoreEntry[]>
  noAgeGroup: ScoreEntry[]
  totalStaff: number
  totalMedia: number
  totalSubmitted: number
  totalScore: number
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />
  return <span className="text-sm text-muted-foreground">{rank}</span>
}

function ScoreTable({ entries }: { entries: ScoreEntry[] }) {
  const sorted = [...entries].sort((a, b) => b.totalScore - a.totalScore)

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-12">อันดับ</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">ชื่อ - นามสกุล</th>
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
                  {entry.mediaTitles.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {entry.mediaTitles.map((title, i) => (
                        <div key={i} className="text-xs text-blue-600 dark:text-blue-400">
                          - {title}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
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
  )
}

const TABS: AgeGroup[] = ['20-30', '31-40', '41+']

export function SumClient({ groups, noAgeGroup, totalStaff, totalMedia, totalSubmitted, totalScore }: SumClientProps) {
  const [activeTab, setActiveTab] = useState<AgeGroup | 'none'>('20-30')

  const currentEntries = activeTab === 'none' ? noAgeGroup : groups[activeTab]
  const currentLabel = activeTab === 'none' ? 'ไม่ระบุอายุ' : AGE_GROUP_LABELS[activeTab]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="font-semibold mb-3 text-sm">เกณฑ์การให้คะแนน</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/20 rounded-lg p-2.5">
            <Heart className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-sm text-red-600 dark:text-red-400">ถูกใจ</div>
              <div className="text-xs text-muted-foreground">{LIKE_SCORE} คะแนน/ครั้ง</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-2.5">
            <Eye className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-sm text-blue-600 dark:text-blue-400">ดู</div>
              <div className="text-xs text-muted-foreground">{VIEW_SCORE} คะแนน/ครั้ง</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 rounded-lg p-2.5">
            <Play className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-sm text-green-600 dark:text-green-400">เข้าเล่น</div>
              <div className="text-xs text-muted-foreground">{PLAY_SCORE} คะแนน/ครั้ง</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-foreground">{totalStaff}</div>
          <div className="text-xs text-muted-foreground">บุคลากรทั้งหมด</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-foreground">{totalMedia}</div>
          <div className="text-xs text-muted-foreground">สื่อที่ส่งทั้งหมด</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-foreground">{totalSubmitted}</div>
          <div className="text-xs text-muted-foreground">คนที่ส่งสื่อแล้ว</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-yellow-600">{totalScore}</div>
          <div className="text-xs text-muted-foreground">คะแนนรวมทั้งหมด</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {AGE_GROUP_LABELS[tab]}
              <span className={`ml-1.5 text-xs ${activeTab === tab ? 'text-blue-100' : 'text-muted-foreground'}`}>
                ({groups[tab].length})
              </span>
            </button>
          ))}
          {noAgeGroup.length > 0 && (
            <button
              onClick={() => setActiveTab('none')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'none'
                  ? 'bg-blue-600 text-white'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              ไม่ระบุอายุ
              <span className={`ml-1.5 text-xs ${activeTab === 'none' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                ({noAgeGroup.length})
              </span>
            </button>
          )}
        </div>

        {/* Active Tab Header */}
        <div className="px-6 py-3 bg-muted/30 border-b border-border">
          <h2 className="font-bold text-foreground">{currentLabel} - รางวัลอันดับ 1-3</h2>
          <p className="text-xs text-muted-foreground">{currentEntries.length} คน</p>
        </div>

        {/* Table */}
        <ScoreTable entries={currentEntries} />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        ข้อมูลอัปเดตอัตโนมัติทุก 1 นาที | สูตร: (ถูกใจ x {LIKE_SCORE}) + (ดู x {VIEW_SCORE}) + (เข้าเล่น x {PLAY_SCORE})
      </p>
    </div>
  )
}
