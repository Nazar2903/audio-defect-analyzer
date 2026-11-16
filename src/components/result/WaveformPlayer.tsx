import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/plugins/regions'
import { DEFECT_TYPES } from '../../constants/defects'
import { isGlobalDefect } from '../../services/defects'
import type { Defect } from '../../types'
import { formatTime } from '../../utils/format'
import './WaveformPlayer.css'

export interface PlayerHandle {
  seekTo: (time: number) => void
}

interface Props {
  url: string
  duration: number
  defects: Defect[]
  ref?: Ref<PlayerHandle>
}

type LoadStatus = 'loading' | 'ready' | 'error'

const MIN_REGION_LENGTH = 0.06

export default function WaveformPlayer({ url, duration, defects, ref }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<WaveSurfer | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const regions = RegionsPlugin.create()
    const wave = WaveSurfer.create({
      container,
      url,
      height: 110,
      waveColor: '#8a9bd6',
      progressColor: '#3a56d4',
      cursorColor: '#e63946',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      dragToSeek: true,
      plugins: [regions],
    })
    waveRef.current = wave

    wave.on('decode', () => {
      defects
        .filter((defect) => !isGlobalDefect(defect))
        .forEach((defect) => {
          regions.addRegion({
            start: defect.start,
            end: Math.max(defect.end, defect.start + MIN_REGION_LENGTH),
            color: `${DEFECT_TYPES[defect.type].color}55`,
            drag: false,
            resize: false,
          })
        })
    })
    wave.on('ready', () => setStatus('ready'))
    wave.on('error', () => setStatus('error'))
    wave.on('play', () => setIsPlaying(true))
    wave.on('pause', () => setIsPlaying(false))
    wave.on('finish', () => setIsPlaying(false))
    wave.on('timeupdate', (time) => setCurrentTime(Math.floor(time * 10) / 10))
    regions.on('region-clicked', (region, event) => {
      event.stopPropagation()
      region.play()
    })

    return () => {
      wave.destroy()
      waveRef.current = null
    }
  }, [url, defects])

  useImperativeHandle(
    ref,
    () => ({
      seekTo(time) {
        const wave = waveRef.current
        if (!wave) return
        wave.setTime(time)
        wave.play().catch(() => setIsPlaying(false))
      },
    }),
    [],
  )

  const togglePlayback = () => {
    waveRef.current?.playPause().catch(() => setIsPlaying(false))
  }

  return (
    <div className="player">
      <div className="player-wave-wrapper">
        <div ref={containerRef} className="player-wave" />
        {status === 'loading' && <p className="player-overlay">Побудова хвильової форми…</p>}
        {status === 'error' && <p className="player-overlay player-error">Не вдалося завантажити аудіо для відтворення.</p>}
      </div>
      <div className="player-controls">
        <button
          type="button"
          className="btn btn-primary player-toggle"
          disabled={status !== 'ready'}
          aria-label={isPlaying ? 'Пауза' : 'Відтворити'}
          onClick={togglePlayback}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <rect x="3" y="2" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="11" y="2" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M4 2.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 4 2.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <span className="player-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <span className="player-hint muted">Клік по кольоровій ділянці відтворює дефект</span>
      </div>
    </div>
  )
}
