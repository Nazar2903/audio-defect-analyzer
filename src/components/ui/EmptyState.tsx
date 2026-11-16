import type { ReactNode } from 'react'

interface Props {
  title: string
  description: string
  action?: ReactNode
}

export default function EmptyState({ title, description, action }: Props) {
  return (
    <div className="empty-state">
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="27" fill="var(--color-primary-soft)" />
        <path d="M16 28h3M22 22v12M28 17v22M34 23v10M40 28h0" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <h2>{title}</h2>
      <p className="muted">{description}</p>
      {action}
    </div>
  )
}
