import { DEFECT_TYPES, SEVERITIES } from '../constants/defects'
import type { Analysis } from '../types'
import { getQualityGrade, getQualityScore, isGlobalDefect } from './defects'

function getSafeBaseName(fileName: string): string {
  const base = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[^\p{L}\p{N}_-]+/gu, '_')
    .slice(0, 60)
  return base || 'audio'
}

function escapeCsvValue(value: string | number): string {
  let text = String(value)
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`
  }
  if (/[";\n]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function downloadFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function exportAsJson(analysis: Analysis): void {
  const score = getQualityScore(analysis.defects)
  const report = {
    fileName: analysis.fileName,
    analyzedAt: analysis.createdAt,
    info: analysis.info,
    quality: { score, grade: getQualityGrade(score).label },
    defects: analysis.defects.map((defect) => ({
      type: defect.type,
      label: DEFECT_TYPES[defect.type].label,
      start: Number(defect.start.toFixed(3)),
      end: Number(defect.end.toFixed(3)),
      severity: defect.severity,
      confidence: Number(defect.confidence.toFixed(2)),
      recommendation: DEFECT_TYPES[defect.type].recommendation,
    })),
  }
  downloadFile(JSON.stringify(report, null, 2), `${getSafeBaseName(analysis.fileName)}_report.json`, 'application/json')
}

export function exportAsCsv(analysis: Analysis): void {
  const header = ['Тип дефекту', 'Початок, с', 'Кінець, с', 'Серйозність', 'Впевненість, %', 'Рекомендація']
  const rows = analysis.defects.map((defect) => [
    DEFECT_TYPES[defect.type].label,
    isGlobalDefect(defect) ? 'увесь запис' : defect.start.toFixed(2),
    isGlobalDefect(defect) ? 'увесь запис' : defect.end.toFixed(2),
    SEVERITIES[defect.severity].label,
    Math.round(defect.confidence * 100),
    DEFECT_TYPES[defect.type].recommendation,
  ])
  const csv = [header, ...rows].map((row) => row.map(escapeCsvValue).join(';')).join('\n')
  downloadFile(`﻿${csv}`, `${getSafeBaseName(analysis.fileName)}_report.csv`, 'text/csv;charset=utf-8')
}
