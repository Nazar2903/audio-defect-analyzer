import { DEFECT_TYPES } from '../../constants/defects'
import type { DefectSort, DefectTypeFilter } from '../../services/defects'
import type { DefectType } from '../../types'

interface Props {
  types: DefectType[]
  type: DefectTypeFilter
  sort: DefectSort
  onTypeChange: (type: DefectTypeFilter) => void
  onSortChange: (sort: DefectSort) => void
}

export default function DefectFilters({ types, type, sort, onTypeChange, onSortChange }: Props) {
  return (
    <div className="toolbar">
      <div className="field">
        <label className="field-label" htmlFor="defect-type-filter">
          Тип дефекту
        </label>
        <select
          id="defect-type-filter"
          className="select"
          value={type}
          onChange={(event) => onTypeChange(event.target.value as DefectTypeFilter)}
        >
          <option value="all">Усі типи</option>
          {types.map((item) => (
            <option key={item} value={item}>
              {DEFECT_TYPES[item].label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label className="field-label" htmlFor="defect-sort">
          Сортування
        </label>
        <select
          id="defect-sort"
          className="select"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as DefectSort)}
        >
          <option value="time">За часом</option>
          <option value="severity">За серйозністю</option>
          <option value="confidence">За впевненістю</option>
        </select>
      </div>
    </div>
  )
}
