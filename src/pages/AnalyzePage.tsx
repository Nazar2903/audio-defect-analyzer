import { Link } from 'react-router'
import HistoryItem from '../components/history/HistoryItem'
import AnalysisProgress from '../components/upload/AnalysisProgress'
import DemoRecordings from '../components/upload/DemoRecordings'
import DropZone from '../components/upload/DropZone'
import HowItWorks from '../components/upload/HowItWorks'
import { useAnalysis } from '../hooks/useAnalysis'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHistory } from '../context/historyContext'

const RECENT_COUNT = 3

export default function AnalyzePage() {
  useDocumentTitle('Новий аналіз')
  const { state, analyzeFile, analyzeDemo, cancel } = useAnalysis()
  const { items } = useHistory()
  const recent = items.slice(0, RECENT_COUNT)
  const isBusy = state.status === 'validating' || state.status === 'analyzing'

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Аналіз аудіозапису</h1>
          <p>Знайдіть кліпінг, провали сигналу, клацання, шум і гул у вашому записі.</p>
        </div>
      </div>

      <section className="card" aria-label="Завантаження файлу">
        {state.status === 'validating' && (
          <AnalysisProgress fileName={state.fileName} stage="Перевірка файлу…" onCancel={cancel} />
        )}
        {state.status === 'analyzing' && (
          <AnalysisProgress fileName={state.fileName} stage={state.stage} progress={state.progress} onCancel={cancel} />
        )}
        {!isBusy && (
          <DropZone error={state.status === 'error' ? state.message : undefined} onFileSelect={analyzeFile} />
        )}
      </section>

      <DemoRecordings disabled={isBusy} onSelect={analyzeDemo} />

      {recent.length > 0 && (
        <section className="card" aria-labelledby="recent-title">
          <div className="page-header">
            <h2 id="recent-title">Останні аналізи</h2>
            <Link to="/history">Уся історія</Link>
          </div>
          <ul className="history-list">
            {recent.map((analysis) => (
              <HistoryItem key={analysis.id} analysis={analysis} />
            ))}
          </ul>
        </section>
      )}

      <HowItWorks />
    </>
  )
}
