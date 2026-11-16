import { DEFECT_TYPE_KEYS, DEFECT_TYPES } from '../constants/defects'
import type { Defect, DefectType, Severity } from '../types'

function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickRandom<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]
}

export type ProgressCallback = (progress: number, stage: string) => void

interface AnalyzerInput {
  fileName: string
  size: number
  duration: number
}

const STAGES = [
  'Підготовка аудіоданих',
  'Пошук кліпінгу',
  'Виявлення провалів сигналу',
  'Пошук клацань',
  'Аналіз шуму та гулу',
  'Формування звіту',
]

const LOCAL_TYPES = DEFECT_TYPE_KEYS.filter((type) => DEFECT_TYPES[type].scope === 'local')
const GLOBAL_TYPES = DEFECT_TYPE_KEYS.filter((type) => DEFECT_TYPES[type].scope === 'global')

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason)
      return
    }
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

function pickSeverity(random: () => number): Severity {
  const value = random()
  if (value < 0.45) return 'low'
  if (value < 0.8) return 'medium'
  return 'high'
}

function getDefectLength(type: DefectType, random: () => number): number {
  if (type === 'click') return 0.02
  if (type === 'clipping') return 0.1 + random() * 0.5
  return 0.2 + random() * 1
}

export function generateDefects({ fileName, size, duration }: AnalyzerInput): Defect[] {
  const random = createRandom(hashString(`${fileName}:${size}`))
  const defects: Defect[] = []
  const localCount = Math.floor(random() * Math.min(8, 3 + duration / 4))

  for (let i = 0; i < localCount; i++) {
    const type = pickRandom(LOCAL_TYPES, random)
    const start = random() * duration * 0.95
    defects.push({
      id: `d${i}`,
      type,
      start,
      end: Math.min(duration, start + getDefectLength(type, random)),
      severity: pickSeverity(random),
      confidence: 0.6 + random() * 0.39,
    })
  }

  GLOBAL_TYPES.forEach((type) => {
    if (random() < 0.3) {
      defects.push({
        id: `g-${type}`,
        type,
        start: 0,
        end: duration,
        severity: pickSeverity(random),
        confidence: 0.6 + random() * 0.39,
      })
    }
  })

  return defects.sort((a, b) => a.start - b.start)
}

export async function analyzeAudio(
  input: AnalyzerInput,
  onProgress: ProgressCallback,
  signal: AbortSignal,
): Promise<Defect[]> {
  const stepDuration = 350 + Math.min(input.duration, 300)
  for (let i = 0; i < STAGES.length; i++) {
    onProgress(Math.round((i / STAGES.length) * 100), STAGES[i])
    await wait(stepDuration, signal)
  }
  onProgress(100, 'Готово')
  return generateDefects(input)
}
