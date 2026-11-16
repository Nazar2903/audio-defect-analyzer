import { DEFECT_TYPES } from '../../constants/defects'
import { isGlobalDefect } from '../../services/defects'
import type { Defect } from '../../types'
import { formatPercent, formatTime } from '../../utils/format'
import { DefectTypeLabel, SeverityBadge } from '../ui/Badges'
import './DefectTable.css'

interface Props {
  defects: Defect[]
  onPlay?: (defect: Defect) => void
}

function getTimeLabel(defect: Defect, isGlobal: boolean): string {
  if (isGlobal) return 'Увесь запис'
  if (defect.end - defect.start < 0.1) return formatTime(defect.start)
  return `${formatTime(defect.start)} – ${formatTime(defect.end)}`
}

export default function DefectTable({ defects, onPlay }: Props) {
  return (
    <div className="defect-table-wrapper">
      <table className="defect-table">
        <caption className="visually-hidden">Список виявлених дефектів</caption>
        <thead>
          <tr>
            <th scope="col">Тип</th>
            <th scope="col">Час</th>
            <th scope="col">Серйозність</th>
            <th scope="col">Впевненість</th>
            <th scope="col">Як усунути</th>
          </tr>
        </thead>
        <tbody>
          {defects.map((defect) => {
            const isGlobal = isGlobalDefect(defect)
            const timeLabel = getTimeLabel(defect, isGlobal)
            return (
              <tr key={defect.id}>
                <td data-label="Тип">
                  <DefectTypeLabel type={defect.type} />
                </td>
                <td data-label="Час">
                  {onPlay && !isGlobal ? (
                    <button
                      type="button"
                      className="defect-time-button"
                      aria-label={`Відтворити з ${formatTime(defect.start)}`}
                      onClick={() => onPlay(defect)}
                    >
                      ▶ {timeLabel}
                    </button>
                  ) : (
                    timeLabel
                  )}
                </td>
                <td data-label="Серйозність">
                  <SeverityBadge severity={defect.severity} />
                </td>
                <td data-label="Впевненість">{formatPercent(defect.confidence)}</td>
                <td data-label="Як усунути">
                  <details className="defect-tip">
                    <summary>Порада</summary>
                    <p>{DEFECT_TYPES[defect.type].recommendation}</p>
                  </details>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
