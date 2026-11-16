import { Link } from 'react-router'
import EmptyState from '../components/ui/EmptyState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Сторінку не знайдено')

  return (
    <EmptyState
      title="404 — сторінку не знайдено"
      description="Сторінки за цією адресою не існує. Перевірте посилання або поверніться на головну."
      action={
        <Link to="/" className="btn btn-primary">
          На головну
        </Link>
      }
    />
  )
}
