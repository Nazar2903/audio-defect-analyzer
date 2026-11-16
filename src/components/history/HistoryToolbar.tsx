import type { HistorySort } from '../../services/history'

interface Props {
  query: string
  sort: HistorySort
  onQueryChange: (query: string) => void
  onSortChange: (sort: HistorySort) => void
}

export default function HistoryToolbar({ query, sort, onQueryChange, onSortChange }: Props) {
  return (
    <div className="toolbar">
      <div className="field field-grow">
        <label className="field-label" htmlFor="history-search">
          Пошук за назвою файлу
        </label>
        <input
          id="history-search"
          type="search"
          className="input"
          placeholder="Наприклад, interview.wav"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="history-sort">
          Сортування
        </label>
        <select
          id="history-sort"
          className="select"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as HistorySort)}
        >
          <option value="newest">Спочатку нові</option>
          <option value="oldest">Спочатку старі</option>
          <option value="worst">Спочатку найгірша якість</option>
          <option value="best">Спочатку найкраща якість</option>
        </select>
      </div>
    </div>
  )
}
