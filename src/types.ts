export type DefectType = 'clipping' | 'dropout' | 'click' | 'noise' | 'hum' | 'dcOffset'

export type Severity = 'low' | 'medium' | 'high'

export type Theme = 'light' | 'dark'

export interface Defect {
  id: string
  type: DefectType
  start: number
  end: number
  severity: Severity
  confidence: number
}

export interface AudioInfo {
  format: string
  size: number
  duration: number
  sampleRate: number
  channels: number
  peakDb: number
  rmsDb: number
}

export interface Analysis {
  id: string
  fileName: string
  createdAt: string
  info: AudioInfo
  defects: Defect[]
  audioUrl?: string
}

export interface Settings {
  theme: Theme
  minSeverity: Severity
}

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

export interface DemoRecording {
  file: string
  title: string
  description: string
}
