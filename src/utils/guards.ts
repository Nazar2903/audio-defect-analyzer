import { DEFECT_TYPES, SEVERITIES } from '../constants/defects'
import type { Analysis, Defect, Settings } from '../types'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isDefect(value: unknown): value is Defect {
  return (
    isObject(value) &&
    typeof value.id === 'string' &&
    typeof value.type === 'string' &&
    value.type in DEFECT_TYPES &&
    typeof value.severity === 'string' &&
    value.severity in SEVERITIES &&
    typeof value.start === 'number' &&
    typeof value.end === 'number' &&
    typeof value.confidence === 'number'
  )
}

function isAnalysis(value: unknown): value is Analysis {
  return (
    isObject(value) &&
    typeof value.id === 'string' &&
    typeof value.fileName === 'string' &&
    typeof value.createdAt === 'string' &&
    isObject(value.info) &&
    Array.isArray(value.defects) &&
    value.defects.every(isDefect)
  )
}

export function isAnalysisList(value: unknown): value is Analysis[] {
  return Array.isArray(value) && value.every(isAnalysis)
}

export function isSettings(value: unknown): value is Settings {
  return (
    isObject(value) &&
    (value.theme === 'light' || value.theme === 'dark') &&
    typeof value.minSeverity === 'string' &&
    value.minSeverity in SEVERITIES
  )
}
