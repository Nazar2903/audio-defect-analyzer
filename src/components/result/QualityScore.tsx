import type { CSSProperties } from 'react'
import { getQualityGrade } from '../../services/defects'
import './ResultCards.css'

export default function QualityScore({ score }: { score: number }) {
  const grade = getQualityGrade(score)
  const ringStyle = { '--score': score } as CSSProperties

  return (
    <section className="card result-card" aria-labelledby="score-title">
      <h2 id="score-title">Оцінка якості</h2>
      <div className={`score-ring score-ring-${grade.level}`} style={ringStyle}>
        <div className="score-ring-inner">
          <span className="score-value">{score}</span>
          <span className="score-max">зі 100</span>
        </div>
      </div>
      <p className="score-grade">{grade.label} якість</p>
    </section>
  )
}
