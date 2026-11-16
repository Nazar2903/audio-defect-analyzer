import { DEFECT_TYPE_KEYS } from '../../constants/defects'
import { countByType } from '../../services/defects'
import type { Defect } from '../../types'
import { DefectTypeLabel } from '../ui/Badges'
import './ResultCards.css'

export default function DefectSummary({ defects }: { defects: Defect[] }) {
  const counts = countByType(defects)
  const presentTypes = DEFECT_TYPE_KEYS.filter((type) => counts[type])

  return (
    <section className="card result-card" aria-labelledby="summary-title">
      <h2 id="summary-title">Знайдені дефекти</h2>
      {presentTypes.length === 0 ? (
        <p className="summary-clean">Дефектів не виявлено. Запис чистий.</p>
      ) : (
        <ul className="summary-list">
          {presentTypes.map((type) => (
            <li key={type}>
              <DefectTypeLabel type={type} />
              <span className="summary-count">{counts[type]}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
