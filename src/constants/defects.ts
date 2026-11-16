import type { DefectType, Severity } from '../types'

interface DefectTypeInfo {
  label: string
  description: string
  recommendation: string
  color: string
  scope: 'local' | 'global'
}

interface SeverityInfo {
  label: string
  weight: number
  rank: number
}

export const DEFECT_TYPES: Record<DefectType, DefectTypeInfo> = {
  clipping: {
    label: 'Кліпінг',
    description: 'Сигнал перевищив максимальний рівень, вершини хвилі «обрізані».',
    recommendation: 'Знизьте рівень вхідного сигналу (гейн) під час запису або перезапишіть цей фрагмент.',
    color: '#e63946',
    scope: 'local',
  },
  dropout: {
    label: 'Провал сигналу',
    description: 'Короткочасне зникнення звуку посеред запису.',
    recommendation: 'Перевірте кабелі та з’єднання, відновіть фрагмент інтерполяцією або перезапишіть його.',
    color: '#f4a261',
    scope: 'local',
  },
  click: {
    label: 'Клацання',
    description: 'Різкий короткий імпульс, який чути як клацання або тріск.',
    recommendation: 'Скористайтеся інструментом видалення клацань (de-click) в аудіоредакторі.',
    color: '#9b5de5',
    scope: 'local',
  },
  noise: {
    label: 'Фоновий шум',
    description: 'Високий рівень постійного шуму протягом усього запису.',
    recommendation: 'Застосуйте шумозаглушення (noise reduction) і записуйте в тихішому приміщенні.',
    color: '#2a9d8f',
    scope: 'global',
  },
  hum: {
    label: 'Гул мережі 50 Гц',
    description: 'Низькочастотний гул, що наводиться від електромережі.',
    recommendation: 'Використайте режекторний фільтр на 50 Гц і перевірте заземлення обладнання.',
    color: '#457b9d',
    scope: 'global',
  },
  dcOffset: {
    label: 'DC-зміщення',
    description: 'Постійна складова зміщує сигнал відносно нульового рівня.',
    recommendation: 'Застосуйте фільтр високих частот або функцію видалення DC-зміщення.',
    color: '#6c757d',
    scope: 'global',
  },
}

export const DEFECT_TYPE_KEYS = Object.keys(DEFECT_TYPES) as DefectType[]

export const SEVERITIES: Record<Severity, SeverityInfo> = {
  low: { label: 'Низька', weight: 4, rank: 1 },
  medium: { label: 'Середня', weight: 9, rank: 2 },
  high: { label: 'Висока', weight: 16, rank: 3 },
}

export const SEVERITY_KEYS = Object.keys(SEVERITIES) as Severity[]
