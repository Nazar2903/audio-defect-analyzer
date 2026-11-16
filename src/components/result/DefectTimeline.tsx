import { DEFECT_TYPES } from '../../constants/defects'
import { isGlobalDefect } from '../../services/defects'
import type { Defect } from '../../types'
import { formatDuration } from '../../utils/format'
import './DefectTimeline.css'

interface Props {
  duration: number
  defects: Defect[]
}

export default function DefectTimeline({ duration, defects }: Props) {
  const localDefects = defects.filter((defect) => !isGlobalDefect(defect))

  return (
    <div className="timeline">
      <div className="timeline-track" role="img" aria-label={`Часова шкала запису з ${localDefects.length} позначеними дефектами`}>
        {localDefects.map((defect) => (
          <span
            key={defect.id}
            className="timeline-marker"
            title={DEFECT_TYPES[defect.type].label}
            style={{
              left: `${(defect.start / duration) * 100}%`,
              width: `${((defect.end - defect.start) / duration) * 100}%`,
              backgroundColor: DEFECT_TYPES[defect.type].color,
            }}
          />
        ))}
      </div>
      <div className="timeline-scale">
        <span>0:00</span>
        <span>{formatDuration(duration)}</span>
      </div>
      <p className="muted timeline-note">
        Аудіофайл доступний для відтворення лише в тому сеансі, коли його було завантажено. Щоб прослухати дефекти, проаналізуйте файл повторно.
      </p>
    </div>
  )
}
