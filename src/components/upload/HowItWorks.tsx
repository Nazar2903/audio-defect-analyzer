import './HowItWorks.css'

const STEPS = [
  { title: 'Завантажте запис', text: 'Перетягніть файл WAV, MP3, OGG або FLAC чи оберіть демонстраційний запис.' },
  { title: 'Дочекайтеся аналізу', text: 'Застосунок перевірить запис на кліпінг, провали, клацання, шум і гул.' },
  { title: 'Отримайте звіт', text: 'Перегляньте дефекти на хвильовій формі, поради щодо усунення та експортуйте звіт.' },
]

export default function HowItWorks() {
  return (
    <section className="card" aria-labelledby="how-title">
      <h2 id="how-title">Як це працює</h2>
      <ol className="how-steps">
        {STEPS.map((step) => (
          <li key={step.title}>
            <h3>{step.title}</h3>
            <p className="muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
