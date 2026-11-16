import type { AudioInfo } from '../../types'
import { formatDb, formatDuration, formatSize } from '../../utils/format'
import './ResultCards.css'

export default function RecordingInfo({ info }: { info: AudioInfo }) {
  const rows = [
    ['Формат', info.format],
    ['Розмір', formatSize(info.size)],
    ['Тривалість', formatDuration(info.duration)],
    ['Частота дискретизації', `${info.sampleRate} Гц`],
    ['Канали', info.channels === 1 ? 'Моно' : `${info.channels} (стерео)`],
    ['Піковий рівень', formatDb(info.peakDb)],
    ['Середній рівень (RMS)', formatDb(info.rmsDb)],
  ]

  return (
    <section className="card result-card" aria-labelledby="info-title">
      <h2 id="info-title">Параметри запису</h2>
      <dl className="info-list">
        {rows.map(([label, value]) => (
          <div key={label} className="info-row">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
