import { Link } from 'react-router'
import { getQualityGrade, getQualityScore } from '../../services/defects'
import type { Analysis } from '../../types'
import { formatDate, formatDuration } from '../../utils/format'
import './HistoryItem.css'

interface Props {
  analysis: Analysis
  onDelete?: (analysis: Analysis) => void
}

export default function HistoryItem({ analysis, onDelete }: Props) {
  const score = getQualityScore(analysis.defects)
  const grade = getQualityGrade(score)

  return (
    <li className="history-item">
      <div className={`history-item-score score-${grade.level}`} aria-label={`Оцінка якості ${score} зі 100`}>
        {score}
      </div>
      <div className="history-item-body">
        <Link to={`/result/${analysis.id}`} className="history-item-name">
          {analysis.fileName}
        </Link>
        <p className="history-item-meta">
          {formatDate(analysis.createdAt)} · {formatDuration(analysis.info.duration)} · дефектів: {analysis.defects.length}
        </p>
      </div>
      {onDelete && (
        <button type="button" className="btn btn-ghost btn-small" onClick={() => onDelete(analysis)}>
          Видалити
        </button>
      )}
    </li>
  )
}
