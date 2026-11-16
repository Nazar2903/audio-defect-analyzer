import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE } from '../constants/app'
import { formatSize } from '../utils/format'

type SignatureCheck = (bytes: Uint8Array) => boolean

function readAscii(bytes: Uint8Array, from: number, to: number): string {
  return String.fromCharCode(...bytes.slice(from, to))
}

const signatures: Record<string, SignatureCheck> = {
  wav: (bytes) => readAscii(bytes, 0, 4) === 'RIFF' && readAscii(bytes, 8, 12) === 'WAVE',
  mp3: (bytes) => readAscii(bytes, 0, 3) === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0),
  ogg: (bytes) => readAscii(bytes, 0, 4) === 'OggS',
  flac: (bytes) => readAscii(bytes, 0, 4) === 'fLaC',
}

export function getExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex === -1 ? '' : fileName.slice(dotIndex + 1).toLowerCase()
}

export async function validateAudioFile(file: File): Promise<void> {
  if (file.size === 0) {
    throw new Error('Файл порожній.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Файл завеликий (${formatSize(file.size)}). Максимальний розмір — ${formatSize(MAX_FILE_SIZE)}.`)
  }
  const extension = getExtension(file.name)
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    throw new Error(`Непідтримуваний формат. Дозволено: ${ACCEPTED_EXTENSIONS.join(', ').toUpperCase()}.`)
  }
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  if (!signatures[extension](header)) {
    throw new Error(`Вміст файлу не відповідає формату .${extension}. Можливо, файл пошкоджений або перейменований.`)
  }
}
