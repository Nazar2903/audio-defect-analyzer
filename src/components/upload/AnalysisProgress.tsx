import './AnalysisProgress.css'

interface Props {
  fileName: string
  stage: string
  progress?: number
  onCancel: () => void
}

export default function AnalysisProgress({ fileName, stage, progress, onCancel }: Props) {
  return (
    <div className="analysis-progress" aria-live="polite">
      <p className="analysis-progress-file">{fileName}</p>
      <div className="analysis-progress-row">
        <span>{stage}</span>
        {progress !== undefined && <span>{progress}%</span>}
      </div>
      <progress className="analysis-progress-bar" max={100} value={progress} aria-label="Прогрес аналізу" />
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        Скасувати
      </button>
    </div>
  )
}
