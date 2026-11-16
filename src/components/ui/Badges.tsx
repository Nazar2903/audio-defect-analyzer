import { DEFECT_TYPES, SEVERITIES } from '../../constants/defects'
import type { DefectType, Severity } from '../../types'
import './Badges.css'

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`badge severity-${severity}`}>{SEVERITIES[severity].label}</span>
}

export function DefectTypeLabel({ type }: { type: DefectType }) {
  const info = DEFECT_TYPES[type]
  return (
    <span className="defect-type" title={info.description}>
      <span className="defect-type-dot" style={{ backgroundColor: info.color }} aria-hidden="true" />
      {info.label}
    </span>
  )
}
