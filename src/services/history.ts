import type { Analysis } from '../types'
import { getQualityScore } from './defects'

export type HistorySort = 'newest' | 'oldest' | 'worst' | 'best'

const HISTORY_SORTS: HistorySort[] = ['newest', 'oldest', 'worst', 'best']

export function parseHistorySort(value: string | null): HistorySort {
  return HISTORY_SORTS.find((sort) => sort === value) ?? 'newest'
}

export function searchHistory(items: Analysis[], query: string): Analysis[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return items
  }
  return items.filter((item) => item.fileName.toLowerCase().includes(normalized))
}

export function sortHistory(items: Analysis[], sort: HistorySort): Analysis[] {
  const withScore = items.map((item) => ({ item, score: getQualityScore(item.defects) }))
  withScore.sort((a, b) => {
    switch (sort) {
      case 'oldest':
        return a.item.createdAt.localeCompare(b.item.createdAt)
      case 'worst':
        return a.score - b.score
      case 'best':
        return b.score - a.score
      case 'newest':
        return b.item.createdAt.localeCompare(a.item.createdAt)
    }
  })
  return withScore.map(({ item }) => item)
}
