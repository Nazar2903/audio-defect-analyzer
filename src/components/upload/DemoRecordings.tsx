import { DEMO_RECORDINGS } from '../../constants/app'
import type { DemoRecording } from '../../types'
import './DemoRecordings.css'

interface Props {
  disabled: boolean
  onSelect: (demo: DemoRecording) => void
}

export default function DemoRecordings({ disabled, onSelect }: Props) {
  return (
    <section className="card" aria-labelledby="demo-title">
      <h2 id="demo-title">Немає файлу під рукою?</h2>
      <p className="muted">Спробуйте аналіз на одному з демонстраційних записів.</p>
      <ul className="demo-list">
        {DEMO_RECORDINGS.map((demo) => (
          <li key={demo.file}>
            <button type="button" className="demo-item" disabled={disabled} onClick={() => onSelect(demo)}>
              <span className="demo-item-title">{demo.title}</span>
              <span className="demo-item-description">{demo.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
