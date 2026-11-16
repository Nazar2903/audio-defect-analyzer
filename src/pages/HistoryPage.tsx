import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import HistoryItem from '../components/history/HistoryItem'
import HistoryToolbar from '../components/history/HistoryToolbar'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHistory } from '../context/historyContext'
import { useToast } from '../context/toastContext'
import { parseHistorySort, searchHistory, sortHistory, type HistorySort } from '../services/history'
import type { Analysis } from '../types'

export default function HistoryPage() {
  useDocumentTitle('Історія аналізів')
  const { items, removeAnalysis } = useHistory()
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [pendingDelete, setPendingDelete] = useState<Analysis | null>(null)

  const query = searchParams.get('q') ?? ''
  const sort = parseHistorySort(searchParams.get('sort'))

  const visibleItems = useMemo(() => sortHistory(searchHistory(items, query), sort), [items, query, sort])

  const updateParam = (key: string, value: string) => {
    setSearchParams(
      (params) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
        return params
      },
      { replace: true },
    )
  }

  const confirmDelete = () => {
    if (!pendingDelete) return
    removeAnalysis(pendingDelete.id)
    showToast('info', `Аналіз «${pendingDelete.fileName}» видалено`)
    setPendingDelete(null)
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Історія порожня"
        description="Тут з’являтимуться результати ваших аналізів. Почніть із завантаження аудіозапису."
        action={
          <Link to="/" className="btn btn-primary">
            Новий аналіз
          </Link>
        }
      />
    )
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Історія аналізів</h1>
          <p>Збережено записів: {items.length}</p>
        </div>
      </div>

      <section className="card" aria-label="Список аналізів">
        <HistoryToolbar
          query={query}
          sort={sort}
          onQueryChange={(value) => updateParam('q', value)}
          onSortChange={(value: HistorySort) => updateParam('sort', value === 'newest' ? '' : value)}
        />
        {visibleItems.length > 0 ? (
          <ul className="history-list">
            {visibleItems.map((analysis) => (
              <HistoryItem key={analysis.id} analysis={analysis} onDelete={setPendingDelete} />
            ))}
          </ul>
        ) : (
          <p className="muted">За запитом «{query}» нічого не знайдено.</p>
        )}
      </section>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Видалити аналіз?"
        message={`Результати аналізу «${pendingDelete?.fileName ?? ''}» буде видалено без можливості відновлення.`}
        confirmLabel="Видалити"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
