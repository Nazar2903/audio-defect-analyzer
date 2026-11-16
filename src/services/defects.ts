import { DEFECT_TYPES, SEVERITIES } from '../constants/defects'
import type { Defect, DefectType, Severity } from '../types'

export type DefectSort = 'time' | 'severity' | 'confidence'

export type DefectTypeFilter = DefectType | 'all'

export type QualityLevel = 'good' | 'fair' | 'poor'

interface QualityGrade {
  label: string
  level: QualityLevel
}

const DEFECT_SORTS: DefectSort[] = ['time', 'severity', 'confidence']

export function parseDefectType(value: string | null): DefectTypeFilter {
  return value !== null && value in DEFECT_TYPES ? (value as DefectType) : 'all'
}

export function parseDefectSort(value: string | null): DefectSort {
  return DEFECT_SORTS.find((sort) => sort === value) ?? 'time'
}

export function isGlobalDefect(defect: Defect): boolean {
  return DEFECT_TYPES[defect.type].scope === 'global'
}

export function filterDefects(defects: Defect[], type: DefectTypeFilter, minSeverity: Severity): Defect[] {
  const minRank = SEVERITIES[minSeverity].rank
  return defects.filter(
    (defect) => (type === 'all' || defect.type === type) && SEVERITIES[defect.severity].rank >= minRank,
  )
}

export function sortDefects(defects: Defect[], sort: DefectSort): Defect[] {
  const sorted = [...defects]
  if (sort === 'severity') {
    return sorted.sort((a, b) => SEVERITIES[b.severity].rank - SEVERITIES[a.severity].rank || a.start - b.start)
  }
  if (sort === 'confidence') {
    return sorted.sort((a, b) => b.confidence - a.confidence)
  }
  return sorted.sort((a, b) => a.start - b.start)
}

export function countByType(defects: Defect[]): Partial<Record<DefectType, number>> {
  const counts: Partial<Record<DefectType, number>> = {}
  defects.forEach((defect) => {
    counts[defect.type] = (counts[defect.type] ?? 0) + 1
  })
  return counts
}

export function getQualityScore(defects: Defect[]): number {
  const penalty = defects.reduce((sum, defect) => sum + SEVERITIES[defect.severity].weight, 0)
  return Math.max(0, 100 - penalty)
}

export function getQualityGrade(score: number): QualityGrade {
  if (score >= 85) return { label: 'Відмінна', level: 'good' }
  if (score >= 70) return { label: 'Добра', level: 'good' }
  if (score >= 50) return { label: 'Задовільна', level: 'fair' }
  return { label: 'Погана', level: 'poor' }
}
