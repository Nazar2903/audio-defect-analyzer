import type { DemoRecording } from '../types'

export const APP_NAME = 'АудіоСкан'

export const MAX_FILE_SIZE = 50 * 1024 * 1024

export const ACCEPTED_EXTENSIONS = ['wav', 'mp3', 'ogg', 'flac']

export const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(',')

export const MAX_HISTORY_ITEMS = 50

export const STORAGE_KEYS = {
  history: 'audioscan:history',
  settings: 'audioscan:settings',
}

export const DEMO_RECORDINGS: DemoRecording[] = [
  { file: 'demo-voice.wav', title: 'Голосовий запис', description: 'Імітація мовлення, 8 с' },
  { file: 'demo-music.wav', title: 'Музичний фрагмент', description: 'Акорди з перевантаженням, 8 с' },
  { file: 'demo-street.wav', title: 'Запис на вулиці', description: 'Сигнал із фоновим шумом, 8 с' },
]
