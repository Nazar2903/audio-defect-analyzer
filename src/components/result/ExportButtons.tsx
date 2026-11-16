import { useToast } from '../../context/toastContext'
import { exportAsCsv, exportAsJson } from '../../services/exportReport'
import type { Analysis } from '../../types'

export default function ExportButtons({ analysis }: { analysis: Analysis }) {
  const { showToast } = useToast()

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      exportAsJson(analysis)
    } else {
      exportAsCsv(analysis)
    }
    showToast('success', `Звіт збережено у форматі ${format.toUpperCase()}`)
  }

  return (
    <div className="export-buttons" role="group" aria-label="Експорт звіту">
      <button type="button" className="btn btn-secondary" onClick={() => handleExport('json')}>
        Експорт JSON
      </button>
      <button type="button" className="btn btn-secondary" onClick={() => handleExport('csv')}>
        Експорт CSV
      </button>
    </div>
  )
}
