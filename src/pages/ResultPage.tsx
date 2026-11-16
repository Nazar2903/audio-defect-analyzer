import { Link, useParams } from 'react-router'
import AnalysisReport from '../components/result/AnalysisReport'
import EmptyState from '../components/ui/EmptyState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHistory } from '../context/historyContext'

export default function ResultPage() {
  const { id } = useParams()
  const { items } = useHistory()
  const analysis = items.find((item) => item.id === id)
  useDocumentTitle(analysis ? analysis.fileName : 'Аналіз не знайдено')

  if (!analysis) {
    return (
      <EmptyState
        title="Аналіз не знайдено"
        description="Можливо, його було видалено з історії або посилання неправильне."
        action={
          <Link to="/" className="btn btn-primary">
            Новий аналіз
          </Link>
        }
      />
    )
  }

  return <AnalysisReport analysis={analysis} />
}
