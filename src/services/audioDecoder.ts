import type { AudioInfo } from '../types'
import { getExtension } from './fileValidation'

type AudioContextConstructor = typeof AudioContext

function getAudioContextConstructor(): AudioContextConstructor | undefined {
  const legacyWindow = window as Window & { webkitAudioContext?: AudioContextConstructor }
  return window.AudioContext ?? legacyWindow.webkitAudioContext
}

export async function decodeAudio(file: File): Promise<AudioBuffer> {
  const AudioContextClass = getAudioContextConstructor()
  if (!AudioContextClass) {
    throw new Error('Ваш браузер не підтримує Web Audio API.')
  }
  const context = new AudioContextClass()
  try {
    const data = await file.arrayBuffer()
    return await context.decodeAudioData(data)
  } catch {
    throw new Error('Не вдалося декодувати аудіо. Можливо, файл пошкоджений.')
  } finally {
    void context.close()
  }
}

function toDecibels(value: number): number {
  return value > 0 ? 20 * Math.log10(value) : -Infinity
}

export function getAudioInfo(file: File, buffer: AudioBuffer): AudioInfo {
  const samples = buffer.getChannelData(0)
  let peak = 0
  let sumOfSquares = 0
  for (const sample of samples) {
    const amplitude = Math.abs(sample)
    if (amplitude > peak) {
      peak = amplitude
    }
    sumOfSquares += sample * sample
  }
  return {
    format: getExtension(file.name).toUpperCase(),
    size: file.size,
    duration: buffer.duration,
    sampleRate: buffer.sampleRate,
    channels: buffer.numberOfChannels,
    peakDb: toDecibels(peak),
    rmsDb: toDecibels(Math.sqrt(sumOfSquares / samples.length)),
  }
}
